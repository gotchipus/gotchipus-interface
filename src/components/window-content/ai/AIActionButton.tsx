interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ label, onClick, disabled = false }: ActionButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] text-black font-semibold
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a]"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}