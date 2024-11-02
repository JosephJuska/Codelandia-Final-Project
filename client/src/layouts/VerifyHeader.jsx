import Logo from '../assets/logo2.webp';
import { Layout, Row, Col, Image } from 'antd';

const headerStyle = {
    padding: '0 24px', 
    background: 'none' 
};

const headerLogoStyle = {
    padding: '16px 0'
}

const VerifyHeader = () => {
  return (
    <Layout.Header style={headerStyle}>
        <Row align="middle">
          <Col>
            <Image src={Logo} alt="Logo" width={120} style={headerLogoStyle} preview={false} />
          </Col>
        </Row>
    </Layout.Header>
  )
}

export default VerifyHeader;