import { Button, Divider } from "antd";
import { Link } from "react-router-dom";

const SelectorFooterMenu = ({ menu, link, buttonText }) => {
    return (
        <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <Link to={link}>
                    <Button type="link">{buttonText}</Button>
                </Link>
        </div>
    )
};

export default SelectorFooterMenu;