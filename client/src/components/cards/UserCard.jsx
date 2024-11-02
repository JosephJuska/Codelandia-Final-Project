import { Card, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';

const { Paragraph } = Typography;

const UserCard = ({ item, navigate }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    actions={[
        <EyeOutlined key="details" style={{ fontSize: '20px' }} onClick={() => navigate('/admin/user/' + item.id)} />,
    ]}
    >
    <Card.Meta
        title={item.email}
        description={<>
          <Paragraph>Username: {item.username ? item.username : 'Anonymous'}</Paragraph>
          <Paragraph>First Name: {item.firstName}</Paragraph>
          <Paragraph>Last Name: {item.lastName}</Paragraph>
          <Paragraph>Is Active: {item.isActive ? 'true' : 'false'}</Paragraph>
          <Paragraph>Is Verified: {item.verified ? 'true' : 'false'}</Paragraph>
          <Paragraph>Created At: {getDateInString(item.createdAt, true)}</Paragraph>
          <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt, true) : 'Not Updated'}</Paragraph>
        </>
        }
    />
    
    </Card>
  )
};

export default UserCard;