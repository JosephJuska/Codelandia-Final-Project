import { useEffect, useState } from 'react';
import { Form, Input, Upload, Button, Image, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import getBrandByID from '../../requests/brand/get-brand-by-id';
import updateBrand from '../../requests/brand/update-brand';
import requestHandler from '../../utils/request-handler';
import validateBrandName from '../../validations/brand/brand-name';
import validateBrandCode from '../../validations/brand/brand-code';
import imageValidator from '../../validations/brand/brand-image';
import handleFormError from '../../utils/handle-form-error';
import Spinner from '../../components/Spinner';
import NotFound from '../../components/NotFound';
import Cropper from '../../components/Cropper';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';
import PreviewImage from '../../components/PreviewImage';
import handlePreview from '../../utils/handle-preview';
import getDateInString from '../../utils/get-date-in-string';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import DataDateFields from '../../components/form/DataDateFields';

const { Paragraph } = Typography;

const BrandDetail = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showImage, setShowImage] = useState(true);
  
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [brand, setBrand] = useState(false);
  
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      const result = await getBrandByID(id);
      requestHandler(result, navigate, '/admin/login', '/');

      if (!result.success) {
        setNotFound(true);
        setLoading(false);
        return;
      };

      const brandData = result.data;
      setImagePath(brandData?.imagePath || null);
      form.setFieldsValue({
        name: brandData.name,
        code: brandData.code,
        created_at: getDateInString(brandData.createdAt, true),
        updated_at: brandData?.updatedAt ? getDateInString(brandData.updatedAt, true) : 'Not Updated',
      });
      setBrand(brandData);
      setLoading(false);
    };

    fetchBrand();
  }, [id, navigate, form]);

  const onReset = () => {
    form.setFieldsValue({
      name: brand.name,
      code: brand.code,
      created_at: getDateInString(brand.createdAt, true),
      updated_at: brand?.updatedAt ? getDateInString(brand.updatedAt, true) : 'Not Updated',
    });
  };

  const handleImageUpload = async (file) => {
    const result = await imageValidator.validateBrandImage(file);
    if (!result.success) {
      form.setFields([{ name: 'image', errors: [result.error] }]);
      return Upload.LIST_IGNORE;
    }

    setImageFile(file);
    setShowImage(false);
    form.setFields([{ name: 'image', errors: [] }]);
    return false;
  };

  const handleImageRemove = () => {
    setShowImage(true);
    setImageFile(null);
  };

  const onFinish = async (values) => {
    setLoadingUpdate(true);
    if (imageFile) {
        values.image = imageFile;
    };

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateBrand(id, formData);
    requestHandler(result, navigate, '/admin/login', '/');
    
    if(!result.success){
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingUpdate(false);

      return;
    };

    const resultUpdate = await getBrandByID(id);
    requestHandler(result, navigate, '/admin/login', '/');
    if(resultUpdate.success){
      if(resultUpdate.data?.imagePath) setImagePath(resultUpdate.data.imagePath);
      setBrand(resultUpdate.data);
      form.setFieldsValue({
        updated_at: resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated'
      });
    }
    setShowImage(true);
    showModal(setModalData, setModalVisible, 'success', 'Brand Updated Successfully!');
    setLoadingUpdate(false);
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (notFound) {
    return <NotFound isData={false} />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <UndoFieldsButton onReset={onReset} />
      <Form.Item 
        label="Name" 
        name="name" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateBrandName(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Code" 
        name="code" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateBrandCode(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}>
        <Input />
      </Form.Item>

      {showImage && (
          <>
            <Paragraph>Previous Image</Paragraph>
            <Image
              src={imagePath}
              alt="Image"
            />
          </>
        )
      }

      <Form.Item
        label="Image"
        name="image"
      >
        <Cropper
          aspectRatio={4}
          modalTitle={'Brand Image'}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={handleImageUpload}
            showUploadList={true}
            onRemove={handleImageRemove}
            onPreview={async () => {return await handlePreview(imageFile, setPreviewFile, setPreviewOpen)}}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Cropper>
      </Form.Item>

      <PreviewImage previewFile={previewFile} setPreviewFile={setPreviewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

      <DataDateFields />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update Brand</Button>
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

export default BrandDetail;