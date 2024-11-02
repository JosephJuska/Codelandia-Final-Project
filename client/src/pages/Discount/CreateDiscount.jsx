import { Form, DatePicker, Button, Switch, InputNumber, Select, Spin, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import createDiscount from '../../requests/discount/create-discount';
import validateDiscountDate from '../../validations/discount/discount-date';
import getProductsList from '../../requests/product/get-products-list';
import getCategoriesList from '../../requests/category/get-categories-list';
import getBrandsPublic from '../../requests/brand/get-brands-public';
import getProductTypes from '../../requests/product-type/get-product-types';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';
import SelectorFooterMenu from '../../components/SelectFooterMenu';
import LinkToData from '../../components/LinkToData';

const { RangePicker } = DatePicker;

const CreateDiscount = () => {
  const [brands, setBrands] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentBrand, setCurrentBrand] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductType, setCurrentProductType] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  const [form] = Form.useForm();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const brandResponse = await getBrandsPublic();
        const productTypeResponse = await getProductTypes('', 'nameASC');
        const productResponse = await getProductsList()
        const categoryResponse = await getCategoriesList();

        if (!brandResponse.success || !productTypeResponse.success || !productResponse.success || !categoryResponse.success) {
          throw new Error('Failed to fetch data');
        };

        const brandsData = brandResponse.data?.brands?.map(brand => {return { label: brand.name, value: brand.id }});
        const productTypesData = productTypeResponse.data?.map(productType => {return { label: productType.name, value: productType.id }});
        const productsData = productResponse.data?.map(product => {return { label: product.name, value: product.id }});
        const categoriesData = categoryResponse.data?.map(category => {return { label: category.name, value: category.id }});

        setBrands(brandsData);
        setProductTypes(productTypesData);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoadingCreate(true);
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
        setLoadingCreate(false);
        return
    };

    if(count > 1){
        form.setFields([
            { name: 'brandID', errors: ['Only one of brands, products, categories or product types must be selected'] },
            { name: 'categoryID', errors: ['Only one of brands, products, categories or product types must be selected'] },
            { name: 'productID', errors: ['Only one of brands, products, categories or product types must be selected'] },
            { name: 'productTypeID', errors: ['Only one of brands, products, categories or product types must be selected'] }
        ]);
        setLoadingCreate(false);
        return
    };

    form.setFields([
        { name: 'brandID', errors: [] },
        { name: 'categoryID', errors: [] },
        { name: 'productID', errors: [] },
        { name: 'productTypeID', errors: [] }
    ]);

    const result = await createDiscount(values.startDate, values.endDate, values.productID, values.categoryID, values.brandID, values.productTypeID, values.discountPercentage, values.isActive);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      handleFormError(form, result, setModalData, setModalVisible, { dateRange: [startDate, endDate] });
      setLoadingCreate(false);

      return;
    }

    showModal(setModalData, setModalVisible, 'success', 'Discount Created Successfully!', 'View DIscount', '/admin/discount/' + result.data.id);
    setLoadingCreate(false);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} scrollToFirstError>
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

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loadingCreate}>Create Discount</Button>
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

export default CreateDiscount;