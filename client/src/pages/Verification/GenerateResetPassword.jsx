import { Layout, Card, Typography, Form, Input, Button } from 'antd';
import validateEmail from '../../validations/email';
import generateResetPassword from '../../requests/verify/generate-reset-password';
import { useForm } from 'antd/es/form/Form';
import showModal from '../../utils/show-result-modal';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../../components/ResultModal';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

const GenerateResetPassword = () => {
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const result = await generateResetPassword(values.email);
    if(!result.success) {
        if(result.notFound) {
            form.setFields([{name: 'email', errors: [result.error]}]);
            setLoading(false);

            form.scrollToField('email', {
            behavior: 'smooth',
            block: 'center',
            });
            return;
        };

        if(typeof result.error !== 'string') {
          form.setFields([{name: 'email', errors: [result.error?.email]}]);
          setLoading(false);

          form.scrollToField('email', {
            behavior: 'smooth',
            block: 'center',
          });
          return;
        };

        showModal(setModalData, setModalVisible, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
        setLoading(false);
        return;
    }

    form.resetFields();
    showModal(setModalData, setModalVisible, 'success', 'Reset link has been sent to your email.');
    setLoading(false);
    return;
  };

  return (
    <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          title={<Title level={3} style={{ margin: 0 }} >Reset Your Password</Title>}
          style={{ maxWidth: 400, border: 'none' }}
        >
          <Paragraph>Please enter your account email to receive a password reset link.</Paragraph>
          <Form
            name="reset_password"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              name="email"
              rules={[{
                required: true,
                validator: async (_, value) => {
                    const result = await validateEmail(value);
                    if (!result.success) return Promise.reject(result.error);
                    return Promise.resolve();
                }
              }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <ResultModal 
          modalData={modalData}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          navigate={navigate}
        />
    </Layout>
  );
};

export default GenerateResetPassword;