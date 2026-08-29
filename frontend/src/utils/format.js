// Formats a number as Indian Rupees, e.g. 1250 -> "₹1,250"
export const formatCurrency = (amount = 0) => {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

// Formats a date/time as a short, readable label, e.g. "Today, 4:30 PM"
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `Today, ${time}`;

  return `${date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })}, ${time}`;
};
