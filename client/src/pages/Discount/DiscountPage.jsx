import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Layout, Modal, Slider } from 'antd';
import getDiscounts from '../../requests/discount/get-discounts';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import deleteDiscount from '../../requests/discount/delete-discount';
import validateDiscountSort from '../../validations/discount-get/discount-sort-by';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import Filters from '../../components/Filters';
import DataTable from '../../components/DataTable';
import RadioFilter from '../../components/form/RadioFilter';
import DateRange from '../../components/form/DateRange';
import CheckboxFilter from '../../components/form/CheckboxFilter';
import DiscountCard from '../../components/cards/DiscountCard';
import ResultModal from '../../components/ResultModal';
import errorMessages from '../../utils/constants/error-messages';
import showModal from '../../utils/show-result-modal';

const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'percentageASC', label: 'Percentage [Ascending]' },
  { value: 'percentageDESC', label: 'Percentage [Descending]' }
];

const DiscountPage = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  
  const [isActive, setIsActive] = useState('');
  const [isActiveError, setIsActiveError] = useState(null);
  
  const [startPercentage, setStartPercentage] = useState(1);
  const [endPercentage, setEndPercentage] = useState(100);
  const [percentageError, setPercentageError] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  
  const [types, setTypes] = useState([false, false, false, false]);
  const [typeError, setTypeError] = useState('');
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const isCategory = types.includes(1);
    const isBrand = types.includes(2);
    const isProduct = types.includes(3);
    const isProductType = types.includes(4);

    const response = await getDiscounts(isActive, sortValue, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, currentPage);
    requestHandler(response, navigate, '/admin/login', '/');
    if (!response.success) {
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      };
      if (response.error?.page) {
        setError('No Discounts Found');
        setPageCount(0);
        setData(null);
        return;
      };
      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.dateRange) setDateError(response.error.dateRange);
      if (response.error?.isActive) setIsActiveError(response.error.isActive);
      if (response.error?.startPercentage || response.error?.endPercentage) setPercentageError(response.error?.startPercentage || response.error?.endPercentage);
      setLoading(false);
      return;
    };
    setData(response.data?.discounts);
    setPageCount(response.data?.pageCount);
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, isActive, startDate, endDate, JSON.stringify(types)]);

  useEffect(() => {
    const handler = setTimeout(() => {
        setTrigger(true);
    }, 500);

    return () => {
        clearTimeout(handler);
    }
  }, [startPercentage, endPercentage])

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

  const handlePercentageChange = (range) => {
      if(range) {
        setStartPercentage(range[0]);
        setEndPercentage(range[1]);
      }else{
        setPercentageError('Range must be provided');
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

  const handleDiscountDelete = async () => {
    setModalVisible(false);
    const result = await deleteDiscount(deletedID);
    requestHandler(result, navigate, '/admin/login', '/');
    setDeletedID(null);
    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    showModal(setModalData, setModalVisibleDelete, 'success', 'Discount deleted successfully');
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
      <CheckboxFilter 
        label='Type'
        error={typeError}
        setError={setTypeError}
        value={types}
        setValue={setTypes}
        options={[
            {value:1, label:'Category'},
            {value:2, label:'Brand'},
            {value:3, label:'Product'},
            {value:4, label:'ProductType'}
        ]}
      />
      <DateRange 
        label='Date Range'
        dateError={dateError}
        handleDateChange={handleDateChange}
      />
      <Form.Item
        label='Percentage'
        status={percentageError ? 'error' : ''}
        help={percentageError || ''}
      >
        <Slider range min={1} max={100} value={[startPercentage, endPercentage]} onChange={handlePercentageChange} />
      </Form.Item>
    </Form>
  );

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Discount Page</title>
      </Helmet>
      <Content>
        <DataPageHeader 
          title='Discounts' 
          buttonText='Create Discount' 
          buttonLink='/admin/discount/create' 
          navigate={navigate}
          fetchData={fetchData} 
        />

        <DataPageBanner 
          admin={true}
          search={false}

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateDiscountSort}
        />

        <Layout style={{ background: 'none' }}>
          <Filters filters={filters} admin={true} />
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={DiscountCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Discounts Found'
          />
        </Layout>
      </Content>

      <Modal
        title="Confirm Deletion"
        open={modalVisible}
        onOk={handleDiscountDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this discount?</p>
      </Modal>

      <ResultModal 
          modalVisible={modalVisibleDelete}
          setModalVisible={setModalVisibleDelete}
          modalData={modalData}
          navigate={navigate}
      />
    </Layout>
  );
};

export default DiscountPage;