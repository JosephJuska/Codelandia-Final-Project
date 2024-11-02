const Color = ({ color1, color2 = null, color3 = null, onClick }) => {
    let background;
    
    if (color1 && color2 && color3) {
      background = `linear-gradient(120deg, ${color1} 0%, ${color1} 33.33%, ${color2} 33.33%, ${color2} 66.66%, ${color3} 66.66%, ${color3} 100%)`;
    } 
    
    else if (color1 && color2) {
      background = `linear-gradient(120deg, ${color1} 0%, ${color1} 50%, ${color2} 50%, ${color2} 100%)`;
    } 
    
    else {
      background = color1;
    }

  
    return (
      <div
        onClick={onClick}
        style={{
          width: "20px",
          height: "20px",
          background: background,
          borderRadius: '50%'
        }}
      />
    );
  };
  
  export default Color;  