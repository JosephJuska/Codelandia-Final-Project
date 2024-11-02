import { Button } from "antd";

const UndoFieldsButton = ({ onReset, ...props }) => {
    return (
        <Button 
            type='primary' 
            style={{ marginBottom: '16px' }} 
            onClick={onReset} 
            {...props}
        >
            Undo Fields
        </Button>
    );
};

export default UndoFieldsButton;