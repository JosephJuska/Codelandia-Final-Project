import { Layout } from 'antd';
import VerifyHeader from './VerifyHeader';
import VerifyFooter from './VerifyFooter';
import VerifyMain from './VerifyMain';

const VerifyLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <VerifyHeader />
      <VerifyMain />
      <VerifyFooter />
    </Layout>
  );
};

export default VerifyLayout;