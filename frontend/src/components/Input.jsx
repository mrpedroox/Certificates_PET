function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}) {
  
    return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
      />
    </div>
  );
}

export default Input;
