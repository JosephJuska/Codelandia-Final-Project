import { Empty, Result } from 'antd';

const NotFound = ({ description, isData=true }) => {
  return (
    isData ? <Empty description={description || '404 Not Found'} /> : <Result status="404" title="404" subTitle={description || "Sorry, the page you visited does not exist."} />
  )
}

export default NotFound;