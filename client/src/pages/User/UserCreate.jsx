import { Form, Input, Button, Switch, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import createUser from '../../requests/user/create-user';
import requestHandler from '../../utils/request-handler';
import validateUsername from '../../validations/username';
import validateName from '../../validations/user-name';
import validateEmail from '../../validations/email';
import validatePassword from '../../validations/password';
import validateID from '../../validations/id';
import showModal from '../../utils/show-result-modal';
import ResultModal from '../../components/ResultModal';
import handleFormError from '../../utils/handle-form-error';
import { useState } from 'react';

const CreateUser = () => {
  const [loading, setLoading] = useState(false);
  
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    setLoading(true);

    const result = await createUser(
        values.firstName, 
        values.lastName, 
        values.username, 
        values.email, 
        values.password, 
        values.roleID,
        values.isActive,
        values.isVerified,
        values.adminPassword
    );
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoading(false);

      return;
    };

    showModal(setModalData, setModalVisible, 'success', 'User created successfully!', 'View User', '/admin/user/' + result.data.id);
    setLoading(false);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
      <Form.Item
        label="Username"
        name="username"
        style={{ maxWidth: '500px' }}
        rules={[{
            validator: async (_, value) => {
                const result = await validateUsername(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="First Name"
        name="firstName"
        style={{ maxWidth: '500px' }}
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateName(value, 'First Name');
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        style={{ maxWidth: '500px' }}
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateName(value, 'Last Name');
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        style={{ maxWidth: '500px' }}
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateEmail(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        style={{ maxWidth: '500px' }}
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validatePassword(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Role"
        name="roleID"
        initialValue={1}
        style={{ maxWidth: '500px' }}
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateID(value, true);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Select>
            <Select.Option key='customer' value={1}>Customer</Select.Option>
            <Select.Option key='writer' value={2}>Writer</Select.Option>
            <Select.Option key='admin' value={3}>Admin</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Active"
        name="isActive"
        valuePropName="checked"
        initialValue={true}
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Verified"
        name="isVerified"
        valuePropName="checked"
        initialValue={false}
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Your Password"
        name="adminPassword"
        style={{ maxWidth: '500px' }}
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validatePassword(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Create User</Button>
      </Form.Item>

      <ResultModal 
        modalData={modalData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigate={navigate}
      />
    </Form>
  );
};

export default CreateUser;