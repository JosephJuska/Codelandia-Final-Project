import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Layout, Modal, Slider } from 'antd';
import getCategories from '../../requests/category/get-categories';
import getBrandsPublic from '../../requests/brand/get-brands-public';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import Filters from '../../components/Filters';
import DataTable from '../../components/DataTable';
import RadioFilter from '../../components/form/RadioFilter';
import getProducts from '../../requests/product/get-products';
import SelectorFilter from '../../components/form/SelectorFilter';
import validateProductSearchTerm from '../../validations/product-get/product-search-term';
import validateProductSort from '../../validations/product-get/product-sort-by';
import deleteProduct from '../../requests/product/delete-product';
import ProductCard from '../../components/cards/ProductCard';
import showModal from '../../utils/show-result-modal';
import ResultModal from '../../components/ResultModal';

const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'nameASC', label: 'Name [A-Z]' },
  { value: 'nameDESC', label: 'Name [Z-A]' },
  { value: 'priceASC', label: 'Price [Ascending]' },
  { value: 'priceDESC', label: 'Price [Descending]' }
];

const ProductPage = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');

  const [categoryID, setCategoryID] = useState('');
  const [categoryIDError, setCategoryIDError] = useState('');
  
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  
  const [brandID, setBrandID] = useState('');
  const [brandIDError, setBrandIDError] = useState('');

  const [isActive, setIsActive] = useState('');
  const [isActiveError, setIsActiveError] = useState(null);
  
  const [hasDiscount, setHasDiscount] = useState('');
  const [hasDiscountError, setHasDiscountError] = useState('');
  
  const [startPrice, setStartPrice] = useState(1);
  const [endPrice, setEndPrice] = useState(99999.99);
  const [priceError, setPriceError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  
  const navigate = useNavigate();

  const fetchFilterData = async () => {
    const resultCategory = await getCategories(true);
    const resultBrand = await getBrandsPublic();

    if(!resultCategory.success) {
        setCategoryIDError(resultCategory.error);
    };

    if(!resultBrand.success) {
        setBrandIDError(resultBrand.error);
    };

    const mappedCategories = resultCategory.data?.map(category => ({
        value: category.id,
        label: category.name,
    })) || [];

    const mappedBrands = resultBrand.data?.brands.map(brand => ({
        value: brand.id,
        label: brand.name,
    })) || [];

    setCategoryOptions(mappedCategories);
    setBrandOptions(mappedBrands);
    setLoading(false);
  };


  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const response = await getProducts(isActive, searchTerm, sortValue, startPrice, endPrice, hasDiscount, categoryID, brandID, currentPage);
    if (!response.success) {
      requestHandler(response, navigate, '/admin/login', '/');
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
      if (response.error?.isActive) setIsActiveError(response.error.isActive);
      if (response.error?.startPrice || response.error?.endPrice) setPriceError(response.error?.startPrice || response.error?.endPrice);
      setLoading(false);
      return;
    }
    setData(response.data?.products);
    setPageCount(response.data?.pageCount);
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, isActive, hasDiscount, categoryID, brandID]);

  useEffect(() => {
    const handler = setTimeout(() => {
        setTrigger(true);
    }, 500);

    return () => {
        clearTimeout(handler);
    }
  }, [startPrice, endPrice])

  useEffect(() => {
    setTrigger(false);
    fetchData();
  }, [currentPage, trigger]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePriceChange = (range) => {
      if(range) {
        setStartPrice(range[0]);
        setEndPrice(range[1]);
      }else{
        setPriceError('Range must be provided');
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

  const handleProductDelete = async () => {
    setModalVisible(false);
    const result = await deleteProduct(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error);
      return;
    };

    showModal(setModalData, setModalVisibleDelete, 'success', 'Product deleted successfully');
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
      <RadioFilter
        label='Has Discount'
        error={hasDiscountError}
        setError={setHasDiscountError}
        value={hasDiscount}
        setValue={setHasDiscount}
        options={[
          {value:'true', label:'Yes'},
          {value:'false', label:'No'}
        ]}
      />
      <SelectorFilter 
        label='Category'
        placeholder='Select category'
        error={categoryIDError}
        setError={setCategoryIDError}
        value={categoryID}
        setValue={setCategoryID}
        options={categoryOptions}
        multiple={false}
      />
      <SelectorFilter 
        label='Brand'
        placeholder='Select brand'
        error={brandIDError}
        setError={setBrandIDError}
        value={brandID}
        setValue={setBrandID}
        options={brandOptions}
        multiple={false}
      />
      <Form.Item
        label='Price'
        status={priceError ? 'error' : ''}
        help={priceError || ''}
      >
        <Slider step={0.1} range min={0} max={99999.99} value={[startPrice, endPrice]} onChange={handlePriceChange} />
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
          title='Products' 
          buttonText='Create Product' 
          buttonLink='/admin/product/create' 
          navigate={navigate}
          fetchData={fetchData} 
        />

        <DataPageBanner 
          admin={true}

          searchError={searchError}
          setSearchError={setSearchError}
          setSearchTerm={setSearchTerm}
          searchValidationFunction={validateProductSearchTerm}
          placeholder='Search by name or sku'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateProductSort}
        />

        <Layout style={{ background: 'none' }}>
          <Filters filters={filters} admin={true} />
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={ProductCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Product Found'
          />
        </Layout>
      </Content>

      <Modal
        title="Confirm Deletion"
        open={modalVisible}
        onOk={handleProductDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>

      <ResultModal 
        modalData={modalData}
        modalVisible={modalVisibleDelete}
        setModalVisible={setModalVisibleDelete}
        navigate={navigate}
      />
    </Layout>
  );
};

export default ProductPage;