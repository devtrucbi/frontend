import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const UpgradeAccount = () => {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.post('https://backend-3jabm4vln-dang-khois-projects.vercel.app/api/users/upgrade', { userId, promoCode });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Nâng cấp tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Nhập mã khuyến mãi (PROMO2025 hoặc FREEPREMIUM)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full">
            Nâng cấp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpgradeAccount;