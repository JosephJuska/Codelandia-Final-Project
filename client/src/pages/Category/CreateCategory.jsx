import { Form, Input, Button, Select, Upload, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import imageValidator from '../../validations/category/category-image';
import validateCategoryName from '../../validations/category/category-name';
import createCategory from '../../requests/category/create-category';
import getCategories from '../../requests/category/get-categories';
import getProductTypes from '../../requests/product-type/get-product-types';
import sanitizeFormDataValue from '../../utils/sanitize-form-data-value';
import showModal from '../../utils/show-result-modal';
import Spinner from '../../components/Spinner';
import Cropper from '../../components/Cropper';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import PreviewImage from '../../components/PreviewImage';
import handlePreview from '../../utils/handle-preview';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';

const CreateCategory = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(null);
  const [productType, setProductType] = useState(null);
  
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const result = await imageValidator.validateCategoryImage(file);
    if(!result.success) {
      form.setFields([ { name: 'image', errors: [result.error] } ]);
      return Upload.LIST_IGNORE;
    };

    setImageFile(file);
    return false;
  };

  const onSelectChange = (event, type) => {
    if(type === 'category'){
      setCategory(categories.find(c => c.value === event));
    }else{
      setProductType(productTypes.find(p => p.value === event));
    }
  }

  const handleImageRemove = () => {
    setImageFile(null);
  };
  
  const onFinish = async (values) => {
    setLoadingCreate(true);
    values.image = imageFile;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, sanitizeFormDataValue(value));
    });

    const result = await createCategory(formData);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingCreate(false);

      return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Category created successfully', 'View Category', `/admin/category/${result.data.id}`);
    setLoadingCreate(false);
  };

  const fetchData = async () => {
    const resultCategory = await getCategories();
    const resultProductType = await getProductTypes('', 'nameASC');
    if(!resultCategory.success || !resultProductType.success) {
        setError('Failed to load data for category creation. Please try again later');
        setLoading(false);
        return;
    }
    const mappedCategories = resultCategory.data?.map(category => ({
        value: category.id,
        label: `${category.name}`,
    })) || [];

    const mappedProductTypes = resultProductType.data?.map(productType => ({
        value: productType.id,
        label: `${productType.name}`,
    })) || [];

    setCategories(mappedCategories);
    setProductTypes(mappedProductTypes);

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
                        const result = await validateCategoryName(value);
                        if (!result.success) return Promise.reject(result.error);
                        return Promise.resolve(); 
                    }
                }]}
              >
                <Input />
              </Form.Item>
        
              <Form.Item
                label='Product Type'
                name='productTypeID'
                style={{ maxWidth: '500px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a product type'
                    options={productTypes}
                    optionFilterProp="label"
                    onChange={(event) => onSelectChange(event, 'productType')}
                    allowClear
                    dropdownRender={menu => (<SelectorFooterMenu menu={menu} link={'/admin/product-type'} buttonText={'Add new product type'} />)}
                />
              </Form.Item>

              <LinkToData data={productType} text={'View Product Type'} endpoint={'/admin/product-type'} />
        
              <Form.Item
                label='Parent Category'
                name='parentID'
                style={{ maxWidth: '500px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a parent category'
                    options={categories}
                    optionFilterProp="label"
                    onChange={(event) => {onSelectChange(event, 'category')}}
                    allowClear
                />
              </Form.Item>

              <LinkToData data={category} text={'View Category'} endpoint={'/admin/category'} />
        
              <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, validator: () => { return imageFile ? Promise.resolve() : Promise.reject('Please select an image'); } }]}
              >
                <Cropper
                  aspectRatio={1}
                  modalTitle={'Category Image'}
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
        
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingCreate}>Create Category</Button>
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

export default CreateCategory;