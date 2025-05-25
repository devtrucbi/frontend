import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import io from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from './Sidebar';

const socket = io('https://backend-3jabm4vln-dang-khois-projects.vercel.app', {
  auth: {
    token: localStorage.getItem('token')
  }
});

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();

    socket.on('newNotification', (data) => {
      const userId = localStorage.getItem('userId');
      if (data.userId === userId) {
        setNotifications((prev) => [...prev, { message: data.message, is_read: false, created_at: new Date() }]);
      }
    });

    return () => {
      socket.off('newNotification');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/notifications/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6"
      >
        <h2 className="text-3xl font-bold mb-6">Thông báo</h2>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách thông báo</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border-b ${notification.is_read ? 'bg-gray-100' : 'bg-blue-50'}`}
              >
                <p>{notification.message}</p>
                <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                {!notification.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2"
                  >
                    Đánh dấu đã đọc
                  </Button>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotificationList;