export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="max-w-xs text-sm">{description}</p>
    </div>
  );
}
