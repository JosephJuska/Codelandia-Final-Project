import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import confirmResetPassword from '../../requests/verify/confirm-reset-password';
import NotFound from '../../components/NotFound';
import validatePassword from '../../validations/password';
import resetPassword from '../../requests/verify/reset-password';
import { useForm } from 'antd/es/form/Form';
import showModal from '../../utils/show-result-modal';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';

const { Title } = Typography;

const ConfirmResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { token } = useParams();
  const [form] = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      const result = await confirmResetPassword(token);
      if(!result.success) {
        setNotFound(true);
      }

      setLoading(false);
    };

    validateToken();
  }, [token, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    const { password } = values;
    setLoading(true);
    
    const result = await resetPassword(token, password);

    if(!result.success) {
        handleFormError(form, result, setModalData, setModalVisible);
        setLoading(false);

        return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Password reset successfully. You can now log in.');
    form.resetFields();
    setLoading(false);
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
      {!notFound ? (
        <>
            <Title level={2}>Reset Your Password</Title>
            <Form
                form={form}
                name="reset_password"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                >
                <Form.Item
                    label="New Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        validator: async (_, value) => {
                            const result = await validatePassword(value);
                            if(!result.success) return Promise.reject(result.error);
                            return Promise.resolve();
                        }
                    }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    dependencies={['password']}
                    rules={[
                    {
                        required: true,
                        validator: async (_, value) => {
                            const result = await validatePassword(value);
                            if(!result.success) return Promise.reject(result.error);
                            return Promise.resolve();
                        }
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(
                            new Error('Passwords do not match')
                        );
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                    Reset Password
                    </Button>
                </Form.Item>
            </Form>

            <ResultModal 
              modalData={modalData}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              navigate={navigate}
            />
        </>
      ) : (
        <NotFound isData={false} />
      )}
    </div>
  );
};

export default ConfirmResetPassword;