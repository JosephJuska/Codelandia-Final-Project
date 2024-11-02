import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Layout, Spin } from 'antd';
import NotFound from './NotFound';

const { Title, Paragraph } = Typography;

const VerificationMain = ({ callBack, title, body }) => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(true);
  
  const { token } = useParams();

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      const result = await callBack(token);
      if(!result.success) {
        setNotFound(true);
      }

      setLoading(false);
    };

    validateToken();
  }, [token]);

  return (
    <Layout style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
      {!notFound ? (
        <>
            <Title level={2}>{title}</Title>
            <Paragraph>{body}</Paragraph>
        </>
      ) : loading ? (
        <Spin delay={200} ></Spin>
      ) : (
        <NotFound isData={false} />
      )}
    </Layout>
  );
};

export default VerificationMain;