import { Card, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';

const { Title, Paragraph } = Typography;

const ProductTypeCard = ({ item, confirmDelete, navigate }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    actions={[
        <EyeOutlined key="details" style={{ fontSize: '20px' }} onClick={() => navigate('/admin/product-type/' + item.id)} />,
        <DeleteOutlined style={{ fontSize: '20px' }} key="delete" onClick={() => confirmDelete(item.id)} />
    ]}
    >
    <Card.Meta
        title={<Title level={4} onClick={() => navigate('/admin/product-type/' + item.id)}>{item.name}</Title>}
        description={
            <>
                <Paragraph>Product Count: {item.productCount}</Paragraph>
                <Paragraph>Category Count: {item.categoryCount}</Paragraph>
                <Paragraph>Created At: {getDateInString(item.createdAt, true)}</Paragraph>
                <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt, true) : 'Not Updated'}</Paragraph>
            </>
        }
    />
    
    </Card>
  )
};

export default ProductTypeCard;