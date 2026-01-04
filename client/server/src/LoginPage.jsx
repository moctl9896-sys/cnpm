import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Divider, Tabs, Typography, Select, Alert, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, FacebookOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // --- 1. KHỞI TẠO DỮ LIỆU MẪU ---
  useEffect(() => {
    checkAndInitData();
  }, []);

  const checkAndInitData = () => {
    const rawData = localStorage.getItem('careerMate_users');
    // Nếu chưa có dữ liệu, tạo admin mặc định
    if (!rawData) {
        const defaultUsers = [
            { name: 'Admin System', email: 'admin@careermate.com', password: 'admin123', role: 'ADMIN' },
            { name: 'HR Manager', email: 'hr@company.com', password: '123', role: 'RECRUITER' },
        ];
        localStorage.setItem('careerMate_users', JSON.stringify(defaultUsers));
        console.log("Đã tạo dữ liệu mẫu!");
    }
  };

  // --- NÚT CỨU HỘ: XÓA SẠCH DỮ LIỆU CŨ ---
  const handleResetData = () => {
    localStorage.removeItem('careerMate_users');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    checkAndInitData(); // Tạo lại admin mới tinh
    message.success("Đã reset dữ liệu! Hãy thử đăng nhập lại bằng admin@careermate.com");
    setTimeout(() => window.location.reload(), 1000);
  };

  // Hàm tạo Token giả
  const generateFakeJWT = (user) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ email: user.email, role: user.role }));
    return `${header}.${payload}.signature`;
  };

  // --- 2. XỬ LÝ ĐĂNG NHẬP ---
  const onLoginFinish = (values) => {
    setLoading(true);
    
    // Xử lý khoảng trắng thừa (trim)
    const emailInput = values.email.trim();
    const passInput = values.password.trim();

    setTimeout(() => {
      setLoading(false);
      
      const rawData = localStorage.getItem('careerMate_users');
      let users = [];
      try {
          users = JSON.parse(rawData) || [];
      } catch (e) {
          users = [];
      }
      
      console.log("Dữ liệu đang có:", users); // Xem trong Console (F12)

      const foundUser = users.find(u => u.email === emailInput);

      if (!foundUser) {
        message.error(`Email "${emailInput}" không tồn tại! Hãy đăng ký trước.`);
        return;
      }

      if (foundUser.password !== passInput) {
        message.error('Sai mật khẩu!');
        return;
      }

      // Đăng nhập thành công
      const token = generateFakeJWT(foundUser);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', foundUser.role);
      localStorage.setItem('userName', foundUser.name);

      message.success("Đăng nhập thành công! Đang chuyển trang...");
      
      setTimeout(() => {
          // Bắt buộc tải lại trang để App.jsx nhận Token
          if (foundUser.role === 'ADMIN') window.location.href = '/admin';
          else if (foundUser.role === 'RECRUITER') window.location.href = '/recruiter';
          else window.location.href = '/';
      }, 500);

    }, 1000);
  };

  // --- 3. XỬ LÝ ĐĂNG KÝ ---
  const onRegisterFinish = (values) => {
    setLoading(true);

    setTimeout(() => {
        setLoading(false);
        const users = JSON.parse(localStorage.getItem('careerMate_users')) || [];

        if (users.some(u => u.email === values.email)) {
            message.error('Email này đã tồn tại!');
            return;
        }

        const newUser = {
            name: values.name,
            email: values.email.trim(), // Xóa khoảng trắng thừa
            password: values.password.trim(),
            role: values.role, 
            status: 'Active'
        };

        const newUsersList = [...users, newUser];
        localStorage.setItem('careerMate_users', JSON.stringify(newUsersList));

        message.success('Đăng ký thành công! Hãy chuyển sang tab Đăng nhập.');
        setActiveTab('login'); 
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      
      {/* NÚT CỨU HỘ (CHỈ HIỆN KHI BỊ LỖI) */}
      <Popconfirm title="Bạn có chắc muốn xóa hết tài khoản cũ để reset?" onConfirm={handleResetData}>
        <Button type="dashed" danger icon={<DeleteOutlined />} style={{ marginBottom: 20 }}>
            Bấm vào đây nếu không đăng nhập được (Reset Data)
        </Button>
      </Popconfirm>

      <Card style={{ width: 450, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Title level={2} style={{ color: '#1890ff', margin: 0 }}>🚀 CareerMate</Title>
        </div>

        <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            centered
            items={[
                {
                    key: 'login',
                    label: 'Đăng nhập',
                    children: (
                        <Form name="login" onFinish={onLoginFinish} layout="vertical" size="large">
                            <Form.Item name="email" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Đăng nhập
                            </Button>
                        </Form>
                    )
                },
                {
                    key: 'register',
                    label: 'Đăng ký mới',
                    children: (
                        <Form name="register" onFinish={onRegisterFinish} layout="vertical" size="large">
                            <Form.Item name="name" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} placeholder="Họ tên" />
                            </Form.Item>
                            <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, min: 3 }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                            </Form.Item>
                            <Form.Item name="role" label="Vai trò" initialValue="CANDIDATE">
                                <Select>
                                    <Select.Option value="CANDIDATE">Ứng viên</Select.Option>
                                    <Select.Option value="RECRUITER">Nhà tuyển dụng</Select.Option>
                                </Select>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                                Đăng ký ngay
                            </Button>
                        </Form>
                    )
                }
            ]}
        />
         <Divider plain style={{ fontSize: 12, color: '#999' }}>Hoặc đăng nhập với</Divider>
        <div style={{ display: 'flex', gap: 10 }}>
            <Button block icon={<GoogleOutlined />}>Google</Button>
            <Button block icon={<FacebookOutlined />}>Facebook</Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;