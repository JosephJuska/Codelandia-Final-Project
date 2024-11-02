import { Alert, Row, Col, Pagination } from 'antd';
import NotFound from './NotFound';
import constants from '../utils/constants/constants';
import Spinner from './Spinner';

const DataTable = (
    { 
        loading, 
        error, 
        data, 
        Card, 
        navigate, 
        handleClick, 
        confirmDelete, 
        page=true,
        currentPage, 
        pageCount, 
        handlePageChange, 
        notFoundDescription,
        cardProps
    }) => {
  return (
    <div style={{ width: '100%' }}>
        {loading ? (
            <Spinner />
        ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
        ) : (
            <>
            {!data ? (
                <NotFound description={notFoundDescription} />
            ) : (
                <>
                <Row gutter={[16, 16]}>
                    {data.map((item, index) => (
                    <Col xs={24} sm={24} md={24} lg={12} xl={8} key={index}>
                        <Card
                        item={item}
                        handleClick={handleClick}
                        confirmDelete={confirmDelete}
                        navigate={navigate}
                        {...cardProps}
                        />
                    </Col>
                    ))}
                </Row>
                
                {page && (
                    <Pagination
                        current={currentPage}
                        pageSize={constants.PAGE_SIZE}
                        total={pageCount * constants.PAGE_SIZE}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        style={{ textAlign: 'center', marginTop: '20px' }}
                    />
                )}
                </>
            )}
            </>
        )}      
    </div>
  )
}

export default DataTable;