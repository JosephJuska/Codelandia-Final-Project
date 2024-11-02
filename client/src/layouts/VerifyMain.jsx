import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const contentStyle = { 
    padding: '50px', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
}

const VerifyMain = () => {
  return (
    <Layout.Content style={contentStyle}>
        <Outlet />
    </Layout.Content>
  )
}

export default VerifyMain