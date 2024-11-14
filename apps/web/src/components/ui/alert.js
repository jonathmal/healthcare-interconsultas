export function Alert({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-900 border-gray-200',
    destructive: 'bg-red-50 text-red-900 border-red-200'
  };

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <div className="mt-1 text-sm">{children}</div>;
}