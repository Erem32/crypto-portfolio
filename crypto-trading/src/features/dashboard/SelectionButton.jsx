function SelectionButton({ children, isSelected = false, onClick }) {
  const PILL_BASE =
    "h-7 px-3 rounded-full text-xs bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

  const PILL_SELECTED =
    "h-7 px-3 rounded-full text-xs bg-indigo-600 text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

  const className = isSelected ? PILL_SELECTED : PILL_BASE;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default SelectionButton;
