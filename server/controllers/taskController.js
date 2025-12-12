const Task = require('../models/Task');
const { createNotification } = require('../utils/notification');

exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, deadline } = req.body;
        let attachments = [];
        if (req.files) {
            attachments = req.files.map(file => file.path);
        }
        const task = new Task({
            title,
            description,
            assignedTo,
            createdBy: req.user.id,
            priority,
            deadline,
            attachments
        });
        await task.save();

        // Notify assigned user
        const io = req.app.get('io');
        if (assignedTo) {
            await createNotification(
                assignedTo,
                `New task assigned: ${title}`,
                'task_assigned',
                task._id,
                io
            );
            io.to(assignedTo).emit('task_updated', task); // Or specific event
        }

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'employee') {
            // Employees see tasks assigned to them or created by them
            query = { $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }] };
        }
        // Admins see all
        const tasks = await Task.find(query).populate('assignedTo', 'username').populate('createdBy', 'username');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'username createdBy', 'username');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { status, title, description, priority, deadline } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Check permissions ? Assuming RBAC handled in route or here.
        // Employees can only update status usually? Or comment?
        // For simplicity, allow updates.

        task.status = status || task.status;
        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.deadline = deadline || task.deadline;

        await task.save();

        const io = req.app.get('io');

        // Notify creator if status changed
        if (task.createdBy.toString() !== req.user.id) {
            await createNotification(
                task.createdBy,
                `Task updated: ${task.title}`,
                'task_updated',
                task._id,
                io
            );
            io.to(task.createdBy.toString()).emit('task_updated', task);
        }

        // Notify assignee if diff from updater
        if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
            await createNotification(
                task.assignedTo,
                `Task updated: ${task.title}`,
                'task_updated',
                task._id,
                io
            );
            io.to(task.assignedTo.toString()).emit('task_updated', task);
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
