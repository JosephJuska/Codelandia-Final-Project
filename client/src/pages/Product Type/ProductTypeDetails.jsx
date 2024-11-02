import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Divider, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import getProductTypeByID from '../../requests/product-type/get-product-type-by-id';
import updateProductType from '../../requests/product-type/update-product-type';
import requestHandler from '../../utils/request-handler';
import addProductTypeField from '../../requests/product-type-field/create-product-type-field';
import deleteProductTypeField from '../../requests/product-type-field/delete-product-type-field';
import NotFound from '../../components/NotFound';
import validateProductTypeName from '../../validations/product-type-name';
import validateProductTypeFieldName from '../../validations/product-type-field-name';
import validateFieldTypeID from '../../validations/field-type-id';
import Spinner from '../../components/Spinner';
import ProductTypeFieldForm from '../../components/form/ProductTypeFieldForm';
import ResultModal from '../../components/ResultModal';
import handleFormError from '../../utils/handle-form-error';
import errorMessages from '../../utils/constants/error-messages';
import showModal from '../../utils/show-result-modal';
import DataDateFields from '../../components/form/DataDateFields';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import getDateInString from '../../utils/get-date-in-string';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const ProductTypeDetail = () => {
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [productType, setProductType] = useState(null);
  const [fields, setFields] = useState([]);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { id } = useParams();
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductType = async () => {
      setLoading(true);
      const result = await getProductTypeByID(id);
      requestHandler(result, navigate, '/admin/login', '/');

      if (!result.success) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProductType(result.data);
      setFields(result.data.fields || []);
      form.setFieldsValue({ 
        name: result.data.name,
        created_at: getDateInString(result.data.createdAt),
        updated_at: result.data?.updatedAt ? getDateInString(result.data.updatedAt) : 'Not Updated', 
      });
      setLoading(false);
    };

    fetchProductType();
  }, [id, navigate, form]);

  const onReset = () => {
    form.setFieldsValue({ 
        name: productType.name,
        created_at: getDateInString(productType.createdAt),
        updated_at: productType?.updatedAt ? getDateInString(productType.updatedAt) : 'Not Updated', 
    });
  }

  const onUpdateProductType = async (values) => {
    setLoadingUpdate(true);
    const result = await updateProductType(id, values.name);
    requestHandler(result, navigate, '/admin/login', '/');
    
    if(!result.success) {
        handleFormError(form, result, setModalData, setModalVisible);
        setLoadingUpdate(false);

        return;
    };

    showModal(setModalData, setModalVisible, 'success', 'Product Type Updated Successfully');
    setLoadingUpdate(false);
  };

  const onAddField = async (values) => {
    setLoadingNew(true);
    const result = await addProductTypeField(id, values.name, values.fieldTypeID);
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      handleFormError(newForm, result, setModalData, setModalVisible);
      setLoadingNew(false);
      
      return;
    };

    setFields([...fields, { name: values.name, fieldTypeID: values.fieldTypeID, id: result.data }]);
    newForm.resetFields();
    showModal(setModalData, setModalVisible, 'success', 'Field added successfully');
    setLoadingNew(false);
  };

  const onDeleteField = async (fieldId) => {
    const result = await deleteProductTypeField(fieldId);
    if (!result.success) {
      showModal(setModalData, setModalVisible, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    const updatedFields = fields.filter(field => field.id !== fieldId);
    setFields(updatedFields);
    showModal(setModalData, setModalVisible, 'success', 'Field deleted successfully');
  };

  return (
    <>
        {loading && 
            <Spinner />
        }

        {notFound && 
            <NotFound isData={false} />
        }

        {productType && 
            <div>
                <UndoFieldsButton onReset={onReset} />
                <Form form={form} layout="vertical" onFinish={onUpdateProductType}>
                    <Form.Item
                    label="Product Type Name"
                    name="name"
                    rules={
                        [
                            { 
                                required: true,
                                validator: async (_, value) => {
                                    const result = await validateProductTypeName(value);
                                    if (!result.success) return Promise.reject(result.error);
                                    return Promise.resolve();
                                }
                            }
                        ]
                    }
                    >
                    <Input />
                    </Form.Item>

                    <Paragraph>Product Count: {productType.productCount}</Paragraph>
                    <Paragraph>Category Count: {productType.categoryCount}</Paragraph>

                    <DataDateFields />

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update Product Type</Button>
                    </Form.Item>
                </Form>

                <Divider />

                <Title level={3} >Fields</Title>
                {fields.length === 0 ? (
                    <Paragraph>No fields available</Paragraph>
                ) : (
                    <>
                        {fields.map((field) => (
                            <div key={field.id}>  
                                <Divider />
                                <ProductTypeFieldForm
                                    key={field.id}
                                    field={field}
                                    navigate={navigate}
                                    onDeleteField={onDeleteField}
                                    setModalData={setModalData}
                                    setModalVisible={setModalVisible}
                                />
                            </div>
                        ))}
                    </>

                )}

                <Divider />

                <Title level={3}>Add New Field</Title>
                <Form layout="vertical" form={newForm} onFinish={onAddField}>
                    <Form.Item 
                        label="Field Name"
                        name='name'
                        rules={
                            [
                                {
                                    required: true,
                                    validator: async (_, value) => {
                                        const result = await validateProductTypeFieldName(value);
                                        if(!result.success) return Promise.reject(result.error);
                                        return Promise.resolve();
                                    }
                                }
                            ]
                        }
                    >
                    <Input
                        placeholder="Enter field name"
                    />
                    </Form.Item>

                    <Form.Item 
                        label="Field Type"
                        name='fieldTypeID'
                        rules={
                            [
                                {
                                    required: true,
                                    validator: async (_, value) => {
                                        const result = await validateFieldTypeID(value);
                                        if(!result.success) return Promise.reject(result.error);
                                        return Promise.resolve();
                                    }
                                }
                            ]
                        }
                    >
                        <Select
                            placeholder="Select field type"
                        >
                            <Option value={1}>String</Option>
                            <Option value={2}>Number</Option>
                            <Option value={3}>Boolean</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType='submit' loading={loadingNew}>Add Field</Button>
                    </Form.Item>
                </Form>

                <ResultModal 
                    modalData={modalData}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    navigate={navigate}
                />
            </div>
        }
  </>
  )
};

export default ProductTypeDetail;