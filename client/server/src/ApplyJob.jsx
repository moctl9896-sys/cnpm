import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, message, Steps, Result } from 'antd';
import { UploadOutlined, SendOutlined, BankOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const ApplyJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy thông tin công việc truyền sang
  const jobInfo = location.state?.job || { title: "Vị trí Ứng tuyển", company: "Hệ thống" };
  
  const [current, setCurrent] = useState(0);

  const onFinish = () => {
    setCurrent(1); // Chuyển sang loading
    setTimeout(() => {
      setCurrent(2); // Chuyển sang thành công
      message.success("Nộp hồ sơ thành công!");
    }, 1500);
  };

  return (
    <div style={{ padding: 40, background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 700, borderRadius: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ color: '#1890ff', margin: 0 }}>Ứng tuyển: {jobInfo.title}</h2>
            <p style={{ fontSize: 16, color: '#555' }}><BankOutlined /> {jobInfo.company}</p>
        </div>

        <Steps current={current} items={[{ title: 'Điền đơn' }, { title: 'Đang gửi' }, { title: 'Hoàn tất' }]} style={{ marginBottom: 40 }} />

        {current === 0 && (
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Họ tên" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Ngày/Tháng/Năm Sinh" name="" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Số CCCD/CMND" name="" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Ngày Cấp" name="" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Trình Độ Học Vấn" name="" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="CV đính kèm" name="cv"><Upload><Button icon={<UploadOutlined />}>Chọn File</Button></Upload></Form.Item>

                <Button type="primary" htmlType="submit" block icon={<SendOutlined />}>Gửi hồ sơ</Button>
            </Form>
        )}

        {current === 1 && <div style={{textAlign: 'center', padding: 50}}>Đang gửi dữ liệu...</div>}

        {current === 2 && (
            <Result
                status="success"
                title="Thành công!"
                subTitle="Nhà tuyển dụng sẽ liên hệ sớm nhất."
                extra={[
                    <Button type="primary" key="home" onClick={() => navigate('/')}>Về trang chủ</Button>
                ]}
            />
        )}
      </Card>
    </div>
  );
};

export default ApplyJob;