import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Login Payload:', { email, password });
  try {
    const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userId', res.data.user.id);
    navigate('/dashboard');
  } catch (err) {
    console.log('Login Error:', err.response?.data);
    setError(err.response?.data?.error || 'Login failed');
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
            <CardTitle>Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
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
              <Button onClick={handleSubmit} className="w-full">
                Đăng nhập
              </Button>
              <p className="text-center text-sm">
                Chưa có tài khoản?{' '}
                <a href="/register" className="text-blue-500 hover:underline">
                  Đăng ký
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;