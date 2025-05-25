import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, PersonIcon, BackpackIcon, BarChartIcon, BellIcon,CalendarIcon,ReaderIcon,RocketIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUserRole(res.data.role);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/');
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <>
      <div className="md:hidden p-4">
        <Button onClick={() => setIsOpen(!isOpen)} className="text-white bg-gray-800">
          {isOpen ? 'Đóng' : 'Mở'} Menu
        </Button>
      </div>

      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen || window.innerWidth >= 768 ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="fixed md:static w-64 bg-gray-900 text-white h-screen p-4 z-50"
      >
        <h1 className="text-2xl font-bold mb-6">CRM SaaS</h1>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <HomeIcon className="mr-2" /> Tổng quan
          </NavLink>
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <PersonIcon className="mr-2" /> Khách hàng
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <BackpackIcon className="mr-2" /> Công việc
          </NavLink>
          <NavLink
            to="/deals"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <ReaderIcon className="mr-2" /> Giao dịch
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <BarChartIcon className="mr-2" /> Báo cáo
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <BellIcon className="mr-2" /> Thông báo
          </NavLink>
          <NavLink
            to="/upgrade"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <RocketIcon className="mr-2" /> Nâng cấp tài khoản
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
            }
          >
            <CalendarIcon className="mr-2" /> Lịch công việc
          </NavLink>
          {userRole === 'admin' && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              <PersonIcon className="mr-2" /> Quản lý người dùng
            </NavLink>
          )}
          {userRole === 'premium' && (
          <NavLink to="/advanced-analytics" className="block py-2 px-4 hover:bg-gray-700" activeClassName="bg-gray-700">
            Phân tích nâng cao
          </NavLink>
        )}
        </nav>
        <Button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700"
        >
          Đăng xuất
        </Button>
      </motion.div>
    </>
  );
};

export default Sidebar;