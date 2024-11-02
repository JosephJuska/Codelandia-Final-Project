import { Layout, Image } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.webp';
import useWindowSize from '../hooks/useWindowSize';

const { Sider } = Layout;

const siderHeaderStyle = { 
  display: 'flex', 
  justifyContent: 'center', 
  padding: 16 
};

const AdminSider = ({ renderCallback }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isSmallWindow = useWindowSize(676);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    !isSmallWindow && (
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse}>
        <div style={siderHeaderStyle}>
          <Link to={'/admin/account'}>
            <Image src={Logo} preview={false} alt="Techno Logo" style={{ width: '100%' }} />
          </Link>
        </div>
        {renderCallback()}
      </Sider>
    )
  );
};

export default AdminSider;