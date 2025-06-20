'use client'

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import TransactionPreview from "./TransactionPreview"

interface CustomInteractionFlowProps {
  onBack: () => void;
  onComplete: (result: string) => void;
}

const CustomInteractionFlow = ({ onBack, onComplete }: CustomInteractionFlowProps) => {
  const [contractAddress, setContractAddress] = useState("");
  const [payableValue, setPayableValue] = useState("0");
  const [functionSignature, setFunctionSignature] = useState(""); 
  const [parsedFunction, setParsedFunction] = useState<{ name: string; inputs: { type: string }[] } | null>(null);
  const [args, setArgs] = useState<string[]>([]);
  const [encodedData, setEncodedData] = useState<{ data: string; error: string | null }>({ data: "0x", error: null });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const match = functionSignature.match(/^\s*(\w+)\s*\((.*)\)\s*$/);
      if (match) {
        const name = match[1];
        const params = match[2].trim();
        const inputs = params ? params.split(',').map(p => ({ type: p.trim() })) : [];
        
        setParsedFunction({ name, inputs });
        setArgs(new Array(inputs.length).fill("")); 
      } else {
        setParsedFunction(null);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [functionSignature]);

  useEffect(() => {
    if (!parsedFunction || args.some(arg => arg === "")) {
      setEncodedData({ data: "0x", error: "Please fill in all parameters" });
      return;
    }

    try {
      const iface = new ethers.Interface([`function ${parsedFunction.name}(${parsedFunction.inputs.map(i => i.type).join(',')})`]);
      const data = iface.encodeFunctionData(parsedFunction.name, args);
      setEncodedData({ data, error: null });
    } catch (e: any) {
      setEncodedData({ data: "0x", error: `Encoding error: ${e.shortMessage || e.message}` });
    }
  }, [parsedFunction, args]);
  
  const handleArgChange = (index: number, value: string) => {
    const newArgs = [...args];
    newArgs[index] = value;
    setArgs(newArgs);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        onComplete(`Transaction constructed (To: ${contractAddress}, Value: ${payableValue} ETH, Data: ${encodedData.data.substring(0, 30)}...)`);
    }, 1500);
  };
  
  const finalPreviewSummary = {
    title: "Transaction Details: Custom Call",
    details: {
      "Operation": `Call ${parsedFunction?.name || ''}`,
      "Target Contract": contractAddress,
      "Value": `${payableValue || '0'} ETH`,
      "Calldata": encodedData.data,
    }
  };

  if (showPreview) {
      return (
        <div className="p-4 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-inner h-full">
            <TransactionPreview 
                summary={finalPreviewSummary}
                onConfirm={handleConfirm}
                onCancel={() => setShowPreview(false)}
                loading={loading}
            />
        </div>
      );
  }

  return (
    <div className="p-4 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-inner h-full overflow-y-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-2xl font-bold hover:text-blue-600 transition-colors">←</button>
        <h2 className="text-xl font-bold text-[#000080]">⚙️ Custom Contract Interaction</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#000080]">Target Contract Address (To)</label>
          <input 
            type="text" 
            value={contractAddress} 
            onChange={e => setContractAddress(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-[#808080] bg-white text-sm shadow-win98-inner focus:outline-none focus:border-[#000080]" 
            placeholder="0x..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#000080]">Value (ETH)</label>
          <input 
            type="number" 
            value={payableValue} 
            onChange={e => setPayableValue(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-[#808080] bg-white text-sm shadow-win98-inner focus:outline-none focus:border-[#000080]" 
            placeholder="0.0"
          />
        </div>

        <div className="p-3 bg-white border-2 border-[#808080] shadow-win98-inner space-y-3">
          <div className="font-bold text-base text-[#000080] border-b-2 border-[#808080] pb-2">Calldata Builder</div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Function Signature</label>
            <input 
              type="text" 
              value={functionSignature}
              onChange={e => setFunctionSignature(e.target.value)}
              className="w-full px-2 py-1 border-2 border-[#808080] bg-white text-sm font-mono shadow-win98-inner focus:outline-none focus:border-[#000080]"
              placeholder="e.g. transfer(address,uint256)"
            />
          </div>

          {parsedFunction && parsedFunction.inputs.length > 0 && (
            <div className="space-y-3 pt-3">
              <div className="text-sm font-medium text-gray-700 border-b-2 border-[#808080] pb-2">Parameters:</div>
              {parsedFunction.inputs.map((input, index) => (
                <div key={index}>
                  <label className="block text-sm mb-2 text-gray-600">
                    Parameter {index + 1} <span className="font-semibold text-gray-800">({input.type})</span>
                  </label>
                  <input 
                    type="text" 
                    value={args[index] || ""}
                    onChange={e => handleArgChange(index, e.target.value)}
                    className="w-full px-2 py-1 border-2 border-[#808080] bg-white text-sm font-mono shadow-win98-inner focus:outline-none focus:border-[#000080]"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-3">
            <label className="block text-sm font-medium mb-2 text-gray-700">Data Preview:</label>
            <div className={`p-2 border-2 border-[#808080] bg-[#d4d0c8] text-sm font-mono break-all min-h-[60px] flex items-center shadow-win98-inner ${encodedData.error ? 'text-red-700' : 'text-green-800'}`}>
              {encodedData.error ? encodedData.error : encodedData.data}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowPreview(true)} 
          disabled={!!encodedData.error || !contractAddress}
          className="w-full mt-4 px-6 py-3 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] font-bold text-base disabled:opacity-50 transition-colors"
        >
          Preview Transaction
        </button>
      </div>
    </div>
  );
};

export default CustomInteractionFlow;