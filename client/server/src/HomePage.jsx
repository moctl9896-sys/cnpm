import React from 'react';
import { Button, Input, Row, Col, Card, Typography, Statistic, Divider, Space } from 'antd';
import { SearchOutlined, RocketOutlined, SafetyCertificateOutlined, RobotOutlined, CodeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/jobs'); // Chuyển sang trang việc làm
  };

  return (
    <div style={{ background: '#fff' }}>
      
      {/* 1. HERO SECTION (BANNER TÌM KIẾM) */}
      <div style={{ 
        background: 'linear-gradient(135deg, #001529 0%, #0050b3 100%)', 
        padding: '100px 20px', 
        textAlign: 'center',
        color: 'white'
      }}>
        <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: 20 }}>
          Khởi đầu sự nghiệp IT cùng <span style={{ color: '#40a9ff' }}>CareerMate</span>
        </Title>
        <Paragraph style={{ color: '#d9d9d9', fontSize: '1.2rem', marginBottom: 40 }}>
          Hơn 1,000+ việc làm IT được kiểm duyệt & Công cụ AI tối ưu hóa CV của bạn
        </Paragraph>
        
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Input.Search 
            placeholder="Bạn muốn tìm việc gì? (Ví dụ: Java, React, Tester...)" 
            enterButton={<Button type="primary" size="large" icon={<SearchOutlined />}>Tìm việc ngay</Button>}
            size="large"
            onSearch={handleSearch}
            style={{ borderRadius: 6 }}
          />
        </div>
      </div>

      {/* 2. THỐNG KÊ (STATS) */}
      <div style={{ maxWidth: 1200, margin: '-50px auto 50px', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <Statistic title="Việc làm mới 24h qua" value={58} prefix={<RocketOutlined style={{color: '#1890ff'}} />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <Statistic title="Nhà tuyển dụng uy tín" value={120} prefix={<SafetyCertificateOutlined style={{color: '#52c41a'}} />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <Statistic title="Hồ sơ đã phân tích" value={2500} prefix={<RobotOutlined style={{color: '#eb2f96'}} />} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 3. CÔNG NGHỆ HOT */}
      <div style={{ padding: '40px 20px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>🔥 Công nghệ đang Hot</Title>
          <Row gutter={[16, 16]}>
            {['Java', 'ReactJS', 'Python', 'NodeJS', 'Tester', 'DevOps', 'Golang', '.NET'].map((tech) => (
              <Col xs={12} sm={6} md={6} lg={3} key={tech}>
                <Card hoverable style={{ textAlign: 'center', borderRadius: 8 }} onClick={handleSearch}>
                  <CodeOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 10 }} />
                  <div style={{ fontWeight: 'bold' }}>{tech}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 4. TẠI SAO CHỌN CAREERMATE? */}
      <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
             <img 
                src="https://img.freepik.com/free-vector/job-interview-conversation_74855-4393.jpg" 
                alt="Feature" 
                style={{ width: '100%', borderRadius: 20 }} 
             />
          </Col>
          <Col xs={24} md={12}>
            <Title level={2}>Tại sao chọn CareerMate?</Title>
            <Paragraph style={{ fontSize: 16 }}>
              Chúng tôi không chỉ là cầu nối, chúng tôi là người bạn đồng hành trong sự nghiệp của bạn.
            </Paragraph>
            <Space direction="vertical" size="large">
              <Card size="small" style={{ borderLeft: '4px solid #1890ff' }}>
                <Text strong><SafetyCertificateOutlined /> Tin tuyển dụng xác thực:</Text> 100% việc làm được Admin kiểm duyệt thủ công.
              </Card>
              <Card size="small" style={{ borderLeft: '4px solid #eb2f96' }}>
                <Text strong><RobotOutlined /> AI Review CV:</Text> Công nghệ AI phân tích từ khóa, giúp CV của bạn lọt vào mắt xanh nhà tuyển dụng.
              </Card>
            </Space>
            <Button type="primary" size="large" style={{ marginTop: 30 }} onClick={() => navigate('/cv-analysis')}>
              Thử tính năng AI ngay
            </Button>
          </Col>
        </Row>
      </div>
      
    </div>
  );
};

export default HomePage;