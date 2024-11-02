import { useEffect, useState } from "react";
import getCurrency from "../../requests/currency/get-currency";
import getCurrentCurrency from "../../requests/currency/get-current-currency";
import { Button, Form, InputNumber, Layout, Spin, Alert, Typography } from "antd";
import updateCurrency from "../../requests/currency/update-currency";
import ResultModal from "../../components/ResultModal";
import { useNavigate } from "react-router-dom";
import requestHandler from "../../utils/request-handler";
import handleFormError from "../../utils/handle-form-error";
import errorMessages from "../../utils/constants/error-messages";
import showModal from "../../utils/show-result-modal";
import getDateInString from "../../utils/get-date-in-string";
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import DataDateFields from "../../components/form/DataDateFields";

const { Title, Paragraph } = Typography;

const CurrencyPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState(null);
  
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [currentRates, setCurrentRates] = useState(null);
  const [rates, setRates] = useState(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchServerCurrency = async () => {
    setLoading(true);
    setError(null);

    const result = await getCurrency();
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    };

    form.setFieldsValue({
      azn: result.data.azn,
      eur: result.data.eur,
      try: result.data.try,
      updated_at: result.data?.updatedAt ? getDateInString(result.data.updatedAt, true) : 'Not Updated'
    });
    setRates(result.data);
    setLoading(false);
  };

  const fetchCurrentRates = async () => {
    setLoading(true);
    setError(null);

    const result = await getCurrentCurrency();
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      showModal(setModalData, setModalVisible, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
      setLoading(false);
      return;
    };

    setCurrentRates(result.data);
    setLoading(false);
  };

  const onReset = () => {
    form.setFieldsValue({
      azn: rates.azn,
      eur: rates.eur,
      try: rates.try,
      updated_at: rates.updated_at ? getDateInString(rates.updated_at, true) : 'Not Updated'
    });
  };

  const onFinish = async (values) => {
    setLoadingUpdate(true);
    setError(false);
    const result = await updateCurrency(values.azn, values.eur, values.try);
    requestHandler(result, navigate, '/admin/login', '/');
    if(!result.success) {
        handleFormError(form, result, setModalData, setModalVisible);
        setLoadingUpdate(false);

        return;
    };

    const resultUpdate = await getCurrency();
    requestHandler(result, navigate, '/admin/login', '/');
    if(resultUpdate.success){
      setRates(resultUpdate.data);
      form.setFieldValue('updated_at', resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated');  
    }
    showModal(setModalData, setModalVisible, 'success', 'Rates Updated Successfully');
    setLoadingUpdate(false);
  };

  const autoFillFromCurrentRates = () => {
    if (!currentRates) {
      showModal(setModalData, setModalVisible, 'error', 'Current exchange rates have not been fetched yet.');
      return;
    };

    form.setFieldsValue({
      azn: currentRates.AZN,
      eur: currentRates.EUR,
      try: currentRates.TRY
    });
  };

  useEffect(() => {
    fetchServerCurrency();
  }, []);

  return (
    <Layout style={{ background: 'none' }}>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <>
          <Layout.Content>
            <Title level={2} >Update Currency Rates</Title>
            <Form form={form} onFinish={onFinish} scrollToFirstError>
              <UndoFieldsButton onReset={onReset} />
              <Form.Item
                label="Azerbaijani Manat"
                name="azn"
              >
                <InputNumber min={0} precision={5} />
              </Form.Item>

              <Form.Item
                label="EURO"
                name="eur"
              >
                <InputNumber min={0} precision={5} />
              </Form.Item>

              <Form.Item
                label="Turkish Lira"
                name="try"
              >
                <InputNumber min={0} precision={5} />
              </Form.Item>

              <DataDateFields includeCreatedAt={false} />

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingUpdate}>
                  Update Currency
                </Button>
              </Form.Item>
            </Form>
          </Layout.Content>

          <Layout.Content style={{ marginTop: '20px' }}>
            <Button type="default" onClick={fetchCurrentRates}>
              Fetch Current Exchange Rates
            </Button>

            {currentRates && (
              <div style={{ marginTop: '20px' }}>
                <Title level={3}>Current Exchange Rates</Title>
                <Paragraph><strong>Azerbaijani Manat (AZN):</strong> {currentRates.AZN}</Paragraph>
                <Paragraph><strong>Euro (EUR):</strong> {currentRates.EUR}</Paragraph>
                <Paragraph><strong>Turkish Lira (TRY):</strong> {currentRates.TRY}</Paragraph>

                <Button type="default" onClick={autoFillFromCurrentRates} style={{ marginTop: '10px' }}>
                    Auto-fill with Current Rates
                </Button>
              </div>
            )}

            <ResultModal 
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              modalData={modalData}
              navigate={navigate}
            />

          </Layout.Content>
        </>
      )}
    </Layout>
  );
};

export default CurrencyPage;