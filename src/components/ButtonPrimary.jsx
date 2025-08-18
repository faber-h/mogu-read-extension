const ButtonPrimary = ({ onClick, disabled, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-full bg-purple-500 px-6 py-2 text-center text-sm text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
