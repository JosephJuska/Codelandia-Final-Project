import { Card, Image, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';

const { Title, Paragraph } = Typography;

const TeamMemberCard = ({ item, confirmDelete, navigate }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    cover={
        <Image
            src={item.imagePath}
            style={{ width: '100%', padding: '16px' }}
        />
    }
    actions={[
        <EyeOutlined key="details" style={{ fontSize: '20px' }} onClick={() => navigate('/admin/team-member/' + item.id)} />,
        <DeleteOutlined style={{ fontSize: '20px' }} key="delete" onClick={() => confirmDelete(item.id)} />
    ]}
    >
    <Card.Meta
        title={<Title level={4} onClick={() => navigate('/admin/team-member/' + item.id)}>{item.fullName}</Title>}
        description={
            <>
                <Paragraph>Position: {item.jobPosition}</Paragraph>
                <Paragraph>Description: {item.shortDescription}</Paragraph>
                <Paragraph>Created At: {getDateInString(item.createdAt)}</Paragraph>
                <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt) : 'Not Updated'}</Paragraph>
            </>
        }
    />
    
    </Card>
  )
};

export default TeamMemberCard;