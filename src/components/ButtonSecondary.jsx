const ButtonSecondary = ({
  onClick,
  disabled,
  selected = false,
  children,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex cursor-pointer items-center gap-1 rounded-full border border-purple-500 px-4 py-2 transition ${
        selected
          ? "bg-purple-500 text-white"
          : "text-gray-600 hover:bg-purple-100"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
