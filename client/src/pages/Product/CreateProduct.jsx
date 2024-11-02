import { Form, Input, Button, Select, Alert, InputNumber, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import { useEffect, useState } from 'react';
import validateProductName from '../../validations/product/product-name';
import validateProductFieldValue from '../../validations/product/product-fields';
import getCategories from '../../requests/category/get-categories';
import validateProductDescription from '../../validations/product/product-description';
import validateProductSKU from '../../validations/product/product-sku';
import validateProductBasePrice from '../../validations/product/product-base-price';
import getBrandsPublic from '../../requests/brand/get-brands-public';
import createProduct from '../../requests/product/create-product';
import getProductTypeByIDPublic from '../../requests/product-type/get-product-type-by-category-id';
import FIELD_TYPES from '../../utils/constants/field-types';
import showModal from '../../utils/show-result-modal';
import Spinner from '../../components/Spinner';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../../components/ResultModal';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productType, setProductType] = useState(null);

  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [productTypeLoading, setProductTypeLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [error, setError] = useState(null);
  
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    setLoadingCreate(true);
    const fields = Object.keys(values)
    .filter(key => key.startsWith('field'))
    .reduce((acc, key) => {
        acc.push(values[key]);
        return acc;
    }, []);
  
    const result = await createProduct(values.name, values.description, values.sku, values.brandID, values.categoryID, values.basePrice, fields || []);
    
    requestHandler(result, navigate, '/admin/login', '/');
  
    if (!result.success) {
      if (typeof result.error === 'string') {
        showModal(setModalData, setModalVisible, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
        setLoadingCreate(false);
        return;
      };
  
      console.log(result);
  
      const fieldErrors = Object.keys(result.error).reduce((acc, key) => {
        if (key === 'fields') {
          Object.keys(result.error.fields).forEach(fieldKey => {
            acc.push({
              name: `field${fieldKey}`,
              errors: [result.error.fields[fieldKey]],
            });
          });
        } else {
          acc.push({
            name: key,
            errors: [result.error[key]],
          });
        }
        return acc;
      }, []);
  
      form.setFields(fieldErrors);
      setLoadingCreate(false);
      if (fieldErrors.length > 0) {
        form.scrollToField(fieldErrors[0].name, {
        behavior: 'smooth',
        block: 'center',
        });
      };
      
      return;
    };
  
    showModal(setModalData, setModalVisible, 'success', 'Product created successfully!', 'View Product', `/admin/product/${result.data.id}`);
    setLoadingCreate(false);
  };

  const onSelectChange = (event) => {
    setBrand(brands.find(b => b.value === event));
  };

  const handleCategoryChange = async (value) => {
    setProductTypeLoading(true);
    if(!value){
        setProductType(null);
        setProductTypeLoading(false);
        return;
    };
    
    const result = await getProductTypeByIDPublic(value);
    if(!result.success){
        setError('Failed to load product type. Please try again later');
        setProductTypeLoading(false);
        return;
    };

    setProductType(result.data);
    setCategory(categories.find(c => c.value === value));
    form.setFields([{ name: 'categoryID', errors: [] }]);
    setProductTypeLoading(false);
  };

  const fetchData = async () => {
    const resultCategory = await getCategories(true);
    const resultBrand = await getBrandsPublic();
    if(!resultCategory.success || !resultBrand.success) {
        setError('Failed to load data for product creation. Please try again later');
        setLoading(false);
        return;
    }

    const mappedCategories = resultCategory.data?.map(category => ({
        value: category.id,
        label: category.name,
    })) || [];

    const mappedBrands = resultBrand.data?.brands.map(brand => ({
        value: brand.id,
        label: brand.name,
    })) || [];

    setCategories(mappedCategories);
    setBrands(mappedBrands);

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
                        const result = await validateProductName(value);
                        if (!result.success) return Promise.reject(result.error);
                        return Promise.resolve(); 
                    }
                }]}
              >
                <Input />
              </Form.Item>
        
              <Form.Item
                label='Description'
                name='description'
                style={{ maxWidth: '500px' }}
                rules={[{
                    required: true,
                    validator: async (_, value) => {
                        const result = await validateProductDescription(value);
                        if (!result.success) return Promise.reject(result.error);
                        return Promise.resolve();
                    }
                }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                label='SKU'
                name='sku'
                rules={[{
                    required: true,
                    validator: async (_, value) => {
                        const result = await validateProductSKU(value);
                        if (!result.success) return Promise.reject(result.error);
                        return Promise.resolve();
                    }
                }]}
              >
                <InputNumber min={10000000} max={99999999} />
              </Form.Item>

              <Form.Item
                label='Base Price'
                name='basePrice'
                rules={[{
                    required: true,
                    validator: async (_, value) => {
                        const result = await validateProductBasePrice(value);
                        if (!result.success) return Promise.reject(result.error);
                        return Promise.resolve();
                    }
                }]}
              >
                <InputNumber min={1} max={99999.99} />
              </Form.Item>

              <Form.Item
                label='Brand'
                name='brandID'
                style={{ maxWidth: '500px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a brand'
                    options={brands}
                    optionFilterProp="label"
                    allowClear
                    onChange={onSelectChange}
                    dropdownRender={menu => <SelectorFooterMenu menu={menu} link='/admin/brand/create' buttonText={'Add new brand'} />}
                />
              </Form.Item>

              <LinkToData data={brand} text={'View Brand'} endpoint={'/admin/brand'} />
        
              <Form.Item
                label='Category'
                name='categoryID'
                style={{ maxWidth: '500px' }}
              >
                <Select 
                    showSearch
                    placeholder='Select a category'
                    options={categories}
                    optionFilterProp="label"
                    allowClear
                    onChange={handleCategoryChange}
                    dropdownRender={menu => <SelectorFooterMenu menu={menu} link='/admin/category/create' buttonText={'Add new category'} />}
                />
              </Form.Item>

              <LinkToData data={category} text={'View Category'} endpoint={'/admin/category'} />

              {productTypeLoading && <Spinner />}

              {!productTypeLoading && productType && 
                productType?.fields.map(field => (
                    <Form.Item
                        key={field.id}
                        label={field.name}
                        name={`field${field.id}`}
                        rules={[{
                            validator: async (_, value) => {
                                const result = await validateProductFieldValue(value, field.fieldTypeID);
                                if (!result.success) return Promise.reject(result.error);
                                return Promise.resolve();
                            }
                        }]}
                    >
                        {field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_STRING && <Input />}
                        {field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_BOOLEAN && <Switch defaultValue={false} />}
                        {field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_NUMBER && <InputNumber />}
                    </Form.Item>
                ))
              }
        
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingCreate}>Create Product</Button>
              </Form.Item>

              <ResultModal 
                modalData={modalData}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                navigate={navigate}
              />
            </Form>
        }
    </>
  );
};

export default CreateProduct;