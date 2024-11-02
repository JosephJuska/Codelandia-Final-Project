import { Card, Image, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';

const { Title, Paragraph } = Typography;

const BannerCard = ({ item, confirmDelete, navigate, handleClick }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    cover={
        <Image
            alt={item.header}
            src={item.backgroundPath}
            style={{ width: '100%', position: 'relative' }}
        />
    }
    actions={[
      <EyeOutlined key='details' style={{ fontSize: '20px' }} onClick={() => handleClick(item.id)} />,
      <DeleteOutlined style={{ fontSize: '20px' }} key='delete' onClick={() => confirmDelete(item.id)}/>
    ]}
    >
    <Card.Meta
        title={<Title level={4} onClick={() => navigate('/admin/banner/' + item.id)}>{item.header}</Title>}
        description={
          <>
            <Paragraph>Active Till: {item.activeTill ? getDateInString(item.activeTill) : 'N/A'}</Paragraph>
            <Paragraph>Active: {item.isActive && getDateInString(item.activeTill) <= new Date().toLocaleString() ? 'yes' : 'no'}</Paragraph>
            <Paragraph>Created At: {getDateInString(item.createdAt, true)}</Paragraph>
            <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt, true) : 'Not Updated'}</Paragraph>
          </>
        }
    />
    
    </Card>
  )
};

export default BannerCard;