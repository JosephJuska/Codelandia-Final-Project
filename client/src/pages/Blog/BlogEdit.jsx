import { useEffect, useState } from 'react';
import { Form, Input, Upload, Button, Switch, Image, Typography, Alert, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import addBlogImage from '../../requests/blog/add-blog-image';
import requestHandler from '../../utils/request-handler';
import { useNavigate, useParams } from 'react-router-dom';
import mdToHTML from '../../utils/md-to-html';
import { useForm } from 'antd/es/form/Form';
import titleValidator from '../../validations/blog/blog-title';
import bannerValidator from '../../validations/blog/blog-banner';
import validateID from '../../validations/id';
import descriptionValidator from '../../validations/blog/blog-description';
import subDescriptionValidator from '../../validations/blog/blog-sub-description';
import publishedValidator from '../../validations/blog/blog-published';
import updateBlog from '../../requests/blog/update-blog';
import getBlogByID from '../../requests/blog/get-blog-by-id';
import NotFound from '../../components/NotFound';
import sanitizeFormDataValue from '../../utils/sanitize-form-data-value';
import errorMessages from '../../utils/constants/error-messages';
import { validateImageIsCorrectSize } from '../../validations/default-validators';
import ResultModal from '../../components/ResultModal';
import handleFormError from '../../utils/handle-form-error';
import Spinner from '../../components/Spinner';
import getOwners from '../../requests/user/get-owners';
import Cropper from '../../components/Cropper';
import showModal from '../../utils/show-result-modal';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../../components/PreviewImage';
import getDateInString from '../../utils/get-date-in-string';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import DataDateFields from '../../components/form/DataDateFields';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';

const { TextArea } = Input;
const { Paragraph } = Typography;

const BlogEditPage = () => {
  const [content, setContent] = useState('');

  const [options, setOptions] = useState([])
  
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPath, setBannerPath] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const [blog, setBlog] = useState(null);

  const [author, setAuthor] = useState(null);
  
  const { id } = useParams();
  const [form] = useForm();
  const navigate = useNavigate();

  const fetchOwners = async () => {
    setLoading(true);
    const response = await getOwners();
    requestHandler(response, navigate, '/admin/login', '/');
  
    if (!response.success) {
      if (typeof response.error === 'string') {
        form.setFields([{ name: '' }])
      }
    } else {
      let options = response.data ? response.data.map(owner => ({ label: `${owner.email}`, value: owner.id })) : [];
      setOptions(options);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const result = await getBlogByID(id);
      requestHandler(result, navigate, '/admin/login', '/');

      if (!result.success) {
        if (result.notFound) {
          setNotFound(true);
        }else {
          setError(result.error || errorMessages.UNEXPECTED_ERROR);
        }
        setLoading(false);
        return;
      };

      const blogData = result.data;
      setContent(blogData?.rawContent || '');
      setBannerPath(blogData?.bannerPath || null);
      form.setFieldsValue({
        title: blogData.title,
        description: blogData.description,
        subDescription: blogData.subDescription,
        published: blogData.published,
        authorID: blogData.authorID,
        created_at: getDateInString(blogData.createdAt, true),
        updated_at: blogData?.updatedAt ? getDateInString(blogData.updatedAt, true) : 'Not Updated'
      });
      setAuthor({ label: blogData.authorEmail, value: blogData.authorID });
      setBlog(blogData);
      setLoading(false);
    };

    fetchBlog();
  }, [id, navigate, form]);

  const onReset = () => {
    form.setFieldsValue({
      title: blog.title,
      description: blog.description,
      subDescription: blog.subDescription,
      published: blog.published,
      authorID: blog.authorID,
      created_at: getDateInString(blog.createdAt, true),
      updated_at: blog?.updatedAt ? getDateInString(blog.updatedAt, true) : 'Not Updated'
    });
    setAuthor({ label: blog.authorEmail, value: blog.authorID });
    setContent(blog?.rawContent || '');
  };

  const handleImageUpload = async (file) => {
    const result = await validateImageIsCorrectSize(file, 'Image', 1024 * 3, '300KB');
    if (!result.success) {
      return Promise.reject(result.error);
    }

    const addResult = await addBlogImage(file);
    requestHandler(addResult, navigate, '/admin/login', '/');
    return result.data.path;
  };

  const handleContentChange = ({ text }) => {
    setContent(text);
  };

  const handleBannerUpload = async (file) => {
    const result = await bannerValidator.validateBlogBanner(file);
    if (!result.success) {
      form.setFields([{ name: 'banner', errors: [result.error] }]);
      return Upload.LIST_IGNORE;
    }

    setBannerFile(file);
    setShowBanner(false);
    form.setFields([{ name: 'banner', errors: [] }]);
    return false;
  };

  const handleBannerRemove = () => {
    setShowBanner(true);
    setBannerFile(null);
  };


  const onSelectChange = (event) => {
    setAuthor(options.find(a => a.value === event));
  }

  const onFinish = async (values) => {
    setLoadingUpdate(true);
    values.content = content;
    if (bannerFile) values.banner = bannerFile;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, sanitizeFormDataValue(value));
    });

    const result = await updateBlog(id, formData);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingUpdate(false);
      
      return;
    }

    const resultUpdate = await getBlogByID(id);
    requestHandler(result, navigate, '/admin/login', '/');
    if(resultUpdate.success){
      if(resultUpdate.data?.bannerPath) setBannerPath(resultUpdate.data.bannerPath);
      setBlog(resultUpdate.data);
      setShowBanner(true);
      form.setFieldsValue({
        updated_at: resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated'
      });
    }
    setAuthor({ label: resultUpdate.data?.authorEmail, value: resultUpdate.data?.authorID });
    setLoadingUpdate(false);
    showModal(setModalData, setModalVisible, 'success', 'Blog Updated Successfully');
  };

  const styles = {
    markdownEditor: {
      height: '500px',
      margin: '16px 0'
    },
    bannerFormItem: {
      margin: '16px 0'
    },
    formItem: {
      marginBottom: '16px',
    },
    buttonGroup: {
      marginTop: '16px',
    },
    bannerPreview: {
      width: '100%',
      maxWidth: 300
    }
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (notFound) {
    return <NotFound isData={false} />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />
  }

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError={true}>
      <Button type='primary' onClick={() => navigate('/admin/blog/' + id)} style={{ marginBottom: '16px' }} >Details</Button>
      <UndoFieldsButton onReset={onReset} style={{ marginBottom: '16px', marginLeft: '32px' }} />
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

      
      {showBanner && (
          <>
            <Paragraph>Previous Banner</Paragraph>
            <Image
              src={bannerPath}
              alt="Banner"
              style={styles.bannerPreview}
            />
          </>
        )
      }

      <Form.Item
        label="Banner"
        name="banner"
        style={styles.bannerFormItem}
      >
        <Cropper
          aspectRatio={16 / 9}
          modalTitle={'Upload Banner'}
        >
          <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={handleBannerUpload}
              showUploadList={true}
              onRemove={handleBannerRemove}
              onPreview={async () => {return await handlePreview(bannerFile, setPreviewFile, setPreviewOpen)}}
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

      <Form.Item
            label='Author'
            name='authorID'
            rules={[{ required: true, validator: async (_, value) => {
                const result = await validateID(value, false);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            } }]}
            style={{ maxWidth: '350px', marginBottom: '0' }}
            initialValue={''}
        >
            <Select 
              onChange={onSelectChange} 
              loading={loading} 
              options={options} 
              allowClear 
              showSearch 
              optionFilterProp='label' 
              dropdownRender={menu => (<SelectorFooterMenu menu={menu} link={'/admin/user/create'} buttonText={'Add new user'} />)}/>
      </Form.Item>

      <LinkToData data={author} text={'View Author'} endpoint={'/admin/user'} />

      <DataDateFields />

      <Form.Item style={styles.buttonGroup}>
        <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update</Button>
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

export default BlogEditPage;