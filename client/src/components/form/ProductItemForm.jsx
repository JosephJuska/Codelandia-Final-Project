import { Form, InputNumber, ColorPicker, Upload, Button, Typography, Input, Divider, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import createProductVariation from '../../requests/product-variation/create-product-variation';
import deleteProductVariation from '../../requests/product-variation/delete-product-variation';
import ProductVariationForm from './ProductVariationForm';
import { useEffect, useState } from 'react';
import updateProductItem from '../../requests/product-item/update-product-item';
import requestHandler from '../../utils/request-handler';
import handleFormError from '../../utils/handle-form-error';
import showModal from '../../utils/show-result-modal';
import Cropper from '../Cropper';
import ResultModal from '../ResultModal';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../PreviewImage';
import addImage from '../../requests/product-item/add-image';
import rgbToHex from '../../utils/rgb-to-hex';
import errorMessages from '../../utils/constants/error-messages';
import UndoFieldsButton from './UndoFieldsButton';
import getDateInString from '../../utils/get-date-in-string';
import DataDateFields from './DataDateFields';
import getProductByID from '../../requests/product/get-product-by-id';

const { Paragraph, Title } = Typography;

const ProductItemForm = ({ productItem, onDeleteItem, setProduct, productTypeFields, navigate, productID }) => {
  const [fileList, setFileList] = useState(productItem.imagePaths.map(image => ({ uid: image, url: image })));

  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [form] = useForm();
  const [formVariation] = useForm();

  const onReset = () => {
    form.setFieldsValue({
        [`stock${productItem.id}`]: productItem.stock,
        [`colour1${productItem.id}`]: productItem.colour1,
        [`colour2${productItem.id}`]: productItem.colour2,
        [`colour3${productItem.id}`]: productItem.colour3,
        [`created_at${productItem.id}`]: getDateInString(productItem.createdAt, true),
        [`updated_at${productItem.id}`]: productItem?.updatedAt ? getDateInString(productItem.updatedAt, true) : 'Not Updated',
    });

    setFileList(productItem.imagePaths.map(image => ({ uid: image, url: image })));
  };

  useEffect(() => {
    form.setFieldsValue({
        [`stock${productItem.id}`]: productItem.stock,
        [`colour1${productItem.id}`]: productItem.colour1,
        [`colour2${productItem.id}`]: productItem.colour2,
        [`colour3${productItem.id}`]: productItem.colour3,
        [`created_at${productItem.id}`]: getDateInString(productItem.createdAt, true),
        [`updated_at${productItem.id}`]: productItem?.updatedAt ? getDateInString(productItem.updatedAt, true) : 'Not Updated',
    })
  }, []);

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

  const onUpdateItem = async (values) => {
    setLoading(true);
    const imagePaths = fileList.map(item => item.url);
    const result = await updateProductItem(productItem.id, values[`id${productItem.id}`], values[`stock${productItem.id}`], rgbToHex(values[`colour1${productItem.id}`]), rgbToHex(values[`colour2${productItem.id}`]), rgbToHex(values[`colour3${productItem.id}`]), imagePaths);
    requestHandler(result, navigate, '/admin/login', '/');
    
    if(!result.success) {
        handleFormError(form, result, setModalData, setModalVisible, null, productItem.id);
        setLoading(false);

        return;
    };

    const updateResult = await getProductByID(productID);
    requestHandler(updateResult, navigate, '/admin/login', '/');
    if(updateResult.success) {
       const temp = updateResult.data.productItems.find(item => item.id === productItem.id);
       setProduct(prev => ({ ...prev, productItems: prev.productItems.map(item => (item.id === temp.id ? temp : item)) })); 
       form.setFieldValue(`updated_at${productItem.id}`, temp?.updatedAt ? getDateInString(temp.updatedAt, true) : 'Not Updated');
    }
    showModal(setModalData, setModalVisible, 'success', 'Product item updated successfully');
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoadingCreate(true);
    const result = await createProductVariation(productItem.id, values.name, values.stock, values.basePrice);
    if(!result.success) {
        handleFormError(formVariation, result, setModalData, setModalVisible);
        setLoadingCreate(false);
        return;
    };

    setProduct(prev => {
        const itemIndex = prev.productItems.findIndex(item => item.id === productItem.id);
        

        if (itemIndex !== -1) {
            const updatedItem = {
                ...prev.productItems[itemIndex],
                variations: [
                    ...prev.productItems[itemIndex].variations || [],
                    {
                        id: result.data,
                        name: values.name,
                        stock: values.stock,
                        price: values.basePrice,
                        fields: null,
                    }
                ]
            };
    
            const updatedProductItems = [
                ...prev.productItems.slice(0, itemIndex),
                updatedItem,
                ...prev.productItems.slice(itemIndex + 1)
            ];
    
            return {
                ...prev,
                productItems: updatedProductItems
            };
        }
    
        return prev;
    });

    showModal(setModalData, setModalVisible, 'success', 'Product variation created successfully');
    setLoadingCreate(false);
  };

  const onDelete = async (id) => {
    const result = await deleteProductVariation(id);
    if(!result.success){
        showModal(setModalData, setModalVisible, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
        return;
    }

    setProduct(prev => {
        const itemIndex = prev.productItems.findIndex(item => item.id === productItem.id);
        
        if (itemIndex !== -1) {
            const updatedItem = {
                ...prev.productItems[itemIndex],
                variations: prev.productItems[itemIndex].variations.filter(variation => variation.id !== id)
            };

            const updatedProductItems = [
                ...prev.productItems.slice(0, itemIndex),
                updatedItem,
                ...prev.productItems.slice(itemIndex + 1)
            ];

            return {
                ...prev,
                productItems: updatedProductItems
            };
        }

        return prev;
    });

    showModal(setModalData, setModalVisible, 'success', 'Product variation deleted successfully');
  };

  const loadProductVariants = () => {
    const elements = productItem?.variations?.map(variant => ({
        key: `${variant.id}`,
        label: 'Variation ID: ' + variant.id,
        children: (
          <ProductVariationForm 
            productItem={productItem}
            variation={variant}
            onDeleteVariation={onDelete}
            setProduct={setProduct}
            productTypeFields={productTypeFields}
            navigate={navigate}
            productID={productID}
          />
        )
    }));
    
    return <Tabs items={elements} />;
  }

  return (
    <>
        <Form form={form} key={productItem.id} onFinish={onUpdateItem} scrollToFirstError>
            <UndoFieldsButton onReset={onReset} />
            <Form.Item
                label='Stock'
                name={`stock${productItem.id}`}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                label='Colour 1'
                name={`colour1${productItem.id}`}
            >
                <ColorPicker size='large' format='hex' allowClear showText={(color) => <span>{color.toHexString()}</span>} />
            </Form.Item>

            <Form.Item
                label='Colour 2'
                name={`colour2${productItem.id}`}
            >
                <ColorPicker size='large' format='hex' allowClear showText={(color) => <span>{color.toHexString()}</span>} />
            </Form.Item>

            <Form.Item
                label='Colour 3'
                name={`colour3${productItem.id}`}
            >
                <ColorPicker size='large' format='hex' allowClear showText={(color) => <span>{color.toHexString()}</span>} />
            </Form.Item>

            <Form.Item
                label='Images'
                name={`imagePaths${productItem.id}`}
            >
                <Cropper 
                    aspectRatio={1}
                    modalTitle={'Product Image'}
                >
                    <Upload
                        customRequest={async(object) => {return await handleUpload(object, productItem.id)}}
                        onRemove={(file) => {return handleRemove(file, productItem.id)}}
                        listType="picture-card"
                        fileList={fileList || []}
                        showUploadList={true}
                        onPreview={async(file) => {return await handlePreview(file, setPreviewFile, setPreviewOpen)}}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                </Cropper>
            </Form.Item>

            <PreviewImage previewFile={previewFile} setPreviewFile={setPreviewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

            <DataDateFields createdAtName={`created_at${productItem.id}`} updatedAtName={`updated_at${productItem.id}`} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Button type="primary" htmlType="submit" style={{ maxWidth: 'fit-content' }} loading={loading}>Update Product Item</Button>
            <Button type="primary" danger style={{ maxWidth: 'fit-content' }} onClick={async () => {return await onDeleteItem(productItem.id)}}>Delete</Button>
            </div>
        </Form>

        <Divider>Product Variants</Divider>

        <Title level={3}>Create Product Variant</Title>
        <Form
            key={'variation' + productItem.id}
            onFinish={onFinish}
            form={formVariation}
            scrollToFirstError
        >
            <Form.Item
                label='Name'
                name='name'
            >
                <Input style={{ maxWidth: 350 }} />
            </Form.Item>

            <Form.Item
                label='Stock'
                name='stock'
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                label='Base Price'
                name='basePrice'
              >
                <InputNumber min={0} max={99999.99} />
            </Form.Item>

            <Form.Item>
                <Button type='primary' htmlType='submit' loading={loadingCreate}>Create Variation</Button>
            </Form.Item>
        </Form>

        {!productItem?.variations && <Paragraph>No Variations Exist</Paragraph>} 
        {productItem?.variations && loadProductVariants()} 

        <ResultModal 
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            modalData={modalData}
            navigate={navigate}
        />
    </>
  )
}

export default ProductItemForm;