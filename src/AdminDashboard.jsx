import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, message, Tabs } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);

  // 1. Lấy dữ liệu tin tuyển dụng
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('careerMate_jobs')) || [];
    setJobs(savedJobs);
  }, []);

  // 2. Hàm lưu lại vào LocalStorage
  const saveToStorage = (newJobs) => {
    setJobs(newJobs);
    localStorage.setItem('careerMate_jobs', JSON.stringify(newJobs));
  };

  // 3. Hàm DUYỆT TIN
  const handleApprove = (id) => {
    const newJobs = jobs.map(job => 
      job.id === id ? { ...job, status: 'Approved' } : job
    );
    saveToStorage(newJobs);
    message.success('Đã duyệt tin đăng này!');
  };

  // 4. Hàm TỪ CHỐI/XÓA
  const handleReject = (id) => {
    const newJobs = jobs.filter(job => job.id !== id);
    saveToStorage(newJobs);
    message.warning('Đã xóa tin đăng');
  };

  const jobColumns = [
    { title: 'Công ty', dataIndex: 'company', key: 'company' },
    { title: 'Vị trí', dataIndex: 'title', key: 'title' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      render: status => (
        <Tag color={status === 'Pending' ? 'orange' : 'green'}>
          {status === 'Pending' ? 'Chờ duyệt' : 'Đang hiện'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
          )}
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleReject(record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 30, background: '#f0f2f5', minHeight: '100vh' }}>
      <h2>🛡️ Admin Dashboard</h2>
      <Card>
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: 'Kiểm duyệt việc làm',
            children: <Table columns={jobColumns} dataSource={jobs} rowKey="id" />
          }
        ]} />
      </Card>
    </div>
  );
};
export default AdminDashboard;