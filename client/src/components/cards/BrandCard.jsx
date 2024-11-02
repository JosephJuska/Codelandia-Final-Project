import { Card, Image, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';

const { Title, Paragraph } = Typography;

const BrandCard = ({ item, confirmDelete, navigate }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    cover={
        <Image
            alt={item.name}
            src={item.imagePath}
            style={{ width: '100%', position: 'relative', objectFit: 'cover', padding: '16px' }}
        />
    }
    actions={[
        <EyeOutlined key='details' style={{ fontSize: '20px' }} onClick={() => navigate('/admin/brand/' + item.id)} />,
        <DeleteOutlined style={{ fontSize: '20px' }} key='delete' onClick={() => confirmDelete(item.id)} />
    ]}
    >
    <Card.Meta
        title={<Title level={4} onClick={() => navigate('/admin/brand/' + item.id)}>{item.name}</Title>}
        description={
            <>
              <Paragraph>ID: {item.id}</Paragraph>
              <Paragraph>Code: {item.code}</Paragraph>
              <Paragraph>Created At: {getDateInString(item.createdAt)}</Paragraph>
              <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt) : 'Not Updated'}</Paragraph>
            </>
        }
    />
    
    </Card>
  )
};

export default BrandCard;