const variants = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

export function StatusBadge({ status, variant = "info" }) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${variants[variant]}`}
    >
      {status}
    </span>
  );
}
