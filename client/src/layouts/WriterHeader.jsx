import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Layout, Typography, Image, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Logo from '../assets/logo.webp';

const { Title } = Typography;

const calculateAvatarSize = () => {
    const width = window.innerWidth;
    if (width < 768) return 'medium'; 
    return 'large'; 
};
  
const calculateLogoSize = () => {
    const width = window.innerWidth;
    if (width >= 1200) return '100%'; 
    if (width >= 768) return '80%';  
    return '60%'; 
};

const headerBarStyle = { 
    margin: 0, 
    backgroundColor: '#f5f5f5' 
};

const headerBarTitleStyle = { 
    margin: 0, 
    color: '#001529', 
    textAlign: 'center' 
};

const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24 
};

const WriterHeader = () => {
  const [avatarSize, setAvatarSize] = useState(calculateAvatarSize());
  const [logoSize, setLogoSize] = useState(calculateLogoSize());

  useEffect(() => {
    const handleResize = () => {
      setAvatarSize(calculateAvatarSize());
      setLogoSize(calculateLogoSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
        <div style={headerBarStyle}>
            <Title level={5} style={headerBarTitleStyle}>Writer&apos;s Page</Title>
        </div>
        <Layout.Header style={headerStyle}>
        <div className="logo">
            <Link to={'/writer'}>
                <Image src={Logo} preview={false} alt="Techno Logo" style={{ width: logoSize }} />
            </Link>
        </div>
        <div>
            <Link to={'/writer/account'}>
            <Avatar icon={<UserOutlined />} size={avatarSize} />
            </Link>
        </div>
        </Layout.Header>
    </>
  )
}

export default WriterHeader;