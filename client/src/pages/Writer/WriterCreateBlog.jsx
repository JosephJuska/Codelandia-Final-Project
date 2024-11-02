import { useState } from 'react';
import { Form, Input, Upload, Button, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import addBlogImage from '../../requests/blog/add-blog-image';
import requestHandler from '../../utils/request-handler';
import { useNavigate } from 'react-router-dom';
import mdToHTML from '../../utils/md-to-html';
import { useForm } from 'antd/es/form/Form';
import titleValidator from '../../validations/blog/blog-title';
import bannerValidator from '../../validations/blog/blog-banner';
import descriptionValidator from '../../validations/blog/blog-description';
import subDescriptionValidator from '../../validations/blog/blog-sub-description';
import publishedValidator from '../../validations/blog/blog-published';
import createBlog from '../../requests/blog/create-blog';
import sanitizeFormDataValue from '../../utils/sanitize-form-data-value';
import { validateImageIsCorrectSize } from '../../validations/default-validators';
import ResultModal from '../../components/ResultModal';
import handleFormError from '../../utils/handle-form-error';
import Cropper from '../../components/Cropper';
import showModal from '../../utils/show-result-modal';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../../components/PreviewImage';

const { TextArea } = Input;

const WriterCreateBlog = () => {
  const [content, setContent] = useState('');

  const [bannerFile, setBannerFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const result = await validateImageIsCorrectSize(file, 'Image', 1024 * 3, '300KB');
    if (!result.success) {
      return Promise.reject(result.error);
    };

    const addResult = await addBlogImage(file);
    requestHandler(addResult, navigate, '/writer/login', '/');

    return result.data.path;
  };

  const handleContentChange = ({ text }) => {
    setContent(text);
  }; 

  const handleBannerUpload = async (file) => {
    form.setFields([ { name: 'banner', errors: [] } ]);
    const result = await bannerValidator.validateBlogBanner(file);
    if(!result.success) {
      form.setFields([ { name: 'banner', errors: [result.error] } ]);
      return Upload.LIST_IGNORE;
    };

    setBannerFile(file);
    return false;
  };

  const handleBannerRemove = () => {
    setBannerFile(null);
  };

  const onFinish = async (values) => {
    setLoading(true);
    values.content = content;
    values.banner = bannerFile;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, sanitizeFormDataValue(value));
    });

    const result = await createBlog(formData);
    requestHandler(result, navigate, '/writer/login', '/');

    if(!result.success) {
      handleFormError(form ,result, setModalData, setModalVisible);
      setLoading(false);

      return;
    };

    setLoading(false);
    showModal(setModalData, setModalVisible, 'success', 'Blog Created Successfully!', 'View Blog', '/writer/blog/' + result.data.id);
  };

  const styles = {
    markdownEditor: {
      height: '500px',
      margin: '16px 0'
    },
    formItem: {
      marginBottom: '15px',
    },
    buttonGroup: {
      marginTop: '16px',
    },
    previewModal: {
      width: '80%',
    },
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError={true}>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ 
          required: true,
          validator: async (_, value) => {
            const result = await titleValidator.validateTitle(value);
            if (!result.success) {
              return Promise.reject(result.error);
            }

            return Promise.resolve();
          }
        }]}
        style={styles.formItem}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Banner"
        name="banner"
        rules={[{ required: true, validator: () => {
          if(!bannerFile) return Promise.reject('banner must be provided');
          return Promise.resolve();
        } }]}
        style={styles.formItem}
      >
        <Cropper
          aspectRatio={16 / 9}
          modalTitle="Select Banner"
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={handleBannerUpload}
            showUploadList={true}
            onRemove={handleBannerRemove}
            onPreview={async () => {return await handlePreview(bannerFile, setPreviewFile, setPreviewOpen);}}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Banner</Button>
          </Upload>
        </Cropper>
      </Form.Item>

      <PreviewImage previewFile={previewFile} setPreviewFile={setPreviewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

      <Form.Item
        label="Description"
        name="description"
        rules={[{ 
          required: true,
          validator: async (_, value) => {
            const result = await descriptionValidator.validateDescription(value);
            if (!result.success) {
              return Promise.reject(result.error);
            }

            return Promise.resolve();
          }
        }]}
        style={styles.formItem}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Sub Description"
        name="subDescription"
        initialValue={''}
        style={styles.formItem}
        rules={[{
          validator: async (_, value) => {
            const result = await subDescriptionValidator.validateSubDescription(value);
            if (!result.success) {
              return Promise.reject(result.error);
            }

            return Promise.resolve();
          }
        }]}
      >
        <TextArea rows={4} />
      </Form.Item>
      
      <MarkdownEditor
          value={content}
          style={styles.markdownEditor}
          onChange={handleContentChange}
          renderHTML={(content) => mdToHTML(content)}
          onImageUpload={handleImageUpload}
      />

      <Form.Item
        label="Published"
        name="published"
        valuePropName="checked"
        initialValue={false}
        style={styles.formItem}
        rules={[{ 
          required: true,
          validator: async (_, value) => {
            const result = await publishedValidator.validatePublished(value);
            if (!result.success) {
              return Promise.reject(result.error);
            }

            return Promise.resolve();
          }
        }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item style={styles.buttonGroup}>
        <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
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

export default WriterCreateBlog;