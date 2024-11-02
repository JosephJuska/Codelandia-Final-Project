import { Form, Input, Button, Select, Alert, InputNumber, Switch, Divider, ColorPicker, Upload, Typography, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import { useEffect, useState } from 'react';
import validateProductName from '../../validations/product/product-name';
import getCategories from '../../requests/category/get-categories';
import validateProductDescription from '../../validations/product/product-description';
import validateProductSKU from '../../validations/product/product-sku';
import validateProductBasePrice from '../../validations/product/product-base-price';
import getBrandsPublic from '../../requests/brand/get-brands-public';
import getProductByID from '../../requests/product/get-product-by-id';
import errorMessages from '../../utils/constants/error-messages';
import NotFound from '../../components/NotFound';
import FIELD_TYPES from '../../utils/constants/field-types';
import validateProductFieldValue from '../../validations/product/product-fields';
import updateProduct from '../../requests/product/update-product';
import addImage from '../../requests/product-item/add-image';
import createProductItem from '../../requests/product-item/create-product-item';
import rgbToHex from '../../utils/rgb-to-hex';
import deleteProductItem from '../../requests/product-item/delete-product-item';
import ProductItemForm from '../../components/form/ProductItemForm';
import showModal from '../../utils/show-result-modal';
import ResultModal from '../../components/ResultModal';
import Spinner from '../../components/Spinner';
import handleFormError from '../../utils/handle-form-error';
import Cropper from '../../components/Cropper';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../../components/PreviewImage';
import getProductTypeByIDPublic from '../../requests/product-type/get-product-type-by-category-id';
import getDateInString from '../../utils/get-date-in-string';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import DataDateFields from '../../components/form/DataDateFields';

const { Title, Paragraph } = Typography;

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productTypeFields, setProductTypeFields] = useState([]);
  const [brands, setBrands] = useState([]);

  const [currentProductType, setCurrentProductType] = useState(null);

  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingProductUpdate, setLoadingProductUpdate] = useState(false);
  const [loadingProductItemCreate, setLoadingProductItemCreate] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [fileList, setFileList] = useState([]);
  
  const [form] = Form.useForm();
  const [formItem] = Form.useForm();
  const navigate = useNavigate();

  const { id } = useParams();

  const onChangeBrand = (event) => {
    setBrand(brands.find(b => b.value === event));
  }

  const onChangeCategory = async (event) => {
    const resultProductType = await getProductTypeByIDPublic(event);
    requestHandler(resultProductType, navigate, '/admin/login', '/');

    if(!resultProductType.success) {
        setError('Failed to load product type for product update. Please try again later');
        setLoading(false);
        return;
    }

    setCategory(categories.find(c => c.value === event));
    setCurrentProductType(resultProductType.data);
  };

  useEffect(() => {
    if (currentProductType?.id && currentProductType.id === product.categoryProductTypeID && product?.productFields) {
        const fieldValues = {};
        product.productFields.forEach((field, index) => {
            fieldValues[`field${index + 1}`] = field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_BOOLEAN ? (field?.fieldValue === 'true' ? true : false) : field?.fieldValue;
        });
        form.setFieldsValue(fieldValues);
    }else{
      const fieldValues = {};
      currentProductType?.fields && currentProductType.fields.forEach((field, index) => {
        fieldValues[`field${index + 1}`] = (field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_BOOLEAN ? false : undefined);
      })
      form.setFieldsValue(fieldValues);
    }
  }, [currentProductType, product]);

  const loadFields = () => {
    if (!currentProductType?.id) return null;

    const renderField = (field, index) => (
        <Form.Item
            key={field.id || `field${index}`}
            label={field.name}
            name={`field${index + 1}`}
            style={{ maxWidth: '500px' }}
            rules={[{
                validator: async (_, value) => {
                    const result = await validateProductFieldValue(value, field.fieldTypeID);
                    if (!result.success) return Promise.reject(result.error);
                    return Promise.resolve();
                }
            }]}
        >
            {field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_STRING && <Input />}
            {field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_BOOLEAN && <Switch />}
            {field.fieldTypeID === FIELD_TYPES.FIELD_TYPE_NUMBER && <InputNumber />}
        </Form.Item>
    );

    return (
        <>
            {currentProductType?.id && currentProductType.id !== product.categoryProductTypeID && currentProductType.fields.map((field, index) => renderField(field, index))}
            {currentProductType?.id && currentProductType.id === product.categoryProductTypeID && product?.productFields?.map((field, index) => renderField(field, index))}
        </>
    );
  };



  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const result = await addImage(formData);
  
      if (result.success) {
        setFileList(prevFileList => {
          const fileList = Array.isArray(prevFileList) ? prevFileList : [];
          
          return [...fileList, { uid: file.uid, url: result.data.path }];
        });
  
        onSuccess(result.data.path);
      } else {
        onError(new Error(result.error));
      }
    } catch (error) {
      onError(error);
    }
  };  
  
  const handleRemove = (file) => {
    const url = file.url;
  
    setFileList(prevFileList => prevFileList.filter(item => item.url !== url));
  };

  const onReset = () => {
    form.setFieldsValue({
      name: product?.name,
      description: product?.description,
      sku: product?.sku,
      brandID: product?.brandID,
      categoryID: product?.categoryID,
      basePrice: product?.basePrice,
      isActive: product?.isActive,
      created_at: getDateInString(product?.created_at),
      updated_at: product?.updated_at ? getDateInString(product?.updated_at) : 'Not Updated',
    });

    setCurrentProductType({ id: product?.categoryProductTypeID });
  };
  
  const onFinish = async (values) => {
    setLoadingProductUpdate(true);
    const fields = Object.keys(values)
    .filter(key => key.startsWith('field'))
    .reduce((acc, key) => {
        acc.push(values[key]);
        return acc;
    }, []);
  
    const result = await updateProduct(id, values.name, values.description, values.sku, values.brandID, values.categoryID, values.basePrice, fields || [], values.isActive);
    
    requestHandler(result, navigate, '/admin/login', '/');
  
    if (!result.success) {
      if (typeof result.error === 'string') {
        showModal(setModalData, setModalVisible, 'error', result.error);
        setLoadingProductUpdate(false);

        return;
      };
  
      const fieldErrors = Object.keys(result.error).reduce((acc, key) => {
        if(key === 'fields'){
          Object.keys(result.error.fields).forEach(field => {
            acc.push({
              name: field,
              errors: [result.error.fields[field]],
            });
          })
        }else{
          acc.push({
            name: key,
            errors: [result.error[key]],
          });
        }
        return acc;
      }, []);
  
      form.setFields(fieldErrors);
      setLoadingProductUpdate(false);

      if (fieldErrors.length > 0) {
        form.scrollToField(fieldErrors[0].name, {
          behavior: 'smooth',
          block: 'center',
        });
      };

      return;
    }
  
    await fetchData();
    showModal(setModalData, setModalVisible, 'success', 'Product updated successfully!');
    setLoadingProductUpdate(false);
  };

  const onFinishItem = async (values) => {
    setLoadingProductItemCreate(true);
    const imagePaths = fileList.map(item => item.url);
    const result = await createProductItem(id, values.stock, rgbToHex(values.colour1), rgbToHex(values.colour2), rgbToHex(values.colour3), imagePaths);
    requestHandler(result, navigate, '/admin/login', '/');
    if(!result.success){
      handleFormError(formItem, result, setModalData, setModalVisible);
      setLoadingProductItemCreate(false);

      return;
    };

    setProduct(prevValue => {
      return {
        ...prevValue,
        productItems: [...(prevValue.productItems || []), { 
          id: result.data, 
          stock: values.stock, 
          colour1: values.colour1, 
          colour2: values.colour2,
          colour3: values.colour3,
          imagePaths: imagePaths,
          updatedAt: null,
          variations: null
        }]
      }
    });

    showModal(setModalData, setModalVisible, 'success', 'Product Item Created Successfully');
    setLoadingProductItemCreate(false);
  };

  const onDeleteItem = async (itemID) => {
    const result = await deleteProductItem(itemID);

    if (!result.success) {
        showModal(setModalData, setModalVisible, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
        return;
    };

    setProduct(prevProduct => {
        const updatedProductItems = prevProduct.productItems.filter(item => item.id !== itemID);
        return {
            ...prevProduct,
            productItems: updatedProductItems.length > 0 ? updatedProductItems : null,
        };
    });

    showModal(setModalData, setModalVisible, 'success', 'Product Item Deleted Successfully');
  };

  const fetchData = async () => {
    const resultProduct = await getProductByID(id);
    const resultCategory = await getCategories(true);
    const resultBrand = await getBrandsPublic();
    requestHandler(resultProduct, navigate, '/admin/login', '/');
    requestHandler(resultCategory, navigate, '/admin/login', '/');
    requestHandler(resultBrand, navigate, '/admin/login', '/');
    if(!resultProduct.success) {
        if(resultProduct.critical) {
            setError(errorMessages.UNEXPECTED_ERROR);
            setLoading(false);
            return;
        }

        setNotFound(true);
        setLoading(false);
        return;
    }

    setProduct(resultProduct.data);

    if(!resultCategory.success || !resultBrand.success) {
        setError('Failed to load brand and categories for product update. Please try again later');
        setLoading(false);
        return;
    }

    const resultProductType = await getProductTypeByIDPublic(resultProduct.data.categoryID);
    requestHandler(resultProductType, navigate, '/admin/login', '/');

    if(!resultProductType.success) {
        setError('Failed to load product type for product update. Please try again later');
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
    setCategory({ label: resultProduct.data.categoryName, value: resultProduct.data.categoryID });
    setBrand({ label: resultProduct.data.brandName, value: resultProduct.data.brandID });
    setCurrentProductType(resultProductType.data);
    setProductTypeFields(resultProduct.data?.productFields.map(field => {
      return{ id: field.productTypeFieldID, name: field.name, fieldTypeID: field.fieldTypeID }
    }));

    form.setFieldsValue({
        name: resultProduct.data?.name,
        description: resultProduct.data?.description,
        sku: resultProduct.data?.sku,
        brandID: resultProduct.data?.brandID,
        categoryID: resultProduct.data?.categoryID,
        basePrice: resultProduct.data?.basePrice,
        isActive: resultProduct.data?.isActive,
        created_at: getDateInString(resultProduct.data?.createdAt, true),
        updated_at: resultProduct.data?.updatedAt ? getDateInString(resultProduct.data?.updatedAt, true) : 'Not Updated',
    });

    setLoading(false);
  };

  const loadProductItems = () => {
    const elements = product?.productItems?.map(item => ({
      key: `${item.id}`,
      label: 'Item ID: ' + item.id,
      children: (
        <ProductItemForm
          productItem={item}
          onDeleteItem={onDeleteItem}
          setProduct={setProduct}
          productTypeFields={productTypeFields}
          navigate={navigate}
          productID={product?.id}
        />
      )
    }));
  
    return <Tabs items={elements} />;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
        {loading && <Spinner />}
        {error && <Alert message="Error" description={error} type="error" showIcon />}
        {notFound && <NotFound isData={false} />}
        {!loading && !error && !notFound &&
        <>
            <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
              <UndoFieldsButton onReset={onReset} />
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
                    onChange={onChangeBrand}
                    dropdownRender={menu => <SelectorFooterMenu menu={menu} link='/admin/brand/create' buttonText='Add new brand' />}
                />
              </Form.Item>

              <LinkToData data={brand} text='View Brand' endpoint={'/admin/brand'} />
        
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
                    onChange={onChangeCategory}
                    dropdownRender={menu => <SelectorFooterMenu menu={menu} link='/admin/category/create' buttonText='Add new category' />}
                />
              </Form.Item>

              <LinkToData data={category} text='View Category' endpoint={'/admin/category'} />

              <Form.Item
                label='Is Active'
                name='isActive'
                initialValue={false}
              >
                <Switch />
              </Form.Item>

              <Divider>Product Fields</Divider>
              
              {loadFields()}

              <DataDateFields />
        
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingProductUpdate}>Update Product</Button>
              </Form.Item>
            </Form>

            <Divider>Product Items</Divider>

            <Title level={3}>Create Product Item</Title>
            <Form layout="vertical" onFinish={onFinishItem} form={formItem} scrollToFirstError>
              <Form.Item
                label='Stock'
                name='stock'
              >
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item
                label='Colour 1'
                name='colour1'
              >
                <ColorPicker size='large' format='hex' allowClear showText={(color) => <span>{color.toHexString()}</span>} />
              </Form.Item>

              <Form.Item
                label='Colour 2'
                name='colour2'
              >
                <ColorPicker size='large' format='hex' allowClear showText={(color) => <span>{color.toHexString()}</span>} />
              </Form.Item>

              <Form.Item
                label='Colour 3'
                name='colour3'
              >
                <ColorPicker size='large' format='hex' allowClear showText={(color) => <span>{color.toHexString()}</span>} />
              </Form.Item>

              <Form.Item
                label='Images'
                name='imagePaths'
              >
                <Cropper 
                  aspectRatio={1}
                  modalTitle="Upload Image"
                >
                  <Upload
                    customRequest={handleUpload}
                    onRemove={handleRemove}
                    listType="picture-card"
                    fileList={fileList || []}
                    showUploadList={true}
                    onPreview={async (file) => {return await handlePreview(file, setPreviewFile, setPreviewOpen)}}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Select Image</Button>
                  </Upload>
                </Cropper>
              </Form.Item>

              <PreviewImage previewFile={previewFile} setPreviewFile={setPreviewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingProductItemCreate}>Create Product Item</Button>
              </Form.Item>
            </Form>

            {!product?.productItems && <Paragraph>No Items Exist</Paragraph>}
            {product?.productItems && 
              loadProductItems()
            }

            <ResultModal 
              modalData={modalData}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              navigate={navigate}
            />
        </>
        }
    </>
  );
};

export default ProductDetail;