// A single metric card used in the Dashboard's 2x2 stats grid.
// Pass onClick to make it tappable (e.g. linking to a management screen).
const StatCard = ({ label, value, icon: Icon, accent = "primary", onClick }) => {
  const accentClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
  };

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={`bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4 flex flex-col gap-3 text-left w-full ${
        onClick ? "active:scale-[0.97] transition-transform" : ""
      }`}
    >
      <div className={`w-10 h-10 rounded-btn flex items-center justify-center ${accentClasses[accent]}`}>
        <Icon className="text-xl" />
      </div>
      <div>
        <p className="text-lg font-bold text-textmain dark:text-card leading-tight">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
    </Wrapper>
  );
};

export default StatCard;
