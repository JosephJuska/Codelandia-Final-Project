import { Link } from "react-router-dom";
import { Typography } from "antd";

const { Paragraph } = Typography;

const LinkToData = ({ data, text, endpoint, addID = true }) => {
    return(
        <>
            {data && <Paragraph>{text}: <Link to={`${endpoint}/${addID ? data.value : ''}`} >{data.label}</Link></Paragraph>}
        </>
    )
};

export default LinkToData;