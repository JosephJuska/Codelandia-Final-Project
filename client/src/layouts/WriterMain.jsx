import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const mainStyle = {
    padding: 24,
    paddingTop: 32,
    margin: 0,
    height: '100%',
};

const WriterMain = () => {
  return (
    <Layout.Content style={mainStyle}>
      <Outlet />
    </Layout.Content>
  )
};

export default WriterMain;