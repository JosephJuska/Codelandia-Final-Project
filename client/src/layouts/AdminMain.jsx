import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const mainStyle = { 
    margin: '16px', 
    padding: '24px', 
    backgroundColor: '#fff' 
};

const AdminMain = () => {
  return (
    <Layout.Content style={mainStyle}>
        <Outlet />
    </Layout.Content>
  )
}

export default AdminMain;