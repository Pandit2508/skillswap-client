const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-medium transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
