import { Button, Form, Input, Select } from "antd";
import updateProductTypeField from "../../requests/product-type-field/update-product-type-field";
import requestHandler from "../../utils/request-handler";
import handleFormError from "../../utils/handle-form-error";
import validateProductTypeFieldName from "../../validations/product-type-field-name";
import validateFieldTypeID from "../../validations/field-type-id";
import { useState } from "react";
import showModal from "../../utils/show-result-modal";
import UndoFieldsButton from "./UndoFieldsButton";

const { Option } = Select;

const ProductTypeFieldForm = ({ field, navigate, setModalData, setModalVisible, onDeleteField }) => {
    const [loading, setLoading] = useState(false);
    
    const [currentField, setCurrentField] = useState(field);

    const [form] = Form.useForm();

    const onReset = () => {
        form.setFieldsValue({
            name: currentField.name,
            fieldTypeID: currentField.fieldTypeID
        })
    }

    const onFinish = async (values) => {
        setLoading(true);

        const result = await updateProductTypeField(field.id, values.name, values.fieldTypeID);
        requestHandler(result, navigate, '/admin/login', '/');

        if(!result.success){
            handleFormError(form, result, setModalData, setModalVisible);
            setLoading(false);

            return;
        };

        setCurrentField({ name: values.name, fieldTypeID: values.fieldTypeID });
        showModal(setModalData, setModalVisible, 'success', 'Product type field updated successfully!');
        setLoading(false);
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError initialValues={{ name: field.name, fieldTypeID: field.fieldTypeID }}>
            <UndoFieldsButton onReset={onReset} />
            <Form.Item 
                label="Field Name"
                name="name"
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
                <Input placeholder="Enter field name" />
            </Form.Item>

            <Form.Item 
                label="Field Type"
                name="fieldTypeID"
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
                <Select placeholder="Select field type">
                    <Option value={1}>String</Option>
                    <Option value={2}>Number</Option>
                    <Option value={3}>Boolean</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" loading={loading} htmlType="submit">Update Field</Button>
            </Form.Item>

            <Form.Item>
                <Button type="primary" danger onClick={() => onDeleteField(field.id)}>Delete Field</Button>
            </Form.Item>
        </Form>
    );
};

export default ProductTypeFieldForm;