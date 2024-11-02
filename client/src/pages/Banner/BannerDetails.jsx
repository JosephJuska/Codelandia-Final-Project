import { useEffect, useState } from 'react';
import { Form, Input, Upload, Button, DatePicker, Switch, Image, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import getBannerByID from '../../requests/banner/get-banner-by-id';
import updateBanner from '../../requests/banner/update-banner';
import requestHandler from '../../utils/request-handler';
import validateBannerHeader from '../../validations/banner/banner-header';
import validateBannerSubHeader from '../../validations/banner/banner-sub-header';
import validateBannerButtonText from '../../validations/banner/banner-button-text';
import imageValidator from '../../validations/banner/banner-background';
import validateBannerActiveTill from '../../validations/banner/banner-active-till';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import Spinner from '../../components/Spinner';
import NotFound from '../../components/NotFound';
import Cropper from '../../components/Cropper';
import showModal from '../../utils/show-result-modal';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../../components/PreviewImage';
import getDateInString from '../../utils/get-date-in-string';
import DataDateFields from '../../components/form/DataDateFields';
import dateHandler from '../../utils/date-handler';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';

const { Paragraph } = Typography;

const BannerDetail = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [showImage, setShowImage] = useState(true);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [banner, setBanner] = useState(null);
  
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      const result = await getBannerByID(id);
      requestHandler(result, navigate, '/admin/login', '/');

      if (!result.success) {
        setNotFound(true);
        setLoading(false);
        return;
      };

      const bannerData = result.data;
      setImagePath(bannerData?.backgroundPath || null);
      form.resetFields();
      form.setFieldsValue({
        header: bannerData.header,
        subHeader: bannerData.subHeader,
        buttonText: bannerData.buttonText,
        buttonLink: bannerData.buttonLink,
        isActive: bannerData.isActive,
        activeTill: dateHandler.handleReceivedDate(bannerData.activeTill),
        created_at: getDateInString(bannerData.createdAt, true),
        updated_at: bannerData?.updatedAt ? getDateInString(bannerData.updatedAt, true) : 'Not Updated',
      });
      setBanner(bannerData);
      setLoading(false);
    };

    fetchBanner();
  }, [id, navigate, form]);

  const onReset = () => {
    form.setFieldsValue({
      header: banner.header,
      subHeader: banner.subHeader,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      isActive: banner.isActive,
      activeTill: dateHandler.handleReceivedDate(banner.activeTill),
      created_at: getDateInString(banner.createdAt, true),
      updated_at: banner?.updatedAt ? getDateInString(banner.updatedAt, true) : 'Not Updated',
    });
  };

  const handleImageUpload = async (file) => {
    const result = await imageValidator.validateBannerBackground(file);
    if (!result.success) {
      form.setFields([{ name: 'background', errors: [result.error] }]);
      return Upload.LIST_IGNORE;
    };

    setShowImage(false);
    setImageFile(file);
    return false;
  };

  const handleImageRemove = () => {
    setShowImage(true);
    setImageFile(null);
  };

  const onFinish = async (values) => {
    setLoadingUpdate(true);
    if (imageFile) values.background = imageFile;
    values.activeTill = values?.activeTill ? dateHandler.handleSentDate(values.activeTill) : null;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateBanner(id, formData);
    requestHandler(result, navigate, '/admin/login', '/');

    if(!result.success){
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingUpdate(false);

      return;
    };

    const resultUpdate = await getBannerByID(id);
    requestHandler(result, navigate, '/writer/login', '/');
    if(resultUpdate.success){
      if(resultUpdate.data?.backgroundPath) setImagePath(resultUpdate.data.backgroundPath);
      setBanner(resultUpdate.data);
      form.setFieldValue('updated_at', resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated');
    }
    setLoadingUpdate(false);
    showModal(setModalData, setModalVisible, 'success', 'Banner Updated Successfully');
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
        label="Header" 
        name="header" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateBannerHeader(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Sub-Header" 
        name="subHeader" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateBannerSubHeader(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Button Text" 
        name="buttonText" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateBannerButtonText(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label="Button Link" 
        name="buttonLink" 
        rules={[{ required: true, message: 'Please provide button link!' }]}
      >
        <Input />
      </Form.Item>

      {showImage && (
        <>
          <Paragraph>Previous Background Image</Paragraph>
          <Image
            src={imagePath}
            style={{ maxWidth: '400px' }}
            alt="Banner Background"
          />
        </>
      )}

      <Form.Item
        label="Background Image"
        name="background"
      >
        <Cropper
          aspectRatio={16 / 10}
          modalTitle="Banner Background"
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

      <PreviewImage previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} previewFile={previewFile} setPreviewFile={setPreviewFile} />

      <Form.Item 
        label="Is Active" 
        name="isActive" 
        valuePropName="checked"
      >
        <Switch />
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

      <DataDateFields />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update Banner</Button>
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

export default BannerDetail;