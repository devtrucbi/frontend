import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Sidebar from './Sidebar';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', interactions: [] });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term)
    );
    setFilteredCustomers(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/customers/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/customers', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setForm({ name: '', email: '', phone: '', address: '', interactions: [] });
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (customer) => {
    let parsedInteractions = [];
    try {
      // Kiểm tra nếu interactions là chuỗi hợp lệ trước khi parse
      if (customer.interactions && typeof customer.interactions === 'string' && customer.interactions.trim() !== '') {
        parsedInteractions = JSON.parse(customer.interactions);
        if (!Array.isArray(parsedInteractions)) {
          parsedInteractions = []; // Đảm bảo interactions là mảng
        }
      }
    } catch (err) {
      console.error('Lỗi khi parse interactions:', err);
      parsedInteractions = []; // Nếu parse thất bại, trả về mảng rỗng
    }

    setForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      interactions: parsedInteractions
    });
    setEditingId(customer.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-o3rljta7f-dang-khois-projects.vercel.app/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCustomers();
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
        <h2 className="text-3xl font-bold mb-6">Quản lý khách hàng</h2>
        <div className="mb-6 flex justify-between items-center">
          <Input
            placeholder="Tìm kiếm khách hàng (theo tên, email, số điện thoại)"
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/3"
          />
          <Button onClick={() => setIsModalOpen(true)}>Thêm khách hàng</Button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/3"
            >
              <h3 className="text-xl font-semibold mb-4">{editingId ? 'Sửa khách hàng' : 'Thêm khách hàng'}</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Họ tên"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                  placeholder="Địa chỉ"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingId ? 'Cập nhật' : 'Thêm'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(customer)}
                      className="mr-2"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerList;