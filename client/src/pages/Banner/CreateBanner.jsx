import { useState } from 'react';
import { Form, Input, Button, DatePicker, Switch, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import createBanner from '../../requests/banner/create-banner';
import requestHandler from '../../utils/request-handler';
import validateBannerHeader from '../../validations/banner/banner-header';
import validateBannerSubHeader from '../../validations/banner/banner-sub-header';
import validateBannerButtonText from '../../validations/banner/banner-button-text';
import imageValidator from '../../validations/banner/banner-background';
import sanitizeFormDataValue from '../../utils/sanitize-form-data-value';
import { UploadOutlined } from '@ant-design/icons'
import validateBannerActiveTill from '../../validations/banner/banner-active-till';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import Cropper from '../../components/Cropper';
import showModal from '../../utils/show-result-modal';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../../components/PreviewImage';
import dateHandler from '../../utils/date-handler';

const CreateBannerPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    form.setFields([{ name: 'background', errors: [] }]);
    const result = await imageValidator.validateBannerBackground(file);
    if (!result.success) {
      form.setFields([{ name: 'background', errors: [result.error] }]);
      return Upload.LIST_IGNORE;
    };

    setImageFile(file);
    return false;
  };

  const handleImageRemove = () => {
    setImageFile(null);
  };

  const onFinish = async (values) => {
    setLoading(true);
    values.background = imageFile;
    values.activeTill = values?.activeTill ? dateHandler.handleSentDate(values.activeTill) : null;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, sanitizeFormDataValue(value));
    });

    const result = await createBanner(formData);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoading(false);

      return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Banner Created Successfully!', 'View Banner', '/admin/banner/' + result.data.id);
    setLoading(false);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
      <Form.Item
        label="Header"
        name="header"
        rules={[
          {
            required: true,
            validator: async (_, value) => {
              const result = await validateBannerHeader(value);
              if (!result.success) return Promise.reject(result.error);
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Sub Header"
        name="subHeader"
        rules={[
          {
            required: true,
            validator: async (_, value) => {
              const result = await validateBannerSubHeader(value);
              if (!result.success) return Promise.reject(result.error);
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Background Image"
        name="background"
        rules={[{ required: true, validator: async () => {
          if(!imageFile) return Promise.reject('Background must be provided');
        }}]}
      >
        <Cropper
          aspectRatio={16 / 10}
          modalTitle="Background Image"
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

      <PreviewImage previewFile={previewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

      <Form.Item
        label="Button Text"
        name="buttonText"
        rules={[
          {
            required: true,
            validator: async (_, value) => {
              const result = await validateBannerButtonText(value);
              if (!result.success) return Promise.reject(result.error);
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Button Link"
        name="buttonLink"
        rules={[
          { required: true, type: 'url', message: 'URL is not valid' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Active Till"
        name="activeTill"
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const formattedDate = value ? value.toISOString() : null;
                const result = await validateBannerActiveTill(formattedDate);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        label="Active"
        name="isActive"
        valuePropName="checked"
        initialValue={false}
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Create Banner</Button>
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

export default CreateBannerPage;