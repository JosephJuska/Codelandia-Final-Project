import { Form, Input, Button, Select, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import { useEffect, useState } from 'react';
import showModal from '../../utils/show-result-modal';
import Spinner from '../../components/Spinner';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';
import getBlogsList from '../../requests/blog/get-blogs-list';
import validateCommentContent from '../../validations/comment/comment-content';
import validateEmail from '../../validations/email';
import validateName from '../../validations/user-name';
import TextArea from 'antd/es/input/TextArea';
import createComment from '../../requests/comment/create-comment';

const CreateComment = () => {
  const [blogs, setBlogs] = useState([]);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);

  const [blog, setBlog] = useState(null);
  
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSelectChange = (event) => {
    setBlog(blogs.find(b => b.value === event));
  }
  
  const onFinish = async (values) => {
    setLoadingCreate(true);

    const result = await createComment(values.name, values.email, values.content, values.id);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingCreate(false);

      return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Comment created successfully');
    setLoadingCreate(false);
  };

  const fetchData = async () => {
    const resultBlogs = await getBlogsList();
    if(!resultBlogs.success) {
        setError('Failed to load data for comment creation. Please try again later');
        setLoading(false);
        return;
    }
    const mappedBlogs = resultBlogs.data?.map(blog => ({
        value: blog.id,
        label: `${blog.title}`,
    })) || [];

    setBlogs(mappedBlogs);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
        {loading && <Spinner />}
        {error && <Alert message="Error" description={error} type="error" showIcon />}
        {!loading && !error && 
            <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
              <Form.Item
                label="Name"
                name="name"
                style={{ maxWidth: '500px' }}
                rules={[{
                    required: true,
                    validator: async (_, value) => {
                        const result = await validateName(value);
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
                label='Content'
                name="content"
                style={{ maxWidth: "500px" }}
                rules={[{ required: true, validator: async (_, value) => {
                    const result = await validateCommentContent(value);
                    if (!result.success) return Promise.reject(result.error);
                    return Promise.resolve();
                }}]}
              >
                <TextArea />
              </Form.Item>
        
              <Form.Item
                label='Blog'
                name='id'
                rules={[{ required: true }]}
                style={{ maxWidth: '500px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a blog'
                    options={blogs}
                    optionFilterProp="label"
                    onChange={(event) => {onSelectChange(event)}}
                    allowClear
                    dropdownRender={menu => <SelectorFooterMenu menu={menu} link={'/admin/blog/create'} buttonText={'Add new blog'} />}
                />
              </Form.Item>

              <LinkToData data={blog} text={'View Blog'} endpoint={'/admin/blog'} />
        
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingCreate}>Create Comment</Button>
              </Form.Item>

              <ResultModal 
                modalData={modalData}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                navigate={navigate}
              />
            </Form>
        }
    </>
  );
};

export default CreateComment;