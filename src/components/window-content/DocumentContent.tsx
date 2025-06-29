export default function DocumentContent() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Documentation</h2>
      <p className="mb-3">This would typically link to an external webpage with documentation.</p>
      <div className="border border-[#808080] shadow-win98-inner p-2 bg-[#f0f0f0]">
        <p className="font-mono text-sm">https://docs.gotchipus.com</p>
      </div>
      <button className="mt-4 px-4 py-1 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff]">
        Visit Documentation
      </button>
    </div>
  )
}

