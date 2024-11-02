import { useState } from 'react';
import { Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import createBrand from '../../requests/brand/create-brand';
import requestHandler from '../../utils/request-handler';
import validateBrandName from '../../validations/brand/brand-name';
import validateBrandCode from '../../validations/brand/brand-code';
import imageValidator from '../../validations/brand/brand-image';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import Cropper from '../../components/Cropper';
import showModal from '../../utils/show-result-modal';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../../components/PreviewImage';

const CreateBrand = () => {
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const result = await imageValidator.validateBrandImage(file);
    if(!result.success) {
      form.setFields([ { name: 'image', errors: [result.error] } ]);
      return Upload.LIST_IGNORE;
    };

    form.setFields([ { name: 'image', errors: [] } ]);
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
      formData.append(key, value);
    });

    const result = await createBrand(formData);
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoading(false);
      
      return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Brand Created Successfully!', 'View Brand', '/admin/brand/' + result.data.id);
    setLoading(false);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
      <Form.Item
        label="Name"
        name="name"
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateBrandName(value);
                if(!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Image"
        name="image"
        rules={[{ required: true, validator: () => { return imageFile ? Promise.resolve() : Promise.reject('Please select an image'); } }]}
      >
        <Cropper
          aspectRatio={4}
          modalTitle={'Brand Image'}
        >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={handleImageUpload}
              onRemove={handleImageRemove}
              showUploadList={true}
              onPreview={async () => {return await handlePreview(imageFile, setPreviewFile, setPreviewOpen);}}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
        </Cropper>
      </Form.Item>

      <PreviewImage previewFile={previewFile} setPreviewFile={setPreviewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

      <Form.Item
        label="Code"
        name="code"
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateBrandCode(value);
                if(!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Create Brand</Button>
      </Form.Item>

      <ResultModal 
        modalVisible={modalVisible}
        modalData={modalData}
        setModalVisible={setModalVisible}
        navigate={navigate}
      />
    </Form>
  );
};

export default CreateBrand;