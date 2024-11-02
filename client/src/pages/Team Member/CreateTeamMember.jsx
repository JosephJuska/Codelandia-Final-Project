import { useState } from 'react';
import { Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import createTeamMember from '../../requests/team-member/create-team-member'; 
import requestHandler from '../../utils/request-handler';
import validateFullName from '../../validations/team-member/team-member-full-name';  
import validateJobPosition from '../../validations/team-member/team-member-job-position';
import validateDescription from '../../validations/team-member/team-member-short-description';  
import imageValidator from '../../validations/team-member/team-member-image';
import sanitizeFormDataValue from '../../utils/sanitize-form-data-value';
import ResultModal from '../../components/ResultModal';
import handleFormError from '../../utils/handle-form-error';
import Cropper from '../../components/Cropper';
import showModal from '../../utils/show-result-modal';
import PreviewImage from '../../components/PreviewImage';
import handlePreview from '../../utils/handle-preview';

const TeamMemberCreate = () => {
  const [imageFile, setImageFile] = useState(null);
  
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const result = await imageValidator.validateTeamMemberImage(file);
    if (!result.success) {
      form.setFields([{ name: 'image', errors: [result.error] }]);
      return Upload.LIST_IGNORE;
    }
    setImageFile(file);
    return false;
  };

  const handleImageRemove = () => {
    setImageFile(null);
  };

  const onFinish = async (values) => {
    setLoading(true);
    values.image = imageFile;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, sanitizeFormDataValue(value));
    });

    const result = await createTeamMember(formData); 
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoading(false);

      return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Team Member Created Successfully!', 'View Team Member', '/admin/team-member/' + result.data.id);
    setLoading(false);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateFullName(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            },
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Job Position"
        name="jobPosition"
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateJobPosition(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            },
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Short Description"
        name="shortDescription"
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateDescription(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Facebook Link"
        name="facebookLink"
        rules={[{  required: false, type: 'url', message: 'Please enter a valid URL' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Twitter Link"
        name="twitterLink"
        rules={[{  required: false, type: 'url', message: 'Please enter a valid URL' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="YouTube Link"
        name="youtubeLink"
        rules={[{  required: false, type: 'url', message: 'Please enter a valid URL' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Pinterest Link"
        name="pinterestLink"
        rules={[{  required: false, type: 'url', message: 'Please enter a valid URL' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Instagram Link"
        name="instagramLink"
        rules={[{  required: false, type: 'url', message: 'Please enter a valid URL' }]} 
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Profile Image"
        name="image"
        rules={[{ required: true, validator: () => {return imageFile ? Promise.resolve() : Promise.reject('Please select an image')} }]}
      >
        <Cropper
          aspectRatio={1}
          modalTitle="Profile Image"
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={handleImageUpload}
            onRemove={handleImageRemove}
            showUploadList={true}
            onPreview={async () => {return await handlePreview(imageFile, setPreviewFile, setPreviewOpen)}}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Cropper>
      </Form.Item>

      <PreviewImage previewFile={previewFile} setPreviewFile={setPreviewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Create Team Member</Button>
      </Form.Item>

      <ResultModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalData={modalData}
        navigate={navigate}
      />
    </Form>
  );
};

export default TeamMemberCreate;