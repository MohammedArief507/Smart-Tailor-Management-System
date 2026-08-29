import { HiMinus, HiPlus } from "react-icons/hi";

// Small +/- control used to increase/decrease a product's quantity in the cart
const QuantityStepper = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center gap-3 bg-background dark:bg-[#121717] rounded-btn px-1 py-1">
      <button
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="w-7 h-7 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer flex items-center justify-center text-textmain dark:text-card active:scale-90 transition-transform"
      >
        <HiMinus className="text-sm" />
      </button>
      <span className="text-sm font-semibold w-4 text-center text-textmain dark:text-card">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="w-7 h-7 rounded-btn bg-primary text-white flex items-center justify-center active:scale-90 transition-transform"
      >
        <HiPlus className="text-sm" />
      </button>
    </div>
  );
};

export default QuantityStepper;
