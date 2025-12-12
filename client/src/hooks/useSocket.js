import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const useSocket = () => {
    const { user } = useAuth();
    const socket = useRef(null);

    useEffect(() => {
        if (user && !socket.current) {
            socket.current = io('http://localhost:5000');
            socket.current.emit('join', user.id);

            // Clean up
            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    socket.current = null;
                }
            };
        }
    }, [user]);

    return socket.current;
};

export default useSocket;
