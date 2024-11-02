import { Row, Col, Card, Statistic } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, CommentOutlined } from '@ant-design/icons';

const WriterStatistics = ({ statistics }) => {

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Blogs"
            value={statistics.totalBlogs}
            valueStyle={{ color: '#1890ff' }}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
      
      <Col span={6}>
        <Card>
          <Statistic
            title="Published Blogs"
            value={statistics.publishedBlogs}
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic
            title="Unpublished Blogs"
            value={statistics.unPublishedBlogs}
            valueStyle={{ color: '#cf1322' }}
            prefix={<CloseCircleOutlined />}
          />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic
            title="Total Comments"
            value={statistics.totalComments}
            valueStyle={{ color: '#faad14' }}
            prefix={<CommentOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default WriterStatistics;