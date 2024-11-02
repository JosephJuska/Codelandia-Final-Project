import { Form, Input, Button, Select, Upload, Alert, Typography, Image } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import imageValidator from '../../validations/category/category-image';
import validateCategoryName from '../../validations/category/category-name';
import updateCategory from '../../requests/category/update-category';
import getCategories from '../../requests/category/get-categories';
import getProductTypes from '../../requests/product-type/get-product-types';
import sanitizeFormDataValue from '../../utils/sanitize-form-data-value';
import getCategoryByID from '../../requests/category/get-category-by-id';
import NotFound from '../../components/NotFound';
import Spinner from '../../components/Spinner';
import showModal from '../../utils/show-result-modal';
import ResultModal from '../../components/ResultModal';
import Cropper from '../../components/Cropper';
import handleFormError from '../../utils/handle-form-error';
import PreviewImage from '../../components/PreviewImage';
import handlePreview from '../../utils/handle-preview';
import getDateInString from '../../utils/get-date-in-string';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import DataDateFields from '../../components/form/DataDateFields';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';

const { Paragraph } = Typography;

const CategoryDetail = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [productTypes, setProductTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(null);

  const [parentCategory, setParentCategory] = useState(null);
  const [productType, setProductType] = useState(null);
  
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onChangeSelect = (event, type) => {
    if(type === 'category'){
      setParentCategory(categories.find(c => c.value === event))
    }else{
      setProductType(productTypes.find(p => p.value === type))
    }
  }

  const handleImageUpload = async (file) => {
    const result = await imageValidator.validateCategoryImageUpdate(file);
    if(!result.success) {
      form.setFields([ { name: 'image', errors: [result.error] } ]);
      return Upload.LIST_IGNORE;
    };

    setShowImage(false);
    setImageFile(file);
    return false;
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setShowImage(true);
  };
  
  const onFinish = async (values) => {
    setLoadingUpdate(true);
    if(imageFile) values.image = imageFile;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, sanitizeFormDataValue(value));
    });

    const result = await updateCategory(id, formData);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingUpdate(false);

      return;
    };

    const resultUpdate = await getCategoryByID(id);
    requestHandler(result, navigate, '/admin/login', '/');
    if(resultUpdate.success){
      if(resultUpdate.data?.imagePath) setImagePath(resultUpdate.data.imagePath);
      setShowImage(true);
      setCategory(resultUpdate.data);
      form.setFieldValue('updated_at', resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated');
    }
    showModal(setModalData, setModalVisible, 'success', 'Category Updated Successfully');
    setLoadingUpdate(false);
  };

  const fetchData = async () => {
    const resultCategory = await getCategories();
    const resultProductType = await getProductTypes('', 'nameASC');
    if(!resultCategory.success || !resultProductType.success) {
        setError('Failed to load data for category creation. Please try again later');
        setLoading(false);
        return;
    }
    let mappedCategories = resultCategory.data?.map(category => ({
        value: category.id,
        label: `${category.name} ID:${category.id}`,
    })) || [];
    mappedCategories = mappedCategories.filter(category => category.value != id);

    const mappedProductTypes = resultProductType.data?.map(productType => ({
        value: productType.id,
        label: `${productType.name} ID:${productType.id}`,
    })) || [];

    setCategories(mappedCategories);
    setProductTypes(mappedProductTypes);

    setLoading(false);
  };

  const fetchCategory = async () => {
    setLoading(true);
    const result = await getCategoryByID(id);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
        if (result.notFound) {
          setNotFound(true);
        }
        setLoading(false);
        return;
    }

    const category = result.data;
    setImagePath(category.imagePath);
    form.setFieldsValue({
        name: category.name,
        parentID: category.parentID,
        productTypeID: category.productTypeID,
        created_at: getDateInString(category.created_at, true),
        updated_at: category.updated_at ? getDateInString(category.updated_at, true) : 'Not Updated',
    });
    setProductType({ label: category.productTypeName, value: category.productTypeID })
    setParentCategory(category.parentID && { label: category.parentName, value: category.parentID });
    setCategory(category);
    setLoading(false);
  };

  const onReset = () => {
    form.setFieldsValue({
      name: category.name,
      parentID: category.parentID,
      productTypeID: category.productTypeID,
      created_at: getDateInString(category.created_at, true),
      updated_at: category.updated_at ? getDateInString(category.updated_at, true) : 'Not Updated',
    });
    setProductType({ label: category.productTypeName, value: category.productTypeID })
    setParentCategory({ label: category.parentName, value: category.parentID });
  };

  useEffect(() => {
    fetchData();
    fetchCategory();
  }, []);

  return (
    <>
        {loading && <Spinner />}
        {error && <Alert message="Error" description={error} type="error" showIcon />}
        {notFound && <NotFound isData={false} />}
        {!loading && !error && !notFound && 
            <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
              <UndoFieldsButton onReset={onReset} />
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
                style={{ maxWidth: '500px', marginBottom: '8px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a product type'
                    options={productTypes}
                    optionFilterProp="label"
                    allowClear
                    onChange={(event) => onChangeSelect(event, 'productType')}
                    dropdownRender={menu => (<SelectorFooterMenu menu={menu} link={'/admin/product-type'} buttonText={'Add new product type'} />)}
                />
              </Form.Item>

              <LinkToData data={productType} text={'View Product Type'} endpoint={'/admin/product-type'} />
        
              <Form.Item
                label='Parent Category'
                name='parentID'
                style={{ maxWidth: '500px', marginBottom: '8px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a parent category'
                    options={categories}
                    optionFilterProp="label"
                    allowClear
                    onChange={(event) => onChangeSelect(event, 'category')}
                    dropdownRender={menu => (<SelectorFooterMenu menu={menu} link={'/admin/category/create'} buttonText={'Add new category'} />)}
                />
              </Form.Item>

              <LinkToData data={parentCategory} text={'View Category'} endpoint={'/admin/category'} />

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
              
              <DataDateFields />

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update Category</Button>
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

export default CategoryDetail;