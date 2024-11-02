import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography, Layout, Modal, Form } from 'antd';
import getBlogs from '../../requests/blog/get-blogs';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import titleValidator from '../../validations/blog/blog-title';
import validateSortBy from '../../validations/blog/blog-sort-by';
import deleteBlog from '../../requests/blog/delete-blog';
import BlogCard from '../../components/cards/BlogCard';
import Filters from '../../components/Filters';
import RadioFilter from '../../components/form/RadioFilter';
import DataTable from '../../components/DataTable';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import SelectorFilter from '../../components/form/SelectorFilter';
import getOwners from '../../requests/user/get-owners';
import validateBlogOwners from '../../validations/blog-owners';
import showModal from '../../utils/show-result-modal';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../../components/ResultModal';

const { Paragraph } = Typography;
const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'titleASC', label: 'Title [A-Z]' },
  { value: 'titleDESC', label: 'Title [Z-A]' },
];

const BlogPage = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [publishedFilter, setPublishedFilter] = useState('');
  const [publishedError, setPublishedError] = useState('');
  
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  
  const [owners, setOwners] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([{ label: 'My Blogs', value: 'My Blogs' }]);
  const [ownersError, setOwnersError] = useState('');
  
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

    const response = await getBlogs(publishedFilter, sortValue, currentPage, title, owners);
    requestHandler(response, navigate, '/admin/login', '/');

    if (!response.success) {
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      };

      if (response.error?.page) {
        setError('No Blogs Found');
        setPageCount(0);
        setData(null);
        return;
      };
      
      if (response.error?.published) setPublishedError(response.error.published);
      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.title) setTitleError(response.error.title);
      if (response.error?.owners) setOwnersError(response.error.owners);
      setLoading(false);
      return;
    };

    setData(response.data?.blogs);
    setPageCount(response.data?.pageCount);

    setLoading(false);
    return;
  };

  const fetchOwners = async () => {
    const response = await getOwners();
    requestHandler(response, navigate, '/admin/login', '/');
  
    if (!response.success) {
      if (typeof response.error === 'string') {
        setOwnersError(response.error);
      };
    } else {
      let options = response.data ? response.data.map(owner => ({ label: `${owner.email}`, value: owner.id })) : [];
      setOwnerOptions(options);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [])

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, publishedFilter, title, JSON.stringify(owners)]);

  useEffect(() => {
    setTrigger(false);
    fetchData();
  }, [currentPage, trigger]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBlogClick = (id) => {
    navigate('/admin/blog/' + id);
  };

  const confirmDelete = (id) => {
    setDeletedID(id);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setDeletedID(null);
    setModalVisible(false);
  };

  const handleBlogDelete = async () => {
    setModalVisible(false);
    const result = await deleteBlog(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
      return;
    }

    showModal(setModalData, setModalVisibleDelete, 'success', 'Blog deleted successfully');
    fetchData();
  };

  const filters = (
    <Form layout="vertical">
      <RadioFilter
        label='Publication Status'
        error={publishedError}
        setError={setPublishedError}
        value={publishedFilter}
        setValue={setPublishedFilter}
        options={[
          {value:'true', label:'Published'},
          {value:'false', label:'Unpublished'}
        ]}
      />
      <SelectorFilter 
        label='Authors'
        placeholder='Select authors'
        error={ownersError}
        setError={setOwnersError}
        value={owners}
        setValue={setOwners}
        options={ownerOptions}
        validationFunction={validateBlogOwners}
        maxCount={5}
      />
    </Form>
  );

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Blog Page</title>
      </Helmet>
      <Content>
        <DataPageHeader title='Blogs' buttonText='Create Blog' buttonLink='/admin/blog/create' fetchData={fetchData} navigate={navigate} />

        <DataPageBanner 
          admin={true}

          searchError={titleError}
          setSearchError={setTitleError}
          setSearchTerm={setTitle}
          searchValidationFunction={titleValidator.validateTitleGet}
          placeholder='Search by title'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateSortBy}
        />

        <Layout style={{ background: 'none' }} >
          <Filters filters={filters} admin={true} />
          <DataTable            
            loading={loading}
            error={error}
            data={data}
            Card={BlogCard}
            navigate={navigate}
            handleClick={handleBlogClick}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Blogs Found'
            cardProps={{isAdmin: true}}
          />
        </Layout>

        <Modal
          title="Confirm Delete"
          open={modalVisible}
          onOk={handleBlogDelete}
          onCancel={cancelDelete}
          okText="Yes"
          cancelText="No"
        >
          <Paragraph>Are you sure you want to delete this blog?</Paragraph>
        </Modal>

        <ResultModal 
          modalData={modalData}
          setModalVisible={setModalVisibleDelete}
          modalVisible={modalVisibleDelete}
          navigate={navigate}
        />
      </Content>
    </Layout>
  );
};

export default BlogPage;