import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Kiểm tra nếu người dùng hiện tại là admin
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data.role === 'admin') {
            setIsAdmin(true);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        });
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Register Payload:', { email, password, name });
  try {
    await axios.post('http://localhost:5000/api/users/register', { email, password, name });
    navigate('/');
  } catch (err) {
    console.log('Register Error:', err.response?.data);
    setError(err.response?.data?.error || 'Registration failed');
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Họ tên</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mật khẩu</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Vai trò</label>
                <Select value={role} onValueChange={(value) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng</SelectItem>
                    {isAdmin && <SelectItem value="admin">Admin</SelectItem>} {/* Chỉ hiển thị nếu là admin */}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Đăng ký
              </Button>
              <p className="text-center text-sm">
                Đã có tài khoản?{' '}
                <a href="/" className="text-blue-500 hover:underline">
                  Đăng nhập
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;