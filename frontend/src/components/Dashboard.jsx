import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [stats, setStats] = useState({ customers: 0, tasks: 0, deals: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [customers, tasks, deals] = await Promise.all([
          axios.get('http://localhost:5000/api/customers', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/deals', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats({
          customers: customers.data.length,
          tasks: tasks.data.length,
          deals: deals.data.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6"
      >
        <h2 className="text-3xl font-bold mb-6">Tổng quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats.customers}</p>
              <p className="text-gray-500">Tổng số khách hàng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Công việc</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats.tasks}</p>
              <p className="text-gray-500">Tổng số công việc</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats.deals}</p>
              <p className="text-gray-500">Tổng số giao dịch</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;