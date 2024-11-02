import { Button, Form, Input, Layout, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import validatePassword from '../../validations/password';
import validateUsernameOrEmail from '../../validations/username-or-email';
import loginAdmin from '../../requests/auth/admin-login';
import { setAccessToken, setRefreshToken } from '../../utils/token';
import { useNavigate, Link } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';

const WriterLogin = () => {
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
    const result = await loginAdmin(values.usernameOrEmail, values.password, true);
    setLoading(false);
    requestHandler(result, navigate, null, '/writer');
    if(!result.success){
      if(typeof result.error === 'string') setGeneralError([result.error]);
      else {
        const fieldErrors = Object.keys(result.error).map(key => ({
          name: key,
          errors: [result.error[key]]
        }));
        form.setFields(fieldErrors);
      };
    }else{
      const { accessToken, refreshToken } = result.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      navigate('/writer');
      return;
    }
  };

  return (
    <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Helmet>
        <title>Writer&apos;s Login Page</title>
      </Helmet>
      
      <div style={{ width: '100%', maxWidth: '400px', minWidth: '250px' }}>
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
                  if(!result.success) return Promise.reject(result.error);
                  return Promise.resolve();
                }
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
                validator: async (_ , value) => {
                  const result = await validatePassword(value);
                  if(!result.success) return Promise.reject(result.error);
                  return Promise.resolve();
                }
              }
            ]}
            style={{ width: '100%' }}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}
          >
            <Button type='primary' htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Link className="login-form-forgot" to="/verify/reset-password" style={{ marginLeft: '32px' }}>Forgot password</Link>
          </Form.Item>
        </Form>

        <Form.Item style={{ color: 'red' }}>
          <Form.ErrorList errors={generalError}/>
        </Form.Item>
      </div>
    </Layout>
  );
};

export default WriterLogin;