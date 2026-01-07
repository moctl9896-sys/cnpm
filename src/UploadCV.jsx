import React, { useState } from 'react';
// 1. Thêm Modal vào import
import { Button, Card, Steps, Result, Spin, Typography, message, Input, Tag, Modal } from 'antd';
import { FileTextOutlined, SolutionOutlined, CheckCircleOutlined, ThunderboltOutlined, ExperimentOutlined } from '@ant-design/icons';
// 2. Import hook điều hướng
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const UploadCV = () => {
  const navigate = useNavigate(); // 3. Khởi tạo hook điều hướng
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cvText, setCvText] = useState("");

  const analyzeKeywords = (text) => {
    const lowerText = text.toLowerCase();
    
    // 1. Kho dữ liệu kiến thức (Knowledge Base)
    const rules = [
      {
        keywords: ['java', 'spring', 'springboot', 'backend'],
        role: 'Java Backend Developer',
        strength: 'Có nền tảng tốt về lập trình hướng đối tượng (OOP) và Framework Java.',
        advice: 'Nên tìm hiểu sâu về Microservices và tối ưu SQL Query.'
      },
      {
        keywords: ['react', 'js', 'javascript', 'frontend', 'html', 'css'],
        role: 'Frontend Developer (ReactJS)',
        strength: 'Có tư duy thẩm mỹ và khả năng xây dựng giao diện hiện đại.',
        advice: 'Hãy học thêm Next.js và cách tối ưu hiệu năng Website (SEO).'
      },
      {
        keywords: ['python', 'data', 'ai', 'machine learning', 'pandas'],
        role: 'AI Engineer / Data Analyst',
        strength: 'Tư duy logic thuật toán tốt, phù hợp xử lý dữ liệu lớn.',
        advice: 'Nên xây dựng Portfolio các dự án thực tế trên Kaggle/Github.'
      },
      {
        keywords: ['sql', 'mysql', 'database', 'mongodb'],
        role: 'Database Administrator',
        strength: 'Hiểu biết vững chắc về cơ sở dữ liệu quan hệ.',
        advice: 'Nên mở rộng kiến thức sang NoSQL và Big Data.'
      },
      {
        keywords: ['test', 'qa', 'qc', 'bug'],
        role: 'Software Tester (QA/QC)',
        strength: 'Cẩn thận, tỉ mỉ, có tư duy phản biện tốt.',
        advice: 'Nên học thêm về Automation Test (Selenium/Cypress).'
      }
    ];

    // 2. Bộ máy suy luận (Inference Engine)
    let matchedRoles = [];
    let strengths = [];
    let advices = [];

    rules.forEach(rule => {
      const hasKeyword = rule.keywords.some(k => lowerText.includes(k));
      if (hasKeyword) {
        matchedRoles.push(rule.role);
        strengths.push(rule.strength);
        advices.push(rule.advice);
      }
    });

    // 3. Xử lý trường hợp không tìm thấy gì (Fallback)
    if (matchedRoles.length === 0) {
      matchedRoles.push("Fresher / Thực tập sinh IT");
      strengths.push("Có tinh thần học hỏi, đang trong giai đoạn xây dựng nền tảng.");
      advices.push("CV của bạn hơi ngắn. Hãy bổ sung chi tiết các dự án đã làm (Dù là bài tập lớn).");
    }

    return {
      roles: [...new Set(matchedRoles)],
      strengths: [...new Set(strengths)],
      weaknesses: ["Kinh nghiệm thực tế dự án doanh nghiệp còn hạn chế.", "Cần cải thiện kỹ năng Tiếng Anh chuyên ngành."],
      advices: [...new Set(advices)]
    };
  };

  const handleAnalyze = () => {
    // --- BẮT ĐẦU ĐOẠN KIỂM TRA BẢO MẬT ---
    const token = localStorage.getItem('accessToken');
    if (!token) {
        Modal.warning({
            title: 'Yêu cầu đăng nhập',
            content: 'Bạn cần đăng nhập để sử dụng tính năng AI Phân tích này.',
            okText: 'Đăng nhập ngay',
            onOk: () => {
                navigate('/login');
            }
        });
        return; // Dừng lại ngay, không cho chạy tiếp
    }
    // --- KẾT THÚC ĐOẠN KIỂM TRA BẢO MẬT ---

    if (!cvText.trim() || cvText.length < 10) {
      message.warning("Nội dung quá ngắn! Hãy nhập chi tiết hơn.");
      return;
    }

    setLoading(true);
    setCurrent(1);

    // Giả lập thời gian AI "suy nghĩ" mất 2 giây
    setTimeout(() => {
      const aiOutput = analyzeKeywords(cvText);
      setResult(aiOutput);
      setLoading(false);
      setCurrent(2);
      message.success("Hệ thống đã phân tích xong!");
    }, 2000);
  };

  return (
    <div style={{ padding: 40, background: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Card 
        title={<span><ThunderboltOutlined style={{color: '#faad14'}} /> CareerMate Intelligence Engine</span>} 
        style={{ width: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Steps
          current={current}
          items={[
            { title: 'Nhập dữ liệu', icon: <FileTextOutlined /> },
            { title: 'Xử lý Logic', icon: loading ? <Spin /> : <ExperimentOutlined /> },
            { title: 'Kết quả', icon: <CheckCircleOutlined /> },
          ]}
          style={{ marginBottom: 40 }}
        />

        <div style={{ minHeight: 300 }}>
          {/* MÀN HÌNH 1: NHẬP LIỆU */}
          {current === 0 && (
            <div style={{ padding: '0 20px' }}>
              <Title level={4} style={{textAlign: 'center'}}>Hệ thống Phân tích Kỹ năng Tự động</Title>
              <Paragraph style={{textAlign: 'center', color: 'gray'}}>
                Nhập nội dung CV, hệ thống sẽ quét từ khóa để định hướng nghề nghiệp cho bạn.
              </Paragraph>
              
              <TextArea 
                rows={10} 
                placeholder="Ví dụ: Em biết code Java, Spring Boot, MySQL. Em muốn tìm việc Backend..." 
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                style={{ marginBottom: 20, fontSize: 16 }}
              />
              
              <div style={{ textAlign: 'center' }}>
                <Button type="primary" size="large" icon={<ThunderboltOutlined />} onClick={handleAnalyze}>
                  Phân tích ngay
                </Button>
              </div>
            </div>
          )}

          {/* MÀN HÌNH 2: LOADING */}
          {current === 1 && (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <Spin size="large" tip="Đang trích xuất từ khóa..." />
              <div style={{marginTop: 20}}>Hệ thống đang đối chiếu với 50+ tiêu chí tuyển dụng...</div>
            </div>
          )}

          {/* MÀN HÌNH 3: KẾT QUẢ */}
          {current === 2 && result && (
            <div>
              <Result
                status="success"
                title="Phân tích hoàn tất!"
                subTitle="Dưới đây là đánh giá dựa trên dữ liệu bạn cung cấp"
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* 1. Vị trí phù hợp */}
                <Card type="inner" title="🎯 Vị trí đề xuất phù hợp nhất">
                  {result.roles.map((role, idx) => (
                    <Tag color="blue" key={idx} style={{fontSize: 16, padding: '5px 10px', margin: 5}}>
                      {role}
                    </Tag>
                  ))}
                </Card>

                {/* 2. Điểm mạnh */}
                <Card type="inner" title="💪 Điểm mạnh phát hiện được">
                  <ul>
                    {result.strengths.map((str, idx) => <li key={idx}><Text strong>{str}</Text></li>)}
                  </ul>
                </Card>

                {/* 3. Điểm yếu (Cố định) */}
                <Card type="inner" title="⚠️ Điểm cần cải thiện">
                  <ul>
                    {result.weaknesses.map((weak, idx) => <li key={idx} style={{color: '#cf1322'}}>{weak}</li>)}
                  </ul>
                </Card>

                {/* 4. Lời khuyên */}
                <Card type="inner" title="💡 Lộ trình học tập đề xuất" style={{background: '#f6ffed', borderColor: '#b7eb8f'}}>
                  <ul>
                    {result.advices.map((ad, idx) => <li key={idx}>{ad}</li>)}
                  </ul>
                </Card>
              </div>

              <div style={{ textAlign: 'center', marginTop: 30 }}>
                <Button onClick={() => setCurrent(0)}>Phân tích lại</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UploadCV;