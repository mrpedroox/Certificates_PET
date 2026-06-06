function Input({ label, placeholder, value, onChange, type = "text" }) {
  
    return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;