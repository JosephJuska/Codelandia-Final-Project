import { useState, useEffect } from 'react';
import { Form, Input, Button, Layout, Typography, Modal, Alert, Divider } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import logout from '../../requests/auth/logout';
import { clearAllTokens } from '../../utils/token';
import getAccountDetailsWriter from '../../requests/auth/get-account-details-writer';
import validateName from '../../validations/name';
import validateUsername from '../../validations/username';
import validatePassword from '../../validations/password';
import validateEmail from '../../validations/email';
import generateDeleteAccount from '../../requests/verify/generate-delete-account';
import generateEmailUpdate from '../../requests/verify/generate-email-update';
import updateAccount from '../../requests/auth/update-account';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../../components/ResultModal';
import WriterStatistics from '../../components/WriterStatistics';
import handleFormError from '../../utils/handle-form-error';
import Spinner from '../../components/Spinner';
import showModal from '../../utils/show-result-modal';
import getDateInString from '../../utils/get-date-in-string';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import DataDateFields from '../../components/form/DataDateFields';

const { Title, Paragraph } = Typography;

const WriterAccount = () => {
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [writer, setWriter] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const [emailForm] = Form.useForm();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWriterData() {
      setLoading(true);
      const result = await getAccountDetailsWriter();
      requestHandler(result, navigate, '/writer/login', '/');
      if(!result.success){
        if (result.critical) {
          setError(result.error || errorMessages.UNEXPECTED_ERROR);
          setLoading(false);
          return;
        } else {
          clearAllTokens();
          navigate('/writer/login');
        }
      };

      setWriter(result.data);
      form.setFieldsValue({
        firstName: result.data?.firstName,
        lastName: result.data?.lastName,
        username: result.data?.username,
        email: result.data?.email,
        created_at: getDateInString(result.data?.createdAt, true),
        updated_at: result.data?.updatedAt ? getDateInString(result.data?.updatedAt, true) : 'Not Updated',
      })
      setStatistics({ totalBlogs: result.data.totalBlogs, publishedBlogs: result.data.publishedBlogs, unPublishedBlogs: result.data.unPublishedBlogs, totalComments: result.data.totalComments });
      setLoading(false);
    };

    fetchWriterData();
  }, [navigate]);

  const onReset = () => {
    form.setFieldsValue({
      firstName: writer?.firstName,
      lastName: writer?.lastName,
      username: writer?.username,
      email: writer?.email,
      created_at: getDateInString(writer?.createdAt, true),
      updated_at: writer?.updatedAt ? getDateInString(writer.updatedAt, true) : 'Not Updated',
    })
  };

  const handleUpdate = async (values) => {
    setUpdateLoading(true);
    const result = await updateAccount(values.firstName, values.lastName, values.username, values.newPassword || null, values.password);
    if(!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);

      setUpdateLoading(false);
      return;
    };
    
    const resultUpdate = await getAccountDetailsWriter();
    requestHandler(result, navigate, '/writer/login', '/');
    if(resultUpdate.success) {
      setWriter(resultUpdate.data);
      form.setFieldValue('updated_at', resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated')
    }
    showModal(setModalData, setModalVisible, 'success', 'Account Updated Successfully');
    setUpdateLoading(false);
  };

  const handleEmailUpdate = async (values) => {
    setEmailLoading(true);
    const { email, password } = values;
    const result = await generateEmailUpdate(email, password);
    if(!result.success) {
      handleFormError(emailForm, result, setModalData, setModalVisible);

      setEmailLoading(false);
      return;
    }

    showModal(setModalData, setModalVisible, 'success', 'Email update request received. Please check your new email to confirm')
    setEmailLoading(false);
  };

  const handleLogout = async () => {
    const result = await logout();
    requestHandler(result, navigate, '/writer/login', '/');
    if(result.critical) {
      showModal(setModalData, setModalVisible, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
    } else {
      clearAllTokens();
      navigate('/writer/login');
    };
  };

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    setDeleteModalVisible(false);
    const result = await generateDeleteAccount();
    if(!result.success) showModal(setModalData, setModalVisible, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
    else showModal(setModalData, setModalVisible, 'success', 'Confirmation for deletion of your account has been sent to your email address');
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  return (
    <Layout style={{ padding: '0 20px' }}>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <>
          <Title>Account Details</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <UndoFieldsButton onReset={onReset} />
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, validator: async (_, value) => {
              const result = await validateName(value, 'First Name');
              if(!result.success) return Promise.reject(result.error);
              return Promise.resolve();
            } }]}>
              <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, validator: async (_, value) => {
              const result = await validateName(value, 'Last Name');
              if(!result.success) return Promise.reject(result.error);
              return Promise.resolve();
            } }]}>
              <Input placeholder="Last Name" />
            </Form.Item>

            <Form.Item label="Username" name="username" rules={[{ required: true, validator: async (_, value) => {
              const result = await validateUsername(value);
              if(!result.success) return Promise.reject(result.error);
              return Promise.resolve();
            } }]}>
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item label="Email" name="email" id="emailReadOnly">
              <Input readOnly />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, validator: async (_, value) => {
                const result = await validatePassword(value, false);
                if(!result.success) return Promise.reject(result.error);
                return Promise.resolve();
              }}]}
            >
              <Input.Password placeholder="New Password (optional)" />
            </Form.Item>

            <Form.Item
              label="Current Password (Required to update names or username)"
              name="password"
              rules={[{ required: true, validator: async (_, value) => {
                const result = await validatePassword(value);
                if(!result.success) return Promise.reject(result.error);
                return Promise.resolve();
              }}]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Link style={{ display: 'inline-block', marginBottom: '16px' }} to="/verify/reset-password">Forgot Password</Link>
            
            <DataDateFields />
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={updateLoading}>
                Update Details
              </Button>
            </Form.Item>

          </Form>

          <Divider />

          <Title level={2}>Statistics</Title>
          <WriterStatistics statistics={statistics} />
          
          <Divider />

          <Title level={2}>Update Email</Title>
          <Paragraph>Please note: A confirmation email will be sent to the new email address.</Paragraph>
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleEmailUpdate}
          >
            <Form.Item
              label="New Email"
              name="email"
              rules={[
                { required: true, validator: async (_, value) => {
                  const result = await validateEmail(value);
                  if(!result.success) return Promise.reject(result.error);
                  return Promise.resolve();
                }}
              ]}
            >
              <Input placeholder="New Email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, validator: async (_, value) => {
                  const result = await validatePassword(value);
                  if(!result.success) return Promise.reject(result.error);
                  return Promise.resolve();
                }}
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={emailLoading}>
              Update Email
            </Button>
          </Form>

          <Layout style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexDirection: 'row', marginTop: '48px', flexWrap: 'wrap', maxWidth: '400px' }}>
            <Button onClick={handleLogout} type="primary" danger style={{ width: 'fit-content' }}>
              Log Out
            </Button>

            <Button type='primary' danger style={{ width: 'fit-content' }} onClick={showDeleteModal}>
              Delete Account 
            </Button>
          </Layout>

          <Modal
            title="Confirm Account Deletion"
            open={isDeleteModalVisible}
            onOk={handleDeleteAccount}
            onCancel={handleCancelDelete}
            okText="Confirm"
            cancelText="Cancel"
          >
            <p>Are you sure you want to delete your account? This action cannot be undone, and a confirmation email will be sent to your current email address to complete the process.</p>
          </Modal>

          <ResultModal 
            modalData={modalData}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            navigate={navigate}
          />
        </>
      )}
    </Layout>
  );
};

export default WriterAccount;