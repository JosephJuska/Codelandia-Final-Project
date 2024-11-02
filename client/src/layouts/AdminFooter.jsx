import { Layout, Typography } from 'antd';

const { Paragraph } = Typography;

const footerTextStyle = {
    textAlign: 'center',
    margin: 0
};

const AdminFooter = () => {
  return (
    <Layout.Footer>
        <Paragraph style={footerTextStyle}>©2026 Techno. All Rights Reserved.</Paragraph>
    </Layout.Footer>
  )
}

export default AdminFooter;