import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Sidebar from './Sidebar';

const DealList = () => {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]); // Danh sách khách hàng
  const [form, setForm] = useState({ customer_id: '', title: '', amount: '', stage: 'lead' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetchCustomers(); // Lấy danh sách khách hàng
    fetchDeals();
  }, [navigate]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCustomers(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      } else {
        console.error('Lỗi khi lấy danh sách khách hàng:', err);
      }
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await axios.get('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/deals', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDeals(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      } else {
        console.error('Lỗi khi lấy danh sách giao dịch:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/deals/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEditingId(null);
      } else {
        await axios.post('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/deals', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setForm({ customer_id: '', title: '', amount: '', stage: 'lead' });
      fetchDeals();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      } else {
        console.error('Lỗi khi lưu giao dịch:', err);
      }
    }
  };

  const handleEdit = (deal) => {
    setForm({
      customer_id: deal.customer_id,
      title: deal.title,
      amount: deal.amount,
      stage: deal.stage
    });
    setEditingId(deal.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/deals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDeals();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      } else {
        console.error('Lỗi khi xóa giao dịch:', err);
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
        <h2 className="text-3xl font-bold mb-6">Quản lý giao dịch</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">{editingId ? 'Sửa giao dịch' : 'Thêm giao dịch'}</h3>
          <div className="space-y-4">
            <Select
              value={form.customer_id}
              onValueChange={(value) => setForm({ ...form, customer_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} (ID: {customer.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Tiêu đề"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              placeholder="Số tiền"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <Select
              value={form.stage}
              onValueChange={(value) => setForm({ ...form, stage: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Giai đoạn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Tiềm năng</SelectItem>
                <SelectItem value="contacted">Đã liên hệ</SelectItem>
                <SelectItem value="qualified">Đủ điều kiện</SelectItem>
                <SelectItem value="proposal">Đề xuất</SelectItem>
                <SelectItem value="closed">Đóng</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit} className="w-full">
              {editingId ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Giai đoạn</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>{deal.title}</TableCell>
                <TableCell>{deal.amount}</TableCell>
                <TableCell>{deal.stage}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(deal)}
                    className="mr-2"
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(deal.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default DealList;