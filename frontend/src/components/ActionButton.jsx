function ActionButton({ icon, tooltip, onClick, altText }) {
  return (
    <button 
      className="btn-action" 
      onClick={onClick} 
      title={tooltip}
    >
      <img src={icon} alt={altText} className="action-icon-img" />
    </button>
  );
}

export default ActionButton;