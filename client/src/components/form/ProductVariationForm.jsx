import { Form, Input, InputNumber, Button, Divider, Typography, Select, Switch } from 'antd';
import FIELD_TYPES from '../../utils/constants/field-types';
import createProductVariationField from '../../requests/product-variation-field/create-product-variation-field';
import { useEffect, useState } from 'react';
import deleteProductVariationField from '../../requests/product-variation-field/delete-product-variation-field';
import ProductVariationFormField from './ProductVariationFormField';
import showModal from '../../utils/show-result-modal';
import updateProductVariation from '../../requests/product-variation/update-product-variation';
import requestHandler from '../../utils/request-handler';
import handleFormError from '../../utils/handle-form-error';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../ResultModal';
import getDateInString from '../../utils/get-date-in-string';
import DataDateFields from './DataDateFields';
import UndoFieldsButton from './UndoFieldsButton';
import getProductByID from '../../requests/product/get-product-by-id';

const { Paragraph, Title } = Typography;

const ProductVariationForm = ({ productItem, variation, onDeleteVariation, setProduct, productTypeFields, navigate, productID }) => {
  const [currentFieldTypeID, setCurrentFieldTypeID] = useState(productTypeFields[0]?.fieldTypeID);
  
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [form] = Form.useForm();
  const [formVariationField] = Form.useForm();

  const options = productTypeFields.map(field => ({
    value: field.id,
    label: field.name,
  }));

  useEffect(() => {
    form.setFieldsValue({
      name: variation.name,
      stock: variation.stock,
      basePrice: variation.price,
      created_at: getDateInString(variation.createdAt, true),
      updated_at: variation?.updatedAt ? getDateInString(variation.updatedAt, true) : 'Not Updated',
    })
  }, []);

  const onReset = () => {
    form.setFieldsValue({
      name: variation.name,
      stock: variation.stock,
      basePrice: variation.price,
      created_at: getDateInString(variation.createdAt, true),
      updated_at: variation?.updatedAt ? getDateInString(variation.updatedAt, true) : 'Not Updated',
    })
  };

  const onFinish = async (values) => {
    setLoadingCreate(true);
    const result = await createProductVariationField(variation.id, values.productTypeFieldID, values.value);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(formVariationField, result, setModalData, setModalVisible);
      setLoadingCreate(false);

      return;
    };

    setProduct(prev => {
      const itemIndex = prev.productItems.findIndex(item => item.id === productItem.id);

      if (itemIndex !== -1) {
        const variationIndex = prev.productItems[itemIndex].variations.findIndex(v => v.id === variation.id);
        if (variationIndex !== -1) {
          const updatedVariation = {
            ...prev.productItems[itemIndex].variations[variationIndex],
            fields: [
              ...prev.productItems[itemIndex].variations[variationIndex].fields || [],
              {
                id: result.data,
                productTypeFieldID: values.productTypeFieldID,
                fieldValue: values.value,
                fieldTypeID: currentFieldTypeID,
              }
            ]
          };

          const updatedVariations = [
            ...prev.productItems[itemIndex].variations.slice(0, variationIndex),
            updatedVariation,
            ...prev.productItems[itemIndex].variations.slice(variationIndex + 1)
          ];

          const updatedProductItems = [
            ...prev.productItems.slice(0, itemIndex),
            {
              ...prev.productItems[itemIndex],
              variations: updatedVariations
            },
            ...prev.productItems.slice(itemIndex + 1)
          ];

          return {
            ...prev,
            productItems: updatedProductItems
          };
        }
      }

      return prev;
    });

    showModal(setModalData, setModalVisible, 'success', 'Product Variation Field Created Successfully');
    setLoadingCreate(false);
  };

  const onUpdate = async (values) => {
    setLoading(true);
    const result = await updateProductVariation(variation.id, values.name, values.stock, values.basePrice);
    requestHandler(result, navigate, '/admin/login', '/');  

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoading(false);

      return;
    };

    const updateResult = await getProductByID(productID);
    requestHandler(updateResult, navigate, '/admin/login', '/');
    if (updateResult.success) {
      const itemIndex = updateResult.data.productItems.findIndex(item => item.id === productItem.id);
      const variationIndex = updateResult.data.productItems[itemIndex].variations.findIndex(v => v.id === variation.id);
      updateResult.data.productItems[itemIndex].variations[variationIndex] = {
        ...updateResult.data.productItems[itemIndex].variations[variationIndex],
        name: values.name,
        stock: values.stock,
        price: values.basePrice
      };
      setProduct(prev => ({ ...prev, productItems: updateResult.data.productItems }));
      form.setFieldValue('updated_at', updateResult.data.productItems[itemIndex].variations[variationIndex].updatedAt ? getDateInString(updateResult.data.productItems[itemIndex].variations[variationIndex].updatedAt, true) : 'Not Updated');
    }
    showModal(setModalData, setModalVisible, 'success', 'Product Variation updated successfully!');
    setLoading(false);
  };

  const onDelete = async (fieldID) => {
    const result = await deleteProductVariationField(fieldID);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      showModal(setModalData, setModalVisible, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    setProduct(prev => {
      const itemIndex = prev.productItems.findIndex(item => item.id === productItem.id);

      if (itemIndex !== -1) {
        const variationIndex = prev.productItems[itemIndex].variations.findIndex(v => v.id === variation.id);
        if (variationIndex !== -1) {
          const updatedVariation = {
            ...prev.productItems[itemIndex].variations[variationIndex],
            fields: prev.productItems[itemIndex].variations[variationIndex].fields.filter(field => field.id !== fieldID)
          };

          const updatedVariations = [
            ...prev.productItems[itemIndex].variations.slice(0, variationIndex),
            updatedVariation,
            ...prev.productItems[itemIndex].variations.slice(variationIndex + 1)
          ];

          const updatedProductItems = [
            ...prev.productItems.slice(0, itemIndex),
            {
              ...prev.productItems[itemIndex],
              variations: updatedVariations
            },
            ...prev.productItems.slice(itemIndex + 1)
          ];

          return {
            ...prev,
            productItems: updatedProductItems
          };
        }
      };

      return prev;
    });

    showModal(setModalData, setModalVisible, 'success', 'Product variation field deleted successfully');
  };

  return (
    <>
      <Form
        key={variation.id}
        onFinish={onUpdate}
        form={form}
      >
        <UndoFieldsButton onReset={onReset} />
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
          <InputNumber min={1} max={99999.99} />
        </Form.Item>

        <DataDateFields />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button type="primary" htmlType="submit" style={{ maxWidth: 'fit-content' }} loading={loading}>
            Update Product Variation
          </Button>
          <Button type="primary" danger style={{ maxWidth: 'fit-content' }} onClick={async () => await onDeleteVariation(variation.id)}>
            Delete
          </Button>
        </div>
      </Form>

      <Divider>Product Variant Fields</Divider>

      <Title level={3}>Create Product Variant Field</Title>
      <Form form={formVariationField} onFinish={onFinish}>
        <Form.Item
          label='Field'
          name='productTypeFieldID'
        >
          <Select 
            showSearch 
            optionFilterProp='label' 
            allowClear 
            placeholder='Select Field' 
            style={{ maxWidth: '350px' }}
            options={options} 
            onChange={(value) => {
                const type = productTypeFields.find(field => field.id === value);
                console.info(type);
                setCurrentFieldTypeID(type.fieldTypeID);
            }}
          />
        </Form.Item>

        <Form.Item
          label='Value'
          name='value'
        >
          {currentFieldTypeID === FIELD_TYPES.FIELD_TYPE_STRING && <Input />}
          {currentFieldTypeID === FIELD_TYPES.FIELD_TYPE_BOOLEAN && <Switch defaultChecked />}
          {currentFieldTypeID === FIELD_TYPES.FIELD_TYPE_NUMBER && <InputNumber />}
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loadingCreate}>Create Variation Field</Button>
        </Form.Item>
      </Form>
      <Divider></Divider>
      {(!variation.fields || variation.fields?.length === 0) && <Paragraph>No Variation Fields</Paragraph>}
      {variation.fields && 
        variation.fields.map(field => {
            return (
                <ProductVariationFormField 
                    key={field.id}
                    variationField={field}
                    productTypeFields={productTypeFields}
                    onDelete={onDelete}
                    navigate={navigate}
                    productID={productID}
                    setProduct={setProduct}
                    productItem={productItem}
                    variation={variation}
                />
            );
        })  
      }

      <ResultModal 
        modalData={modalData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigate={navigate}
      />
    </>
  );
};

export default ProductVariationForm;