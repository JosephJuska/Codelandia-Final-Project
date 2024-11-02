import { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, Switch, Select, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import getUserByID from '../../requests/user/get-user-by-id';
import updateUser from '../../requests/user/update-user';
import deleteUser from '../../requests/user/delete-user';
import requestHandler from '../../utils/request-handler';
import validateUsername from '../../validations/username';
import validateName from '../../validations/user-name';
import validateEmail from '../../validations/email';
import validatePassword from '../../validations/password';
import validateID from '../../validations/id';
import NotFound from '../../components/NotFound';
import showModal from '../../utils/show-result-modal';
import ResultModal from '../../components/ResultModal';
import handleFormError from '../../utils/handle-form-error';
import Spinner from '../../components/Spinner';
import DataDateFields from '../../components/form/DataDateFields';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import getDateInString from '../../utils/get-date-in-string';

const { confirm } = Modal;
const { Title } = Typography;

const UserDetail = () => {
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [user, setUser] = useState(null);
  
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await getUserByID(id);
      requestHandler(result, navigate, '/admin/login', '/');
      
      if (!result.success) {
        setNotFound(true);
        setLoading(false);
        return;
      };

      const userData = result.data;
      form.setFieldsValue({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roleID: userData.roleID,
        isActive: userData.isActive,
        isVerified: userData.verified,
        created_at: getDateInString(userData.createdAt, true),
        updated_at: userData?.updatedAt ? getDateInString(userData.updatedAt, true) : 'Not Updated',
      });
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, [id, navigate, form]);

  const onReset = () => {
    form.setFieldsValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleID: user.roleID,
      isActive: user.isActive,
      isVerified: user.verified,
      created_at: getDateInString(user.createdAt, true),
      updated_at: user?.updatedAt ? getDateInString(user.updatedAt, true) : 'Not Updated',
    });
  };

  const onFinishUpdate = async (values) => {
    setLoadingUpdate(true);

    const result = await updateUser(
        id,
        values.username,
        values.firstName,
        values.lastName,
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
      setLoadingUpdate(false);

      return;
    };

    const resultUpdate = await getUserByID(id);
    requestHandler(result, navigate, '/admin/login', '/');
    if (resultUpdate.success) {
      setUser(resultUpdate.data);
      form.setFieldValue('updated_at', resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated');
      form.setFieldValue("adminPassword", '');
      form.setFieldValue("password", '');
    }
    showModal(setModalData, setModalVisible, 'success', 'User updated successfully!');
    setLoadingUpdate(false);
  };

  const showDeleteConfirm = () => {
    form.validateFields(['adminPassword']).then(async ({ adminPassword }) => {
      confirm({
        title: 'Are you sure you want to delete this user?',
        icon: <ExclamationCircleOutlined />,
        content: 'This action cannot be undone.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          setDeleting(true);
          const result = await deleteUser(id, adminPassword);
          requestHandler(result, navigate, '/admin/login', '/');
          
          if (result.success) {
            setDeleted(true);
            showModal(setModalData, setModalVisible, 'success', 'User deleted successfully!');
          }
          setDeleting(false);
        },
      });
    }).catch(() => {
      showModal(setModalData, setModalVisible, 'error', 'Please enter admin password to proceed.');
    });
  };

  if (notFound) {
    return (<NotFound isData={false} />)
  };

  if (loading || deleting) {
    return (
      <Spinner />
    );
  };

  if (deleted) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh' }}>
        <Title>Deletion has been successful</Title>
        <Button type="primary" onClick={() => navigate('/admin/user')}>Return to Main Page</Button>
      </div>
    );
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinishUpdate} scrollToFirstError>
      <Title level={2}>Update User Details</Title>
      <UndoFieldsButton onReset={onReset} />
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
            validator: async (_, value) => {
                if (value) {
                    const result = await validatePassword(value, false);
                    if (!result.success) return Promise.reject(result.error);
                }
                return Promise.resolve(); 
            }
        }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Role"
        name="roleID"
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
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Verified"
        name="isVerified"
        valuePropName="checked"
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Title level={4}>Note: Your password is required for both actions</Title>

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

      <DataDateFields />

      <div style={{ maxWidth: 500, display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Form.Item>
            <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update User</Button>
        </Form.Item>

        <Form.Item>
            <Button type="primary" danger onClick={showDeleteConfirm}>Delete User</Button>
        </Form.Item>
      </div>

      <ResultModal 
        modalData={modalData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigate={navigate}
      />
    </Form>
  );
};

export default UserDetail;