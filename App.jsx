import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, message } from 'antd';
import { 
  UploadOutlined, SolutionOutlined, HomeOutlined, 
  TeamOutlined, SafetyCertificateOutlined, LogoutOutlined, UserOutlined, LoginOutlined 
} from '@ant-design/icons';

// --- IMPORT CÁC TRANG ---
import HomePage from './HomePage';
import JobPage from './JobPage';
import UploadCV from './UploadCV';
import ApplyJob from './ApplyJob';
import RecruiterDashboard from './RecruiterDashboard';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage'; 

const { Header, Content, Footer } = Layout;

// 1. CẤU HÌNH BẢO VỆ
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" replace />;
  
  if (children.type.name === "AdminDashboard" && role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// 2. MENU COMPONENT (Đã fix lỗi Dropdown)
const AppMenu = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    if (token) {
      setUser({ name, role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    message.success('Đã đăng xuất!');
    setTimeout(() => {
        window.location.href = '/login'; 
    }, 500);
  };

  const menuItems = [
    { 
        key: '1', 
        label: <span style={{ fontWeight: 'bold' }}>Xin chào, {user?.name}</span>, 
        icon: <UserOutlined />,
        disabled: true 
    },
    { type: 'divider' },
    { 
        key: '2', 
        label: 'Đăng xuất', 
        icon: <LogoutOutlined />, 
        danger: true, 
        onClick: handleLogout 
    }
  ];

  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
      <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} style={{ flex: 1, minWidth: 400, border: 'none' }}>
        <Menu.Item key="/" icon={<HomeOutlined />}><Link to="/">Trang chủ</Link></Menu.Item>
        <Menu.Item key="/jobs" icon={<UploadOutlined />}><Link to="/jobs">Việc làm</Link></Menu.Item>
        <Menu.Item key="/cv-analysis" icon={<SolutionOutlined />}><Link to="/cv-analysis">AI Review</Link></Menu.Item>
        
        {(user?.role === 'RECRUITER' || user?.role === 'ADMIN') && (
            <Menu.Item key="/recruiter" icon={<TeamOutlined />}><Link to="/recruiter">Nhà tuyển dụng</Link></Menu.Item>
        )}
        {user?.role === 'ADMIN' && (
          <Menu.Item key="/admin" icon={<SafetyCertificateOutlined />} style={{ color: '#ff4d4f' }}>
            <Link to="/admin">Admin System</Link>
          </Menu.Item>
        )}
      </Menu>

      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer', color: 'white' }}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <span style={{ display: 'inline-block', maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', verticalAlign: 'middle' }}>
                {user.name}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Link to="/login">
            <Button type="primary" icon={<LoginOutlined />} style={{ borderRadius: 20 }}>
              Đăng nhập / Đăng ký
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

// 3. LAYOUT CHÍNH (Xử lý ẩn hiện Header/Footer)
// Đây là phần quan trọng giúp trang Login full màn hình
const MainLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <Layout className="layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Chỉ hiện Header khi KHÔNG PHẢI trang Login */}
            {!isLoginPage && (
                <Header style={{ display: 'flex', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: 22, marginRight: 40, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        🚀 CareerMate
                    </div>
                    <AppMenu />
                </Header>
            )}

            <Content style={{ padding: '0', flex: 1, background: '#f0f2f5' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/jobs" element={<JobPage />} />
                    <Route path="/cv-analysis" element={<UploadCV />} />
                    <Route path="/apply-job" element={<ApplyJob />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/recruiter" element={<RecruiterDashboard />} />
                    
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Content>

            {/* Chỉ hiện Footer khi KHÔNG PHẢI trang Login */}
            {!isLoginPage && (
                <Footer style={{ textAlign: 'center', background: '#001529', color: 'gray' }}>
                    CareerMate ©2026 Created by Student
                </Footer>
            )}
        </Layout>
    );
};

// APP COMPONENT
const App = () => {
  // Thêm đoạn này để ép full màn hình cho chắc chắn
  useEffect(() => {
    document.body.style.margin = "0";
    const root = document.getElementById('root');
    if(root) {
        root.style.width = "100%";
        root.style.maxWidth = "none";
    }
  }, []);

  return (
    <Router>
        <MainLayout />
    </Router>
  );
};

export default App;