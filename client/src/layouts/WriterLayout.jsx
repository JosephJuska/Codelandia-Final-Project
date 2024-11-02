import { Layout } from 'antd';
import ScrollProgress from '../components/ScrollProgress';
import WriterHeader from './WriterHeader';
import WriterFooter from './WriterFooter';
import WriterMain from './WriterMain';

const layoutStyle = {
  minHeight: '100vh', 
  position: 'relative'
};

const WriterLayout = () => {
  return (
  <Layout style={layoutStyle}>
    <ScrollProgress />
    <WriterHeader />
    <WriterMain />
    <WriterFooter />
  </Layout>
)};

export default WriterLayout;