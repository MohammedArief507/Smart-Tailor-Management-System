import { HiOutlinePencil, HiOutlineShoppingBag } from "react-icons/hi";
import { getImageUrl } from "../../utils/getImageUrl";
import { formatCurrency } from "../../utils/format";
import QuantityStepper from "../QuantityStepper";

// Matches the Figma "Calculator page" product cards: square photo with a
// small edit-pencil badge on the corner, name + price below, and a green
// ADD button that turns into a quantity stepper once it's in the cart.
const ProductGridCard = ({ product, quantity, onAdd, onIncrease, onDecrease, onEdit }) => {
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-2.5">
      <div className="relative mb-2">
        <div className="w-full aspect-square rounded-btn bg-background dark:bg-[#121717] overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <HiOutlineShoppingBag className="text-2xl text-gray-300" />
          )}
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(product)}
            aria-label="Edit product"
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white dark:bg-[#1A2020] shadow-softer flex items-center justify-center text-primary"
          >
            <HiOutlinePencil className="text-xs" />
          </button>
        )}
      </div>

      <p className="text-xs font-semibold text-textmain dark:text-card truncate">
        {product.name}
      </p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatCurrency(product.price)}
        </span>
        {quantity > 0 ? (
          <QuantityStepper quantity={quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
        ) : (
          <button
            onClick={onAdd}
            className="px-3 h-7 rounded-btn bg-success text-white text-[11px] font-semibold"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductGridCard;
