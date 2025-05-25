import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from './Sidebar';

const AdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    total_customers: 0,
    completed_tasks: 0,
    closed_deals: 0,
    total_deal_amount: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/advanced-analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAnalytics(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch analytics');
        console.error('Fetch Analytics Error:', err.response?.data);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6"
      >
        <h2 className="text-3xl font-bold mb-6">Phân tích dữ liệu nâng cao</h2>
        {error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Thống kê chi tiết (Chỉ dành cho Premium)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>Tổng số khách hàng:</strong> {analytics.total_customers}</p>
                <p><strong>Công việc hoàn thành:</strong> {analytics.completed_tasks}</p>
                <p><strong>Giao dịch đóng:</strong> {analytics.closed_deals}</p>
                <p><strong>Tổng giá trị giao dịch đóng:</strong> {analytics.total_deal_amount.toLocaleString()} VNĐ</p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default AdvancedAnalytics;