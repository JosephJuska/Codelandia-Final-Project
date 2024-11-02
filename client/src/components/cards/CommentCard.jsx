import { Card, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import getDateInString from '../../utils/get-date-in-string';

const { Title, Paragraph } = Typography;

const CommentCard = ({ item, handleClick, confirmDelete }) => {
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
            <Paragraph>Blog Title: <Link to={'/admin/blog/' + item.blogID}>{item.blogTitle}</Link></Paragraph>
            <Paragraph>Name: {item.name}</Paragraph>
            <Paragraph>Email: {item.email}</Paragraph>
            <Paragraph>Comment: {item.content}</Paragraph>
            <Paragraph>Created At: {getDateInString(item.createdAt)}</Paragraph>
        </>
        }
    />
    
    </Card>
  )
};

export default CommentCard;