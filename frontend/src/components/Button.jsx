function Button({ texto, onClick, type = "button", className = "btn-primary" }) {
  
    return (
    <button className={className} type={type} onClick={onClick}>
      {texto}
    </button>
  );
}

export default Button;