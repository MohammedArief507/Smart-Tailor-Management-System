// A large, touch-friendly primary action button used throughout the app
const PrimaryButton = ({ children, onClick, type = "button", isLoading = false, disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full h-13 py-3.5 rounded-btn bg-primary text-white font-semibold text-[15px] shadow-soft active:scale-[0.98] transition-transform disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;
