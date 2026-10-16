import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [eventUpdates, setEventUpdates] = useState({});

  useEffect(() => {
    const newSocket = io('https://campus-event-manager-1-xz4u.onrender.com', {
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    newSocket.on('global_event_update', (update) => {
      setEventUpdates((prev) => ({
        ...prev,
        [update.eventId]: update,
      }));
    });

    newSocket.on('attendee_update', (update) => {
      setEventUpdates((prev) => ({
        ...prev,
        [update.eventId]: update,
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, eventUpdates }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};