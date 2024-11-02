import { Card, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';

const { Paragraph } = Typography;

const AnnouncementCard = ({ item, confirmDelete, navigate }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    actions={[
        <EyeOutlined key="details" style={{ fontSize: '20px' }} onClick={() => navigate('/admin/announcement/' + item.id)} />,
        <DeleteOutlined style={{ fontSize: '20px' }} key="delete" onClick={() => confirmDelete(item.id)} />
    ]}
    >
    <Card.Meta
        title={item.title}
        description={<>
          <Paragraph>Is Active: {item.isActive ? 'true' : 'false'}</Paragraph>
          <Paragraph>Start Date: {getDateInString(item.startDate, true)}</Paragraph>
          <Paragraph>End Date: {getDateInString(item.endDate, true)}</Paragraph>
          <Paragraph>Created At: {getDateInString(item.createdAt, true)}</Paragraph>
          <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt, true) : 'Not Updated'}</Paragraph>
        </>
        }
    />
    
    </Card>
  )
};

export default AnnouncementCard;