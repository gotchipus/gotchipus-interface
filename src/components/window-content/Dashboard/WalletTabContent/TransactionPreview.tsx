interface TransactionPreviewProps {
  summary: {
    title: string;
    details: Record<string, string>;
  };
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const TransactionPreview = ({ summary, onConfirm, onCancel, loading }: TransactionPreviewProps) => (
  <div className="p-4 bg-white border-2 border-[#808080] shadow-win98-inner h-full flex flex-col">
    <div className="font-bold text-lg text-[#000080] mb-3 border-b-2 border-[#808080] pb-2">Confirm Transaction</div>
    <div className="text-sm text-[#000080] mb-4">You are about to execute a transaction, please review:</div>
    
    <div className="p-3 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner flex-grow">
      <div className="font-bold text-base mb-3 text-[#000080] border-b-2 border-[#808080] pb-2">{summary.title}</div>
      <div className="space-y-3 text-sm">
        {Object.entries(summary.details).map(([key, value]) => (
          <div key={key} className="border-b-2 border-[#808080] pb-2 last:border-b-0">
            <span className="font-medium text-gray-700 block mb-1">{key}:</span> 
            <span className="break-all text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* <div className="text-sm text-center my-4 p-2 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner">
      Fee Estimate: ~$1.23 (0.0005 PHRS)
    </div> */}

    <div className="flex justify-between gap-4 pt-2">
      <button 
        onClick={onCancel} 
        className="px-6 py-3 border-2 border-[#808080] shadow-win98-outer w-full bg-[#d4d0c8] hover:bg-[#c0c0c0] text-base font-medium transition-colors"
      >
        Back to Modify
      </button>
      <button 
        onClick={onConfirm} 
        disabled={loading} 
        className="px-6 py-3 border-2 border-[#808080] shadow-win98-outer w-full bg-[#d4d0c8] hover:bg-[#c0c0c0] font-bold text-base disabled:opacity-50 transition-colors"
      >
        {loading ? "Sending..." : "✅ Confirm"}
      </button>
    </div>
  </div>
);

export default TransactionPreview;