import { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Switch } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import getAnnouncementByID from '../../requests/announcement/get-announcement-by-id';
import updateAnnouncement from '../../requests/announcement/update-announcement';
import requestHandler from '../../utils/request-handler';
import validateAnnouncementTitle from '../../validations/announcement/announcement-title';
import validateAnnouncementDate from '../../validations/announcement/announcement-date';
import NotFound from '../../components/NotFound';
import handleFormError from '../../utils/handle-form-error';
import Spinner from '../../components/Spinner';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';
import getDateInString from '../../utils/get-date-in-string';
import DataDateFields from '../../components/form/DataDateFields';
import dateHandler from '../../utils/date-handler';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';

const { RangePicker } = DatePicker;

const AnnouncementDetail = () => {
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [announcement, setAnnouncement] = useState(null);
  
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      const result = await getAnnouncementByID(id);
      requestHandler(result, navigate, '/admin/login', '/');

      if (!result.success) {
        if (result.notFound) {
          setNotFound(true);
        }
        setLoading(false);
        return;
      }

      const announcementData = result.data;
      form.setFieldsValue({
        title: announcementData.title,
        isActive: announcementData.isActive,
        dateRange: [
          announcementData.startDate ? dateHandler.handleReceivedDate(announcementData.startDate) : null,
          announcementData.endDate ? dateHandler.handleReceivedDate(announcementData.endDate) : null,
        ],
        created_at: getDateInString(announcementData.createdAt, true),
        updated_at: announcementData?.updatedAt ? getDateInString(announcementData.updatedAt, true) : 'Not Updated'
      });
      setAnnouncement(announcementData);
      setLoading(false);
    };

    fetchAnnouncement();
  }, [id, navigate, form]);

  const onReset = () => {
    form.setFieldsValue({
      title: announcement.title,
      isActive: announcement.isActive,
      dateRange: [
        announcement.startDate ? dateHandler.handleReceivedDate(announcement.startDate) : null,
        announcement.endDate ? dateHandler.handleReceivedDate(announcement.endDate) : null,
      ],
      created_at: getDateInString(announcement.createdAt, true),
      updated_at: announcement?.updatedAt ? getDateInString(announcement.updatedAt, true) : 'Not Updated'
    });
  }; 

  const onFinish = async (values) => {
    setLoadingUpdate(true);
    const [startDate, endDate] = values.dateRange;

    values.startDate = dateHandler.handleSentDate(startDate);
    values.endDate = dateHandler.handleSentDate(endDate);

    const result = await updateAnnouncement(id, values.title, values.startDate, values.endDate, values.isActive);
    requestHandler(result, navigate, '/admin/login', '/');
    
    if(!result.success) {
      handleFormError(form, result, setModalData, setModalVisible, { dateRange: [startDate, endDate] });
      setLoadingUpdate(false);

      return;
    };

    const resultUpdate = await getAnnouncementByID(id);
    requestHandler(result, navigate, '/admin/login', '/');
    if(resultUpdate.success) {
      setAnnouncement(resultUpdate.data);
      form.setFieldsValue({
        title: resultUpdate.data.title,
        isActive: resultUpdate.data.isActive,
        dateRange: [
          resultUpdate.data.startDate ? dateHandler.handleReceivedDate(resultUpdate.data.startDate) : null,
          resultUpdate.data.endDate ? dateHandler.handleReceivedDate(resultUpdate.data.endDate) : null,
        ],
        created_at: getDateInString(resultUpdate.data.createdAt, true),
        updated_at: resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated'
      });
    }
    setLoadingUpdate(false);
    showModal(setModalData, setModalVisible, 'success', 'Announcement Updated Successfully!');
    return;
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (notFound) {
    return <NotFound isData={false} />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <UndoFieldsButton onReset={onReset} />
      <Form.Item 
        label="Title" 
        name="title" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateAnnouncementTitle(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Is Active" 
        name="isActive" 
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Start and End Date"
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

      <DataDateFields />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update Announcement</Button>
      </Form.Item>

      <ResultModal
        modalData={modalData}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        navigate={navigate}
      />
    </Form>
  );
};

export default AnnouncementDetail;