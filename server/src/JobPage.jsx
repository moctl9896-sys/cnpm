import React, { useState, useEffect } from 'react';
// 1. Thêm Modal vào dòng import từ antd
import { Card, Tag, Button, List, Empty, Modal } from 'antd';
import { BankOutlined, DollarOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const JobPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const defaultJobs = [
        { 
          id: 1, 
          title: 'Java Backend Developer', 
          company: 'FPT Software', 
          salary: '15.000.000 - 25.000.000 VNĐ', 
          skills: ['Java', 'Spring Boot', 'SQL'], 
          status: 'Approved' 
        },
        { 
          id: 2, 
          title: 'Frontend ReactJS', 
          company: 'VNG Corp', 
          salary: '10.000.000 - 15.000.000 VNĐ',
          skills: ['React', 'Redux'], 
          status: 'Approved' 
        }
    ];

    let storedJobs = JSON.parse(localStorage.getItem('careerMate_jobs'));
    
    if (!storedJobs || storedJobs.length === 0) {
        localStorage.setItem('careerMate_jobs', JSON.stringify(defaultJobs));
        storedJobs = defaultJobs;
    }

    const approvedJobs = storedJobs.filter(job => job.status === 'Approved');
    setJobs(approvedJobs);
  }, []);

  // --- 2. HÀM XỬ LÝ KHI BẤM NÚT (QUAN TRỌNG) ---
  const handleApply = (job) => {
    // Kiểm tra xem có "thẻ bài" (Token) trong túi không
    const token = localStorage.getItem('accessToken');

    if (!token) {
        // TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP
        Modal.warning({
            title: 'Yêu cầu đăng nhập',
            content: 'Bạn cần đăng nhập tài khoản để ứng tuyển công việc này.',
            okText: 'Đăng nhập ngay',
            onOk: () => {
                // Chuyển hướng sang trang Login
                navigate('/login');
            }
        });
        return; // Dừng lại, không chạy code bên dưới
    }

    // TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP -> Cho phép đi tiếp
    navigate('/apply-job', { state: { job: job } });
  };

  return (
    <div style={{ padding: 40, background: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 20, color: '#1890ff' }}>🔥 Việc làm đã được kiểm duyệt</h2>
      
      {jobs.length === 0 ? <Empty description="Chưa có việc làm nào được duyệt" /> : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={jobs}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.title} hoverable>
                <p><BankOutlined /> <strong>{item.company}</strong></p>
                <p><DollarOutlined /> <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>{item.salary}</span></p>
                
                <div style={{ marginTop: 10, marginBottom: 20 }}>
                  {item.skills.map((skill, idx) => <Tag color="blue" key={idx}>{skill}</Tag>)}
                </div>
                
                {/* Nút bấm gọi hàm handleApply đã được bảo vệ */}
                <Button type="primary" block icon={<SendOutlined />} onClick={() => handleApply(item)}>
                  Ứng tuyển ngay
                </Button>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
export default JobPage;