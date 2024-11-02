import { Card, Image, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';
import truncateText from '../../utils/truncate-text';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const BlogCard = ({ item, handleClick, confirmDelete, navigate, isAdmin=false }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    cover={
        <Image
        alt={item.title}
        src={item.bannerPath}
        style={{ width: '100%', position: 'relative', objectFit: 'cover' }}
        />
    }
    actions={[
        <EyeOutlined key='details' style={{ fontSize: '20px' }} onClick={() => handleClick(item.id)} />,
        <DeleteOutlined style={{ fontSize: '20px' }} key='delete' onClick={() => confirmDelete(item.id)}/>
    ]}
    >
    <Card.Meta
        title={<Title level={4} onClick={() => navigate(isAdmin ? '/admin/blog/' + item.id : '/writer/blog/' + item.id)}>{item.title}</Title>}
        description={
        <>
            {isAdmin && (
                <>
                    <Paragraph>Author: <Link to={`/admin/user/${item.authorID}`}>{item.authorUsername || 'Anonymous'}</Link></Paragraph>
                    <Paragraph>Author Email: {item.authorEmail}</Paragraph>
                </>
            )}
            {item?.publishDate ? (
            <Paragraph>
                Published on: {getDateInString(item.publishDate, true)}
            </Paragraph>
            ) : (
            <Paragraph>Not Published Yet</Paragraph>
            )}
            <Paragraph>Description: {truncateText(item?.description)}</Paragraph>
            <Paragraph>Comment Count: {item.commentCount}</Paragraph>
            <Paragraph>Created At: {getDateInString(item.createdAt, true)}</Paragraph>
            <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt, true) : 'Not Updated'}</Paragraph>
        </>
        }
    />
    
    </Card>
  )
};

export default BlogCard;