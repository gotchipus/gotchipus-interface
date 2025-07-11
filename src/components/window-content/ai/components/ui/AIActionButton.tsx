interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ label, onClick, disabled = false }: ActionButtonProps) {
  return (
    <button
      className={`px-3 py-1 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] text-black font-semibold text-xs hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}