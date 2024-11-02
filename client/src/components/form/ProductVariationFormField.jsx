import { Form, Select, Input, InputNumber, Switch, Button } from "antd"
import FIELD_TYPES from "../../utils/constants/field-types";
import updateProductVariationField from '../../requests/product-variation-field/update-product-variation-field';
import { useEffect, useState } from "react";
import requestHandler from "../../utils/request-handler";
import handleFormError from "../../utils/handle-form-error";
import showModal from "../../utils/show-result-modal";
import ResultModal from "../ResultModal";
import getDateInString from "../../utils/get-date-in-string";
import DataDateFields from "./DataDateFields";
import UndoFieldsButton from "./UndoFieldsButton";
import getProductByID from "../../requests/product/get-product-by-id";

const ProductVariationFormField = ({ variationField, productTypeFields, onDelete, navigate, productID, setProduct, productItem, variation }) => {
  const [currentFieldTypeID, setCurrentFieldTypeID] = useState(variationField.fieldTypeID);

  const [loading, setLoading] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  const options = productTypeFields.map(field => ({
    value: field.id,
    label: field.name,
  }));

  useEffect(() => {
    form.setFieldsValue({
      'productTypeFieldID': variationField.productTypeFieldID,
      'value': variationField.fieldValue,
      'created_at': getDateInString(variationField.createdAt, true),
      'updated_at': variationField?.updatedAt ? getDateInString(variationField.updatedAt, true) : 'Not Updated',
    })
  });

  const onReset = () => {
    form.setFieldsValue({
      'productTypeFieldID': variationField.productTypeFieldID,
      'value': variationField.fieldValue,
      'created_at': getDateInString(variationField.createdAt, true),
      'updated_at': variationField?.updatedAt ? getDateInString(variationField.updatedAt, true) : 'Not Updated',
    })
  };

  const onUpdate = async(values) => {
    setLoading(true);
    const result = await updateProductVariationField(variationField.id, values.productTypeFieldID, values.value);
    requestHandler(result, navigate, '/admin/login', '/');
    
    if(!result.success) {
      handleFormError(form, result, setModalData, setModalVisible);
      setLoading(false);

      return;
    };

    const updateResult = await getProductByID(productID);
    requestHandler(updateResult, navigate, '/admin/login', '/');
    if(updateResult.success) {
      const itemIndex = updateResult.data.productItems.findIndex(item => item.id === productItem.id);
      const variationIndex = updateResult.data.productItems[itemIndex].variations.findIndex(v => v.id === variation.id);
      updateResult.data.productItems[itemIndex].variations[variationIndex] = {
        ...updateResult.data.productItems[itemIndex].variations[variationIndex],
        productTypeFieldID: values.productTypeFieldID,
        value: values.value
      };
      setProduct(prev => ({ ...prev, productItems: updateResult.data.productItems }));
      form.setFieldValue('updated_at', variationField?.updatedAt ? getDateInString(variationField.updatedAt, true) : 'Not Updated');
    }
    showModal(setModalData, setModalVisible, 'success', 'Product Variation Field updated successfully!');
    setLoading(false);
  };

  return (
    <Form form={form} key={variationField.id} onFinish={onUpdate} style={{ marginBottom: 48 }}>
        <UndoFieldsButton onReset={onReset} />
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
                setCurrentFieldTypeID(type.fieldTypeID);
            }}
          />
        </Form.Item>

        <Form.Item
          label='Value'
          name='value'
        >
          {currentFieldTypeID === FIELD_TYPES.FIELD_TYPE_STRING && <Input />}
          {currentFieldTypeID === FIELD_TYPES.FIELD_TYPE_BOOLEAN && <Switch defaultValue={false} />}
          {currentFieldTypeID === FIELD_TYPES.FIELD_TYPE_NUMBER && <InputNumber />}
        </Form.Item>

        <DataDateFields />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button type="primary" htmlType="submit" style={{ maxWidth: 'fit-content' }} loading={loading}>
            Update Variation Field
          </Button>
          <Button type="primary" danger style={{ maxWidth: 'fit-content' }} onClick={async () => await onDelete(variationField.id)}>
            Delete
          </Button>
        </div>

        <ResultModal 
          modalData={modalData}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          navigate={navigate}
        />
    </Form>
  )
}

export default ProductVariationFormField;