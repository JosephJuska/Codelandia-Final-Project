import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Layout, Modal } from 'antd';
import getAnnouncements from '../../requests/announcement/get-announcements';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import deleteAnnouncement from '../../requests/announcement/delete-announcement';
import validateAnnouncementTitle from '../../validations/announcement/announcement-title';
import validateAnnouncementSort from '../../validations/announcement-get/announcement-sort-by';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import Filters from '../../components/Filters';
import DataTable from '../../components/DataTable';
import RadioFilter from '../../components/form/RadioFilter';
import DateRange from '../../components/form/DateRange';
import AnnouncementCard from '../../components/cards/AnnouncementCard';
import ResultModal from '../../components/ResultModal';
import errorMessages from '../../utils/constants/error-messages';
import showModal from '../../utils/show-result-modal';

const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'titleASC', label: 'Title [A-Z]' },
  { value: 'titleDESC', label: 'Title [Z-A]' }
];

const AnnouncementPage = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');

  const [isActive, setIsActive] = useState('');
  const [isActiveError, setIsActiveError] = useState(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const [modalVisibleDelete, setModalVisibleDelete] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const response = await getAnnouncements(isActive, searchTerm, sortValue, startDate, endDate, currentPage);
    if (!response.success) {
      requestHandler(response, navigate, '/admin/login', '/');
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      }
      if (response.error?.page) {
        setError('No Announcements Found');
        setPageCount(0);
        setData(null);
        return;
      }
      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.searchTerm) setSearchError(response.error.searchTerm);
      if (response.error?.dateRange) setDateError(response.error.dateRange);
      setLoading(false);
      return;
    }
    setData(response.data?.announcements);
    setPageCount(response.data?.pageCount);
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, searchTerm, isActive, startDate, endDate]);

  useEffect(() => {
    setTrigger(false);
    fetchData();
  }, [currentPage, trigger]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = (dates) => {
      if (dates) {
        setStartDate(dates[0] ? dates[0].format('YYYY-MM-DD') : '');
        setEndDate(dates[1] ? dates[1].format('YYYY-MM-DD') : '');
      } else {
        setStartDate('');
        setEndDate('');
      }  
  };

  const confirmDelete = (id) => {
    setDeletedID(id);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setDeletedID(null);
    setModalVisible(false);
  };

  const handleAnnouncementDelete = async () => {
    setModalVisible(false);
    const result = await deleteAnnouncement(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };
    
    showModal(setModalData, setModalVisibleDelete, 'success', 'Announcement Deleted Successfully');
    fetchData();
  };

  const filters = (
    <Form layout="vertical">
      <RadioFilter
        label='Activity Status'
        error={isActiveError}
        setError={setIsActiveError}
        value={isActive}
        setValue={setIsActive}
        options={[
          {value:'true', label:'Active'},
          {value:'false', label:'Inactive'}
        ]}
      />
      <DateRange 
        label='Date Range'
        dateError={dateError}
        handleDateChange={handleDateChange}
      />
    </Form>
  );

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Announcement Page</title>
      </Helmet>
      <Content>
        <DataPageHeader 
          title='Announcements' 
          buttonText='Create Announcement' 
          buttonLink='/admin/announcement/create' 
          navigate={navigate}
          fetchData={fetchData} 
        />

        <DataPageBanner 
          admin={true}

          searchError={searchError}
          setSearchError={setSearchError}
          setSearchTerm={setSearchTerm}
          searchValidationFunction={async (value) => {return await validateAnnouncementTitle(value, false)}}
          placeholder='Search by title'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateAnnouncementSort}
        />

        <Layout style={{ background: 'none' }}>
          <Filters filters={filters} admin={true} />
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={AnnouncementCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Announcements Found'
          />
        </Layout>
      </Content>

      <Modal
        title="Confirm Deletion"
        open={modalVisible}
        onOk={handleAnnouncementDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this announcement?</p>
      </Modal>

      <ResultModal
        modalVisible={modalVisibleDelete}
        setModalVisible={setModalVisibleDelete}
        navigate={navigate}
        modalData={modalData}
      />
    </Layout>
  );
};

export default AnnouncementPage;