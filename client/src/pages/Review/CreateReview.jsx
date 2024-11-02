import { Form, Input, Button, Select, Alert, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import { useEffect, useState } from 'react';
import showModal from '../../utils/show-result-modal';
import Spinner from '../../components/Spinner';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';
import validateEmail from '../../validations/email';
import validateName from '../../validations/user-name';
import TextArea from 'antd/es/input/TextArea';
import validateReviewTitle from '../../validations/review/review-title';
import validateReviewReview from '../../validations/review/review-review';
import validateReviewDescription from '../../validations/review/review-description';
import getProductsList from '../../requests/product/get-products-list';
import createReview from '../../requests/review/create-review';

const CreateReview = () => {
  const [products, setProducts] = useState([]);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);

  const [product, setProduct] = useState(null);
  
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSelectChange = (event) => {
    setProduct(products.find(p => p.value === event));
  }
  
  const onFinish = async (values) => {
    setLoadingCreate(true);

    const result = await createReview(values.name, values.email, values.title, values.review, values.productID, values.description);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingCreate(false);

      return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Review created successfully');
    setLoadingCreate(false);
  };

  const fetchData = async () => {
    const resultProducts = await getProductsList();
    if(!resultProducts.success) {
        setError('Failed to load data for review creation. Please try again later');
        setLoading(false);
        return;
    }
    const mappedProducts = resultProducts.data?.map(product => ({
        value: product.id,
        label: `${product.name}`,
    })) || [];

    setProducts(mappedProducts);

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
                label="Title"
                name="title"
                style={{ maxWidth: "500px" }}
                rules={[{ required: true, validator: async (_, value) => {
                    const result = await validateReviewTitle(value);
                    if (!result.success) return Promise.reject(result.error);
                    return Promise.resolve();
                }}]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Review"
                name="review"
                style={{ maxWidth: "500px" }}
                rules={[{ required: true, validator: async (_, value) => {
                    const result = await validateReviewReview(value);
                    if (!result.success) return Promise.reject(result.error);
                    return Promise.resolve();
                }}]}
              >
                <InputNumber min={1} max={5} step={0.5} />
              </Form.Item>

              <Form.Item
                label='Description'
                name="description"
                style={{ maxWidth: "500px" }}
                rules={[{ required: true, validator: async (_, value) => {
                    const result = await validateReviewDescription(value);
                    if (!result.success) return Promise.reject(result.error);
                    return Promise.resolve();
                }}]}
              >
                <TextArea />
              </Form.Item>
        
              <Form.Item
                label='Product'
                name='productID'
                rules={[{ required: true }]}
                style={{ maxWidth: '500px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a product'
                    options={products}
                    optionFilterProp="label"
                    onChange={(event) => {onSelectChange(event)}}
                    allowClear
                    dropdownRender={menu => <SelectorFooterMenu menu={menu} link={'/admin/product/create'} buttonText={'Add new product'} />}
                />
              </Form.Item>

              <LinkToData data={product} text={'View Product'} endpoint={'/admin/product'} />
        
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingCreate}>Create Review</Button>
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

export default CreateReview;