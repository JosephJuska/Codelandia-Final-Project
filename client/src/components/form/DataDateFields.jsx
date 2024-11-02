import { Form, Input } from "antd";

const DataDateFields = ({ createdAtProps, updatedAtProps, includeCreatedAt = true, includeUpdatedAt = true, createdAtName = 'created_at', updatedAtName = 'updated_at' }) => {
    return (
        <div style={{ margin: 0, marginBottom: 16, marginTop: 16 }}>
            {includeCreatedAt && 
                <Form.Item
                    label="Created At"
                    name={createdAtName}
                    {...createdAtProps}
                >
                    <Input readOnly />
                </Form.Item>
            }

            {includeUpdatedAt &&
                <Form.Item
                    label="Updated At"
                    name={updatedAtName}
                    {...updatedAtProps}
                >
                    <Input readOnly />
                </Form.Item>
            }

        </div>
    );
};

export default DataDateFields;