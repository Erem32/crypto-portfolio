function EmptyState({ text = "No results" }) {
  return (
    <div role="status" className="p-8 text-center text-sm text-zinc-500">
      {text}
    </div>
  );
}

export default EmptyState;
