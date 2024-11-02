import { Layout, Typography } from 'antd';

const {Paragraph } = Typography;

const footerStyle = { 
    textAlign: 'center'
};

const textStyle = {
    margin: 0 
}

const VerifyFooter = () => {
  return (
    <Layout.Footer style={footerStyle}>
        <Paragraph style={textStyle}>©2026 Techno. All Rights Reserved.</Paragraph>
    </Layout.Footer>
  )
}

export default VerifyFooter