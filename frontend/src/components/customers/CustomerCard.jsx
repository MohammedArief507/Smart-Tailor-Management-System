import { HiOutlinePencil, HiOutlineUser } from "react-icons/hi";

const CustomerCard = ({ customer, onEdit }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <HiOutlineUser className="text-lg" />
        </div>
        <div>
          <p className="text-sm font-medium text-textmain dark:text-card">{customer.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {customer.phone}
            {customer.address ? ` · ${customer.address}` : ""}
          </p>
        </div>
      </div>

      <button
        onClick={() => onEdit(customer)}
        aria-label="Edit customer"
        className="w-8 h-8 rounded-btn bg-primary/10 text-primary flex items-center justify-center shrink-0"
      >
        <HiOutlinePencil className="text-sm" />
      </button>
    </div>
  );
};

export default CustomerCard;
