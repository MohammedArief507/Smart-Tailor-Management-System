import { HiOutlinePencil, HiOutlineTrash, HiOutlineShoppingBag } from "react-icons/hi";
import { getImageUrl } from "../../utils/getImageUrl";
import { formatCurrency } from "../../utils/format";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-btn bg-background dark:bg-[#121717] overflow-hidden flex items-center justify-center shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <HiOutlineShoppingBag className="text-xl text-gray-300" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-textmain dark:text-card">{product.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(product)}
          aria-label="Edit product"
          className="w-8 h-8 rounded-btn bg-primary/10 text-primary flex items-center justify-center"
        >
          <HiOutlinePencil className="text-sm" />
        </button>
        <button
          onClick={() => onDelete(product)}
          aria-label="Delete product"
          className="w-8 h-8 rounded-btn bg-danger/10 text-danger flex items-center justify-center"
        >
          <HiOutlineTrash className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
