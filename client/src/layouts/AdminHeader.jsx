import { Avatar, Layout, Typography, Drawer, Button } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import useWindowSize from '../hooks/useWindowSize';

const { Title } = Typography;

const headerStyle = { 
    backgroundColor: '#fff', 
    padding: '0 24px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
};

const headerTitleStyle = {
    margin: 0, 
    color: '#001529'
};

const AdminHeader = ({ renderCallback, drawerVisible, setDrawerVisible }) => {
  const isSmallWindow = useWindowSize(676);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <>
        { isSmallWindow && <Drawer title="Admin Menu" placement="left" onClose={closeDrawer} open={drawerVisible}>{renderCallback()}</Drawer> }
        <Layout.Header style={headerStyle}>
            { isSmallWindow && <Button type="primary" icon={<MenuOutlined />} onClick={showDrawer} />}
            <Title level={5} style={headerTitleStyle}>Admin&apos;s Page</Title>
            <Link to={'/admin/account'}>
                <Avatar
                icon={<UserOutlined style={{ color: 'black' }} />}
                size='large'
                style={{ backgroundColor: 'transparent' }}
                />
            </Link>
        </Layout.Header>
    </>
  )
}

export default AdminHeader;