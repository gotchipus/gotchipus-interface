"use client"

import { useState } from 'react'
import { Plus, List, PlusCircle } from 'lucide-react'

export interface Hook {
  id: string
  address: string
  description: string
  supportsAfterHarvest: boolean
}

const initialHooks: Hook[] = [
  {
    id: '1',
    address: '0x1234...abcd',
    description: 'Reward Hook for extra fish',
    supportsAfterHarvest: true,
  },
  {
    id: '2',
    address: '0x5678...efgh',
    description: 'Fee Adjustment Hook',
    supportsAfterHarvest: false,
  },
]

const HookContent = () => {
  const [hooks, setHooks] = useState<Hook[]>(initialHooks)
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null)
  const [newHook, setNewHook] = useState({ address: '', description: '' })
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'select' | 'add'>('select')

  const addHook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHook.address || !/0x[a-fA-F0-9]{40}/.test(newHook.address)) {
      setError('Invalid address')
      return
    }
    const hook: Hook = {
      id: Date.now().toString(),
      address: newHook.address,
      description: newHook.description || 'No description',
      supportsAfterHarvest: true,
    }
    setHooks([...hooks, hook])
    setNewHook({ address: '', description: '' })
    setError('')
    setActiveTab('select')
  }

  const selectHook = (hook: Hook) => {
    if (selectedHook?.id === hook.id) {
      setSelectedHook(null)
    } else {
      setSelectedHook(hook)
    }
  }

  return (
    <div className="p-4 bg-[#c0c0c0] h-full">
      <div className="h-full flex flex-col">
        {/* Tabs */}
        <div className="flex border-b-2 border-[#808080] mb-4">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
              activeTab === 'select'
                ? 'bg-[#d4d0c8] border-r-2 border-[#808080]'
                : 'bg-[#c0c0c0] hover:bg-[#d4d0c8]'
            }`}
          >
            <List size={16} />
            <span className="pixel-text">View Hooks</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
              activeTab === 'add'
                ? 'bg-[#d4d0c8] border-l-2 border-[#808080]'
                : 'bg-[#c0c0c0] hover:bg-[#d4d0c8]'
            }`}
          >
            <PlusCircle size={16} />
            <span className="pixel-text">Add Hook</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'select' ? (
            <div className="h-full flex gap-4">
              {/* Hook List */}
              <div className="flex-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm p-3 overflow-hidden flex flex-col">
                <h3 className="font-bold mb-3 text-center pixel-text">Your Hooks</h3>
                <div className="flex-1 overflow-auto">
                  {hooks.length === 0 ? (
                    <p className="text-gray-500 pixel-text text-center">No hooks registered</p>
                  ) : (
                    <div className="space-y-2">
                      {hooks.map((hook) => (
                        <div
                          key={hook.id}
                          className={`border-2 ${selectedHook?.id === hook.id ? "border-[#000080] bg-[#d0d0ff]" : "border-[#808080] bg-[#c0c0c0]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-sm p-3 cursor-pointer hover:bg-[#d4d0c8]`}
                          onClick={() => selectHook(hook)}
                        >
                          <p className="font-mono pixel-text text-sm">{hook.address}</p>
                          <p className="pixel-text text-sm mt-1">{hook.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hook Details */}
              <div className="w-1/3 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm p-3">
                <h3 className="font-bold mb-3 text-center pixel-text">Hook Details</h3>
                {selectedHook ? (
                  <div className="space-y-3">
                    <div>
                      <p className="pixel-text text-sm font-bold">Address:</p>
                      <p className="font-mono pixel-text text-sm break-all">{selectedHook.address}</p>
                    </div>
                    <div>
                      <p className="pixel-text text-sm font-bold">Description:</p>
                      <p className="pixel-text text-sm">{selectedHook.description}</p>
                    </div>
                    <div>
                      <p className="pixel-text text-sm font-bold">Supports afterHarvest:</p>
                      <p className="pixel-text text-sm">{selectedHook.supportsAfterHarvest ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 pixel-text text-center">Select a hook to view details</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={addHook} className="h-full flex flex-col">
              <div className="flex-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm p-3">
                <h3 className="font-bold mb-3 text-center pixel-text">Add New Hook</h3>
                <div className="space-y-4">
                  <div>
                    <label className="pixel-text text-sm font-bold block mb-1">Hook Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={newHook.address}
                      onChange={(e) => setNewHook({ ...newHook, address: e.target.value })}
                      className="w-full p-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-white rounded-sm pixel-text"
                    />
                  </div>
                  <div>
                    <label className="pixel-text text-sm font-bold block mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Enter hook description"
                      value={newHook.description}
                      onChange={(e) => setNewHook({ ...newHook, description: e.target.value })}
                      className="w-full p-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-white rounded-sm pixel-text"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm pixel-text">{error}</p>}
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm py-1 hover:bg-[#c0c0c0] flex items-center justify-center"
                >
                  <Plus size={14} className="mr-1" />
                  <span className="pixel-text">Add Hook</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default HookContent 