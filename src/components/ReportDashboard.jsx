import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const ReportDashboard = () => {
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [analyticsData, setAnalyticsData] = useState({
    labels: [],
    datasets: []
  });
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'user');
  const [exportCount, setExportCount] = useState(0);

  useEffect(() => {
    fetchReports();
    fetchAnalyticsData();
    fetchUserRole();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('https://backend-o3rljta7f-dang-khois-projects.vercel.app/api/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReports(res.data);

      const labels = res.data.map(report => report.title);
      const data = res.data.map(report => JSON.parse(report.data).value || 0);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Giá trị báo cáo',
            data,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }
        ]
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const [customers, tasks, deals] = await Promise.all([
        axios.get('https://backend-o3rljta7f-dang-khois-projects.vercel.app/api/customers', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('https://backend-o3rljta7f-dang-khois-projects.vercel.app/api/tasks', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('https://backend-o3rljta7f-dang-khois-projects.vercel.app/api/deals', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);

      // Tạo dữ liệu phân tích theo thời gian (theo tháng)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const customerCounts = new Array(12).fill(0);
      const taskCounts = new Array(12).fill(0);
      const dealCounts = new Array(12).fill(0);

      customers.data.forEach(customer => {
        const month = new Date(customer.created_at).getMonth();
        customerCounts[month]++;
      });

      tasks.data.forEach(task => {
        const month = new Date(task.created_at).getMonth();
        taskCounts[month]++;
      });

      deals.data.forEach(deal => {
        const month = new Date(deal.created_at).getMonth();
        dealCounts[month]++;
      });

      setAnalyticsData({
        labels: months,
        datasets: [
          {
            label: 'Khách hàng',
            data: customerCounts,
            borderColor: 'rgba(59, 130, 246, 1)',
            fill: false,
          },
          {
            label: 'Công việc',
            data: taskCounts,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          },
          {
            label: 'Giao dịch',
            data: dealCounts,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          }
        ]
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserRole = async () => {
    try {
      const res = await axios.get('https://backend-o3rljta7f-dang-khois-projects.vercel.app/api/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserRole(res.data.role);
      localStorage.setItem('userRole', res.data.role);
    } catch (err) {
      console.error(err);
    }
  };

  const exportToPDF = () => {
    if (userRole !== 'premium' && exportCount >= 3) {
      alert('Bạn đã đạt giới hạn export PDF. Vui lòng nâng cấp tài khoản Premium!');
      return;
    }

    const doc = new jsPDF();
    doc.text('Báo cáo CRM SaaS', 10, 10);
    let y = 20;
    reports.forEach((report, index) => {
      const data = JSON.parse(report.data);
      doc.text(`${index + 1}. ${report.title}: ${JSON.stringify(data)}`, 10, y);
      y += 10;
    });
    doc.save('bao_cao_crm.pdf');
    setExportCount(exportCount + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6"
      >
        <h2 className="text-3xl font-bold mb-6">Báo cáo & Phân tích</h2>
        <div className="mb-6 flex justify-end">
          <Button onClick={exportToPDF}>Export PDF</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ báo cáo</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Phân tích theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={analyticsData} options={{ scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách báo cáo</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.map((report) => (
                <div key={report.id} className="mb-4">
                  <h4 className="font-semibold">{report.title}</h4>
                  <p className="text-gray-500">{JSON.stringify(JSON.parse(report.data))}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportDashboard;