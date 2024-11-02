import { Form, DatePicker, Button, Switch, InputNumber, Select, Spin, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import validateDiscountDate from '../../validations/discount/discount-date';
import getProductsList from '../../requests/product/get-products-list';
import getCategoriesList from '../../requests/category/get-categories-list';
import getBrandsPublic from '../../requests/brand/get-brands-public';
import getProductTypes from '../../requests/product-type/get-product-types';
import getDiscountByID from '../../requests/discount/get-discount-by-id';
import errorMessages from '../../utils/constants/error-messages';
import dayjs from 'dayjs';
import updateDiscount from '../../requests/discount/update-discount';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';
import getDateInString from '../../utils/get-date-in-string';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import NotFound from '../../components/NotFound';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';
import DataDateFields from '../../components/form/DataDateFields';

const { RangePicker } = DatePicker;

const DiscountDetail = () => {
  const [brands, setBrands] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentBrand, setCurrentBrand] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductType, setCurrentProductType] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [discount, setDiscount] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [fetchError, setFetchError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [discountLoading, setDiscountLoading] = useState(true);
  const [discountFetchError, setDiscountFetchError] = useState('');
  
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setDiscountLoading(true);
      setFetchError('');
      setDiscountFetchError('');
      try {
        const brandResponse = await getBrandsPublic();
        const productTypeResponse = await getProductTypes('', 'nameASC');
        const productResponse = await getProductsList()
        const categoryResponse = await getCategoriesList();
        const discountResponse = await getDiscountByID(id);

        if (!brandResponse.success || !productTypeResponse.success || !productResponse.success || !categoryResponse.success) {
          throw new Error('Failed to fetch data');
        };

        if(!discountResponse.success) {
            if(discountResponse.critical) setDiscountFetchError(errorMessages.UNEXPECTED_ERROR);
            else if(discountResponse.notFound) setNotFound(true);
            else setDiscountFetchError(discountResponse.error);
            setDiscountLoading(false);
            return;
        };

        const brandsData = brandResponse.data?.brands?.map(brand => {return { label: brand.name, value: brand.id }});
        const productTypesData = productTypeResponse.data?.map(productType => {return { label: productType.name, value: productType.id }});
        const productsData = productResponse.data?.map(product => {return { label: product.name, value: product.id }});
        const categoriesData = categoryResponse.data?.map(category => {return { label: category.name, value: category.id }});

        setBrands(brandsData);
        setProductTypes(productTypesData);
        setProducts(productsData);
        setCategories(categoriesData);

        form.setFieldsValue({
            brandID: discountResponse.data?.brandID,
            categoryID: discountResponse.data?.categoryID,
            productID: discountResponse.data?.productID,
            productTypeID: discountResponse.data?.productTypeID,
            discountPercentage: discountResponse.data?.discountPercentage,
            isActive: discountResponse.data?.isActive,
            dateRange: [
                discountResponse.data?.startDate ? dayjs(discountResponse.data?.startDate) : null,
                discountResponse.data?.endDate ? dayjs(discountResponse.data?.endDate) : null,
            ],
            created_at: getDateInString(discountResponse.data?.createdAt),
            updated_at: discountResponse.data?.updatedAt ? getDateInString(discountResponse.data?.updatedAt) : 'Not Updated'
        });
        setDiscount(discountResponse.data);
        setCurrentBrand(discountResponse.data?.brandID ? { label: discountResponse.data?.brandName, value: discountResponse.data?.brandID } : null);
        setCurrentCategory(discountResponse.data?.categoryID ? { label: discountResponse.data?.categoryName, value: discountResponse.data?.categoryID } : null);
        setCurrentProduct(discountResponse.data?.productID ? { label: discountResponse.data?.productName, value: discountResponse.data?.productID } : null);
        setCurrentProductType(discountResponse.data?.productTypeID ? { label: discountResponse.data?.productTypeName, value: discountResponse.data?.productTypeID } : null);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setLoading(false);
        setDiscountLoading(false);
      }
    };

    fetchData();
  }, []);

  const onReset = () => {
    form.setFieldsValue({
        brandID: discount?.brandID,
        categoryID: discount?.categoryID,
        productID: discount?.productID,
        productTypeID: discount?.productTypeID,
        discountPercentage: discount?.discountPercentage,
        isActive: discount?.isActive,
        dateRange: [
            discount?.startDate ? dayjs(discount?.startDate) : null,
            discount?.endDate ? dayjs(discount?.endDate) : null,
        ],
        created_at: getDateInString(discount?.createdAt),
        updated_at: discount?.updatedAt ? getDateInString(discount?.updatedAt) : 'Not Updated'
    });
    setDiscount(discount.data);
    setCurrentBrand(discount?.brandID ? { label: discount?.brandName, value: discount?.brandID } : null);
    setCurrentCategory(discount?.categoryID ? { label: discount?.categoryName, value: discount?.categoryID } : null);
    setCurrentProduct(discount?.productID ? { label: discount?.productName, value: discount?.productID } : null);
    setCurrentProductType(discount?.productTypeID ? { label: discount?.productTypeName, value: discount?.productTypeID } : null);
  };

  const onSelectChange = (event, type) => {
    if(type === "category"){
      setCurrentCategory(categories.find(c => c.value === event))
    }else if(type === "product"){
      setCurrentProduct(products.find(p => p.value === event))
    }else if(type === "brand"){
      setCurrentBrand(brands.find(b => b.value === event))
    }else{
      setCurrentProductType(productTypes.find(pt => pt.value === event))
    }
  };

  const onFinish = async (values) => {
    const [startDate, endDate] = values.dateRange;
    values.startDate = startDate.toISOString();
    values.endDate = endDate.toISOString();

    const count = (values.brandID ? 1 : 0) + (values.categoryID ? 1 : 0) + (values.productTypeID ? 1 : 0) + (values.productID ? 1 : 0);

    if(count === 0){
        form.setFields([
            { name: 'brandID', errors: ['One of brands, products, categories or product types must be selected'] },
            { name: 'categoryID', errors: ['One of brands, products, categories or product types must be selected'] },
            { name: 'productID', errors: ['One of brands, products, categories or product types must be selected'] },
            { name: 'productTypeID', errors: ['One of brands, products, categories or product types must be selected'] }
        ]);
        return
    };

    if(count > 1){
        form.setFields([
            { name: 'brandID', errors: ['Only one of brands, products, categories or product types must be selected'] },
            { name: 'categoryID', errors: ['Only one of brands, products, categories or product types must be selected'] },
            { name: 'productID', errors: ['Only one of brands, products, categories or product types must be selected'] },
            { name: 'productTypeID', errors: ['Only one of brands, products, categories or product types must be selected'] }
        ]);
        return
    };

    form.setFields([
        { name: 'brandID', errors: [] },
        { name: 'categoryID', errors: [] },
        { name: 'productID', errors: [] },
        { name: 'productTypeID', errors: [] }
    ]);

    setLoadingUpdate(true);
    
    const result = await updateDiscount(id, values.startDate, values.endDate, values.productID, values.categoryID, values.brandID, values.productTypeID, values.discountPercentage, values.isActive);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible, { dateRange: [startDate, endDate] });
      setLoadingUpdate(false);

      return;
    };

    const resultUpdate = await getDiscountByID(id);
    requestHandler(resultUpdate, navigate, '/admin/login', '/');
    if(resultUpdate.success){
        form.setFieldValue('updated_at', resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated');
    }
    showModal(setModalData, setModalVisible, 'success', 'Discount updated successfully!');
    setLoadingUpdate(false);
  };

  return (
    <>
        {discountLoading && <Spin size='large' />}
        {notFound && <NotFound  isData={false} />}
        {discountFetchError && <Alert error='Error' type='error' description={discountFetchError} />}
        {!discountLoading && !discountFetchError &&
        <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
            <UndoFieldsButton onReset={onReset} />
            <Form.Item
                label="Date Range (Start and End Date with Time)"
                name="dateRange"
                rules={[{
                required: true,
                validator: async (_, value) => {
                    let startDate = '';
                    let endDate = '';
                    if (value) {
                    startDate = value[0] ? value[0].toISOString() : '';
                    endDate = value[1] ? value[1].toISOString() : '';
                    }

                    const resultStart = await validateDiscountDate(startDate, 'startDate');
                    const resultEnd = await validateDiscountDate(endDate, 'endDate');
                    if (!resultStart.success || !resultEnd.success) return Promise.reject(resultStart.error || resultEnd.error);
                    if (startDate && endDate && startDate > endDate) return Promise.reject('endDate must be later than startDate');
                    return Promise.resolve();
                }
                }]}
            >
                <RangePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>

            <Form.Item
                label='Percentage'
                name="discountPercentage"
                rules={[{
                required: true,
                type: 'number',
                min: 1,
                max: 100
                }]}
            >
                <InputNumber min={1} max={100} />
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

            {fetchError && <Alert message="Error" description={fetchError} type="error" showIcon />}

            {loading && <Spin size='large' /> }

            <Form.Item
                label="Brand"
                name="brandID"
                style={{ maxWidth: 350 }}
            >
                <Select 
                placeholder="Select a brand" 
                options={brands} 
                showSearch 
                optionFilterProp='label' 
                allowClear
                onChange={event => onSelectChange(event, 'brand')}
                dropdownRender={menu => <SelectorFooterMenu menu={menu} link={'/admin/brand/create'} buttonText={'Add new brand'} />} 
                />
            </Form.Item>

            <LinkToData data={currentBrand} text={'View Brand'} endpoint={'/admin/brand'} />

            <Form.Item
            label="Category"
            name="categoryID"
            style={{ maxWidth: 350 }}
        >
            <Select 
              placeholder="Select a category" 
              options={categories} 
              showSearch 
              optionFilterProp='label' 
              allowClear 
              onChange={event => onSelectChange(event, 'category')}
              dropdownRender={menu => <SelectorFooterMenu menu={menu} link={'/admin/category/create'} buttonText={'Add new category'} />}
            />
        </Form.Item>

        <LinkToData data={currentCategory} text={'View Category'} endpoint={'/admin/category'} />

        <Form.Item
            label="Product"
            name="productID"
            style={{ maxWidth: 350 }}
        >
            <Select 
              placeholder="Select a product" 
              options={products} 
              showSearch 
              optionFilterProp='label' 
              allowClear
              onChange={event => onSelectChange(event, 'product')}
              dropdownRender={menu => <SelectorFooterMenu menu={menu} link={'/admin/product/create'} buttonText={'Add new product'} />} 
            />
        </Form.Item>

        <LinkToData data={currentProduct} text={'View Product'} endpoint={'/admin/product'} />

        <Form.Item
            label="Product Type"
            name="productTypeID"
            style={{ maxWidth: 350 }}
        >
            <Select 
              placeholder="Select a product type" 
              options={productTypes} 
              showSearch 
              optionFilterProp='label' 
              allowClear 
              onChange={event => onSelectChange(event, 'productType')}
              dropdownRender={menu => <SelectorFooterMenu menu={menu} link={'/admin/product-type'} buttonText={'Add new product type'} />}
            />
        </Form.Item>

        <LinkToData data={currentProductType} text={'View Product Type'} endpoint={'/admin/product-type'} />

        <DataDateFields />

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update Discount</Button>
            </Form.Item>

            <ResultModal 
              modalData={modalData}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              navigate={navigate}
            />
        </Form>
        }
    </>
  );
};

export default DiscountDetail;