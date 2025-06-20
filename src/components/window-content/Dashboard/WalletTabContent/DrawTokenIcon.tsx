const DrawTokenIcon = ({ tokenName, className }: { tokenName: string, className?: string }) => {
  return (
    <div className={`${className} bg-[#000080] text-white font-bold text-xs flex items-center justify-center border-2 border-[#808080] shadow-win98-inner`}>
      {tokenName.slice(0, 2).toUpperCase()}
    </div>
  );
};

export default DrawTokenIcon;