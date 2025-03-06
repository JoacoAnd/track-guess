export default function Loader() {
  return (
    <div className="flex items-center justify-center h-20 gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="w-2 h-8 bg-emerald-500 animate-wave rounded-lg"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
