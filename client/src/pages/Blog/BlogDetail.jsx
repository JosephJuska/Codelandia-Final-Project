import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getBlogByID from '../../requests/blog/get-blog-by-id';
import getCommentsByBlogID from '../../requests/comment/get-comments-by-blog-id';
import requestHandler from '../../utils/request-handler';
import { LoadingOutlined, EditOutlined } from '@ant-design/icons';
import { Image, Layout, Skeleton, Typography, Button, Tag, Divider, Card } from 'antd';
import 'github-markdown-css/github-markdown-light.css';
import NotFound from '../../components/NotFound';
import getDateInString from '../../utils/get-date-in-string';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const BlogDetail = () => {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  
  const [notFound, setNotFound] = useState(false);
  const [blog, setBlog] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const fetchComments = async () => {
    setCommentsLoading(true);
    const result = await getCommentsByBlogID(id, '', '', page);
    setComments(result.data?.comments);
    setHasMoreComments(result.data?.length && result.data.length < blog.commentCount);
    setCommentsLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const result = await getBlogByID(id);
    requestHandler(result, navigate, '/admin/login', '/');
    
    if (!result.success) {
    setNotFound(true);
    setLoading(false);
    return;
    }

    setBlog(result.data);
    setLoading(false);
    fetchComments(id);
  };

  useEffect(() => {
    fetchData();
  }, [id, navigate, page]);

  const loadMoreComments = async () => {
    setPage(prevPage => prevPage + 1);
    const result = await fetchComments();
    setComments(prevComments => [...prevComments, ...result.data.comments]);
    setHasMoreComments(result.data?.length && result.data.length < blog.commentCount);
  };

  const handleEditClick = () => {
    navigate('/admin/blog/edit/' + id);
  };

  return (
    <Layout style={{ padding: '20px' }}>
      {loading ? (
        <Skeleton active />
      ) : notFound || !blog ? (
        <NotFound isData={false} />
      ) : (
        <> 
          <Image
            src={blog.bannerPath}
            alt={blog.title}
            width="100%"
          />
          <Layout style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <Title level={1} style={{ marginTop: '16px' }}>{blog.title}</Title>
            <Button type="primary" onClick={handleEditClick}>Edit <EditOutlined /></Button>
          </Layout>
          <Layout style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' , gap: '16px' }}>
            <Paragraph><Link to={`/admin/user/${blog.authorID}`}>{blog.authorUsername || 'Unknown Author'} | {blog.authorEmail}</Link></Paragraph>
            {blog.publishDate ? (
            <Paragraph>
                Published on: {getDateInString(blog.publishDate)}
            </Paragraph>
            ) : (
            <Paragraph>Not Published Yet</Paragraph>
            )}
          </Layout>
          <Paragraph>Created At: {getDateInString(blog.createdAt)}</Paragraph>
          <Paragraph>Updated At: {blog?.updatedAt ? getDateInString(blog.updatedAt) : 'Not updated yet'}</Paragraph>   
          <Paragraph style={{ marginTop: '16px' }} >{blog.description}</Paragraph>
          <Paragraph style={{ paddingBottom: '16px', borderBottom: '3px solid black' }} >{blog?.subDescription || ''}</Paragraph>
          <div className='markdown-body' style={{ 'background': 'none' }} dangerouslySetInnerHTML={{ __html: blog.content ? blog.content : '' }} />
          
          <Title level={3} style={{ paddingTop: '40px' }}>Comments ({blog.commentCount})</Title>
          {commentsLoading ? (
            <Skeleton active />
          ) : (
            <>
              {comments && comments.length > 0 ? (
                <div style={{ padding: '8px' }}>
                  {comments.map((comment, index) => (
                    <Card
                      key={index}
                      style={{ width: '100%', marginBottom: '16px' }}
                    >
                      <Tag color="blue" style={{ marginBottom: '8px' }}>{comment.name}</Tag>
                      <Tag color='green'>{getDateInString(comment.createdAt, true)}</Tag>
                      <Paragraph>{comment.content}</Paragraph>
                      <Divider />
                    </Card>
                  ))}
                </div>
              ) : (
                <Paragraph>No comments</Paragraph>
              )}
              {hasMoreComments && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button
                    type="default"
                    shape="circle"
                    icon={<LoadingOutlined />}
                    onClick={loadMoreComments}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default BlogDetail;