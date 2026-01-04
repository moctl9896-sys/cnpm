import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Card, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 1. KHI VÀO TRANG: Lấy dữ liệu từ bộ nhớ ra
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('careerMate_jobs')) || [];
    setJobs(savedJobs);
  }, []);

  // 2. KHI ĐĂNG TIN: Lưu vào bộ nhớ với trạng thái "Pending"
  const handlePostJob = (values) => {
    const newJob = {
      id: Date.now(), // ID duy nhất
      title: values.title,
      company: values.company, // Thêm tên công ty
      salary: values.salary,
      skills: values.skills.split(',').map(s => s.trim()), 
      status: 'Pending', 
      posted: dayjs().format('DD/MM/YYYY'),
    };

    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    
    // LƯU VĨNH VIỄN VÀO LOCAL STORAGE
    localStorage.setItem('careerMate_jobs', JSON.stringify(updatedJobs));
    
    setIsModalOpen(false);
    form.resetFields();
    message.success('Đã gửi tin đăng! Vui lòng chờ Admin phê duyệt.');
  };

  const columns = [
    { title: 'Vị trí', dataIndex: 'title', key: 'title', render: text => <b>{text}</b> },
    { title: 'Ngày đăng', dataIndex: 'posted', key: 'posted' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        if (status === 'Approved') return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
        if (status === 'Pending') return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ duyệt</Tag>;
        return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
      }
    }
  ];

  return (
    <div style={{ padding: 40, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title="Quản lý tin tuyển dụng" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Đăng tin mới</Button>}>
        <Table columns={columns} dataSource={jobs} rowKey="id" locale={{ emptyText: 'Chưa có tin nào' }} />
      </Card>

      <Modal title="Soạn tin tuyển dụng mới" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handlePostJob}>
          <Form.Item label="Tên công việc" name="title" rules={[{ required: true }]}><Input placeholder="VD: Java Developer" /></Form.Item>
          <Form.Item label="Tên công ty" name="company" rules={[{ required: true }]}><Input placeholder="VD: FPT Software" /></Form.Item>
          <Form.Item label="Mức lương" name="salary" rules={[{ required: true, message: 'Vui lòng nhập mức lương!' }]}>{/* Sửa dòng này để gợi ý người dùng nhập khoảng */}<Input placeholder="Ví dụ: 15 Triệu - 25 Triệu" /></Form.Item>
          <Form.Item label="Kỹ năng (ngăn cách bằng dấu phẩy)" name="skills" rules={[{ required: true }]}><Input placeholder="VD: Java, SQL, Spring" /></Form.Item>
          <Button type="primary" htmlType="submit" block>Gửi duyệt ngay</Button>
        </Form>
      </Modal>
    </div>
  );
};
export default RecruiterDashboard;