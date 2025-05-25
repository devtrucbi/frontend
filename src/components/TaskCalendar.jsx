import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import Sidebar from './Sidebar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const TaskCalendar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Dùng để chuyển hướng

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Chuyển hướng về trang đăng nhập nếu không có token
      return;
    }

    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const tasks = res.data.map(task => ({
        title: task.title,
        start: new Date(task.due_date),
        end: new Date(task.due_date),
        allDay: true,
        resource: task
      }));
      setEvents(tasks);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token'); // Xóa token không hợp lệ
        localStorage.removeItem('userId');
        navigate('/'); // Chuyển hướng về trang đăng nhập
      } else {
        console.error('Lỗi khi lấy danh sách công việc:', err);
      }
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
        <h2 className="text-3xl font-bold mb-6">Lịch công việc</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => alert(`Công việc: ${event.title}\nMô tả: ${event.resource.description}`)}
        />
      </motion.div>
    </div>
  );
};

export default TaskCalendar;