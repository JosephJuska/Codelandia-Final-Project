import { Spin } from "antd";

const Spinner = ({ get = true }) => {
    const style = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    };

    return (
        <div style={style}>
            {get ? <Spin size="large" delay={200} /> : <Spin size="small" />}
        </div>
    )
};

export default Spinner;