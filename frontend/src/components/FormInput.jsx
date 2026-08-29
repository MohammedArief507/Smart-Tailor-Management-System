// A reusable, mobile-friendly text input used across auth and other forms
const FormInput = ({ label, type = "text", name, value, onChange, placeholder, icon, error }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1.5 text-sm font-medium text-textmain dark:text-card">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-13 py-3.5 ${icon ? "pl-11" : "pl-4"} pr-4 rounded-btn bg-white dark:bg-[#1E2626] border ${
            error ? "border-danger" : "border-gray-200 dark:border-gray-700"
          } text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-[15px]`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};

export default FormInput;
