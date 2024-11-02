import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const Refresh = ({ fetchData }) => {
  return (
    <Button style={{ marginBottom: '16px' }} type='primary' onClick={fetchData}><ReloadOutlined /></Button>
  )
}

export default Refresh