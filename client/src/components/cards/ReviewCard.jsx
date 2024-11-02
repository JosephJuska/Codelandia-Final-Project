import { Card, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import getDateInString from '../../utils/get-date-in-string';

const { Title, Paragraph } = Typography;

const ReviewCard = ({ item, handleClick, confirmDelete }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    actions={[
        <DeleteOutlined style={{ fontSize: '20px' }} key='delete' onClick={() => confirmDelete(item.id)}/>
    ]}
    >
    <Card.Meta
        title={<Title level={4} onClick={() => handleClick(item)}>{item.email}</Title>}
        description={
        <>
            <Paragraph>Product Name: <Link to={`/admin/product/${item.productID}`}>{item.productName}</Link></Paragraph>
            <Paragraph>Rating: {item.review}</Paragraph>
            <Paragraph>Email: {item.email}</Paragraph>
            <Paragraph>Name: {item.name}</Paragraph>
            <Paragraph>Review: {item.description}</Paragraph>
            <Paragraph>Created At: {getDateInString(item.createdAt)}</Paragraph>
        </>
        }
    />
    
    </Card>
  )
};

export default ReviewCard;