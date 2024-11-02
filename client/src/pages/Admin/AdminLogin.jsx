import { Button, Form, Input, Layout, Typography, Spin, Avatar } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import validatePassword from '../../validations/password';
import validateUsernameOrEmail from '../../validations/username-or-email';
import loginAdmin from '../../requests/auth/admin-login';
import { setAccessToken, setRefreshToken } from '../../utils/token';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const AdminLogin = () => {
  const [generalError, setGeneralError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onValueChange = () => {
    setGeneralError([]);
  };

  const onFinish = async (values) => {
    setGeneralError([]);
    setLoading(true);
    const result = await loginAdmin(values.usernameOrEmail, values.password);
    setLoading(false);
    if (!result.success) {
      if (typeof result.error === 'string') setGeneralError([result.error]);
      else {
        const fieldErrors = Object.keys(result.error).map((key) => ({
          name: key,
          errors: [result.error[key]],
        }));
        form.setFields(fieldErrors);
      }
    } else {
      const { accessToken, refreshToken } = result.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      navigate('/admin');
    }
  };

  return (
    <Layout style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Helmet>
        <title>Admin Login Page</title>
      </Helmet>

      <Header
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          width: '100%',
          position: 'fixed',
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography.Title level={5} style={{ margin: 0, color: '#001529' }}>
          Admin&apos;s Page
        </Typography.Title>
        <Link to={'/admin/account'}>
          <Avatar
            icon={<UserOutlined style={{ color: 'black' }} />}
            size="large"
            style={{ backgroundColor: 'transparent' }}
          />
        </Link>
      </Header>

      <Content style={{ marginTop: '100px', width: '100%', maxWidth: '400px', minWidth: '250px' }}>
        <Typography.Title style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</Typography.Title>
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onValuesChange={onValueChange}
          autoComplete="off"
          scrollToFirstError={true}
          layout="vertical"
          requiredMark={true}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Form.Item
            label="Username or Email"
            name="usernameOrEmail"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  const result = await validateUsernameOrEmail(value);
                  if (!result.success) return Promise.reject(result.error);
                  return Promise.resolve();
                },
              },
            ]}
            style={{ width: '100%' }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  const result = await validatePassword(value);
                  if (!result.success) return Promise.reject(result.error);
                  return Promise.resolve();
                },
              },
            ]}
            style={{ width: '100%' }}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Link className="login-form-forgot" to="/verify/reset-password" style={{ marginLeft: '32px' }}>
              Forgot password
            </Link>
          </Form.Item>
        </Form>

        {loading && <Spin size="medium" delay={200} />}

        <Form.Item style={{ color: 'red' }}>
          <Form.ErrorList errors={generalError} />
        </Form.Item>
      </Content>
    </Layout>
  );
};

export default AdminLogin;