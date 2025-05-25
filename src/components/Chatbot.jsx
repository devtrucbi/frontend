import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    // Chatbot logic đơn giản
    let botResponse = 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về cách quản lý khách hàng, công việc, hoặc giao dịch không?';
    if (input.toLowerCase().includes('khách hàng')) {
      botResponse = 'Để quản lý khách hàng, bạn có thể vào mục "Khách hàng" trên sidebar, thêm/sửa/xóa thông tin khách hàng ở đó.';
    } else if (input.toLowerCase().includes('thanh toán')) {
      botResponse = 'Bạn có thể nâng cấp tài khoản Premium qua mục "Nâng cấp tài khoản" để sử dụng các tính năng nâng cao như export PDF không giới hạn.';
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 500);

    setInput('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600">
          <ChatBubbleIcon className="mr-2" /> Chatbot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center p-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="ml-2">
              Gửi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Chatbot;
