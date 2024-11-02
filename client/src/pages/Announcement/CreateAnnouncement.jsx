import { Form, Input, DatePicker, Button, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import createAnnouncement from '../../requests/announcement/create-announcement';
import requestHandler from '../../utils/request-handler';
import validateAnnouncementTitle from '../../validations/announcement/announcement-title';
import validateAnnouncementDate from '../../validations/announcement/announcement-date';
import handleFormError from '../../utils/handle-form-error';
import { useState } from 'react';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';
import dateHandler from '../../utils/date-handler';

const { RangePicker } = DatePicker;

const CreateAnnouncement = () => {
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    setLoading(true);
    const [startDate, endDate] = values.dateRange;
    values.startDate = dateHandler.handleSentDate(startDate);
    values.endDate = dateHandler.handleSentDate(endDate);

    const result = await createAnnouncement(values.title, values.startDate, values.endDate, values.isActive);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible, { dateRange: [startDate, endDate] });
      setLoading(false);

      return;
    };

    setLoading(false);
    showModal(setModalData, setModalVisible, 'success', 'Announcement Created Successfully!', 'View Announcement', '/admin/announcement/' + result.data.id);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
      <Form.Item
        label="Title"
        name="title"
        style={{ maxWidth: '500px' }}
        rules={[{
            required: true,
            validator: async (_, value) => {
                const result = await validateAnnouncementTitle(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve(); 
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date Range (Start and End Date with Time)"
        name="dateRange"
        rules={[
          {
            required: true,
            validator: async (_, value) => {
                let startDate = '';
                let endDate = '';
                if (value) {
                  startDate = value[0] ? value[0].toISOString() : '';
                  endDate = value[1] ? value[1].toISOString() : '';
                }

                const resultStart = await validateAnnouncementDate(startDate, 'startDate');
                const resultEnd = await validateAnnouncementDate(endDate, 'endDate');
                if(!resultStart.success || !resultEnd.success) return Promise.reject(resultStart.error || resultEnd.error);
                if(startDate && endDate && startDate > endDate) return Promise.reject('endDate must be later than startDate');
                return Promise.resolve();
            }
          },
        ]}
      >
        <RangePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <Form.Item
        label="Active"
        name="isActive"
        valuePropName="checked"
        initialValue={false}
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Create Announcement</Button>
      </Form.Item>

      <ResultModal
        modalData={modalData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigate={navigate}
      />
    </Form>
  );
};

export default CreateAnnouncement;