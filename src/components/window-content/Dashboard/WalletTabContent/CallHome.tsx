'use client'

import Image from 'next/image'

interface CallHomeProps {
  setActiveFlow: (flow: 'sendToken' | 'sendNft' | 'custom') => void;
}

const CallHome = ({ setActiveFlow }: CallHomeProps) => (
  <div className="p-6">
    <div className="text-xl font-bold text-[#000080] mb-6 text-center">Please select the operation you want to perform</div>
    <div className="grid grid-cols-2 gap-6">
      <button 
        onClick={() => setActiveFlow('sendToken')} 
        className="p-6 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] flex flex-col items-center justify-center space-y-3 transition-colors min-h-[120px] active:shadow-win98-inner active:bg-[#c0c0c0]"
      >
        <Image src="/icons/transfer-token.png" alt="Send Tokens" width={40} height={40} />
        <div className="text-lg font-bold text-[#000080]">Send Your Tokens</div>
      </button>
      <button 
        onClick={() => setActiveFlow('sendNft')} 
        className="p-6 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] flex flex-col items-center justify-center space-y-3 transition-colors min-h-[120px] active:shadow-win98-inner active:bg-[#c0c0c0]"
      >
        <Image src="/pharos.png" alt="Send Tokens" width={40} height={40} />
        <div className="text-lg font-bold text-[#000080]">Send Your NFTs</div>
      </button>
      <button 
        onClick={() => setActiveFlow('custom')} 
        className="p-6 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] flex flex-row items-center justify-center space-x-4 transition-colors col-span-2 min-h-[80px] active:shadow-win98-inner active:bg-[#c0c0c0]"
      >
        <Image src="/icons/call-data.png" alt="Send Tokens" width={40} height={40} />
        <div className="text-lg font-bold text-[#000080]">Custom Contract Interaction</div>
      </button>
    </div>
  </div>
);

export default CallHome;