import { Modal, Form, Input, Button } from 'antd';
import validateProductTypeName from '../validations/product-type-name';
import createProductType from '../requests/product-type/create-product-type';
import requestHandler from '../utils/request-handler';
import { useState } from 'react';
import handleFormError from '../utils/handle-form-error';
import showModal from '../utils/show-result-modal';

const ProductTypeCreation = ({ isVisible, setIsVisible, navigate, fetchData, setModalData, setModalVisible }) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    const name = values.name;

    const result = await createProductType(name);
    requestHandler(result, navigate, '/admin/login', '/');

    if (result.success) {
      showModal(setModalData, setModalVisible, 'success', 'Product type created successfully!');
      form.resetFields();
      fetchData();
    } else {
      handleFormError(form, result, setModalData, setModalVisible);
    };

    setLoading(false);
  };

  return (
    <Modal
        title='Create Product Type'
        open={isVisible}
        onCancel={() => setIsVisible(false)}
        footer={null}
    >
        <Form
            form={form}
            onFinish={onFinish}
        >
            <Form.Item
                label='Name'
                name='name'
                rules={[
                    {
                        required: true,
                        validator: async (_, value) => {
                            const result = await validateProductTypeName(value);
                            if(!result.success) return Promise.reject(result.error);
                            return Promise.resolve();
                        }
                    }
                ]}
            >
                <Input placeholder='Enter a name' />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Create Product Type</Button>
            </Form.Item>
        </Form>
    </Modal>
  )
}

export default ProductTypeCreation;