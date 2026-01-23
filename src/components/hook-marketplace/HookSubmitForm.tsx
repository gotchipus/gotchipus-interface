'use client'

import { useState } from 'react';
import { HookCategory } from '@src/types/hook';
import { hookApi } from '@src/services/hookApi';
import { CreateHookRequest } from '@src/types/hook-api';
import { useAccount } from 'wagmi';
import { Win98Select } from '@src/components/ui/Win98Select';
import CloseIcon from '@assets/icons/CloseIcon';
import RightIcon from '@assets/icons/rightIcon';

interface HookSubmitFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const HookSubmitForm = ({ onClose, onSuccess }: HookSubmitFormProps) => {
  const { address: walletAddress } = useAccount();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as HookCategory | '',
    description: '',
    tags: '',
    address: '',
    sourceCode: '',
    abi: '',
    features: '',
    usageExample: '',
    documentationUrl: '',
    githubUrl: ''
  });

  const categories: { value: HookCategory; label: string }[] = [
    { value: 'reward', label: 'Reward' },
    { value: 'social', label: 'Social' },
    { value: 'defi', label: 'Defi' },
    { value: 'rwa', label: 'RWA' },
    { value: 'automation', label: 'Automation' },
    { value: 'security', label: 'Security' }
  ];

  const handleSubmit = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet to submit a hook');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const createRequest: CreateHookRequest = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        icon: '',
        address: formData.address.toLowerCase(),
        chain_id: 688689,
        source_code: formData.sourceCode,
        abi: formData.abi || '[]',
        explorer_url: `https://atlantic.pharosscan.xyz/address/${formData.address}`,
        creator: walletAddress.toLowerCase(),
        creator_name: '',
        is_audited: false,
        audit_report_url: '',
        is_verified: false,
        usage_count: 0,
        rating: 0,
        review_count: 0,
        features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
        usage_example: formData.usageExample,
        documentation_url: formData.documentationUrl,
        github_url: formData.githubUrl,
        hook_points: [],
        version: '1.0.0'
      };

      await hookApi.createHook(createRequest);

      if (onSuccess) {
        await onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to submit hook:', err);
      setError(err.message || 'Failed to submit hook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
      <div className="bg-[#c0c0c0] border-4 border-[#dfdfdf] border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-[#000080] text-white font-bold flex items-center justify-between px-2 py-1">
          <span>Submit Hook</span>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer flex items-center justify-center hover:bg-[#d4d0c8] text-black font-bold"
          >
            <CloseIcon width={14} height={14} color="#000000" />
          </button>
        </div>

        <div className="p-4 border-b-2 border-[#808080]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs text-[#808080]">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Contract Details'}
              {step === 3 && 'Additional Info'}
              {step === 4 && 'Preview & Submit'}
            </span>
          </div>
          <div className="h-4 border-2 border-[#808080] shadow-win98-inner bg-white">
            <div
              className="h-full bg-[#000080] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="border-2 border-[#ff0000] bg-[#ffe0e0] p-3 mb-4">
              <p className="text-sm text-[#ff0000] font-bold">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="win98-group-box">
                <div className="win98-group-title text-xs font-bold">Basic Information</div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Hook Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-sm"
                      placeholder="My Awesome Hook"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <Win98Select
                      value={formData.category}
                      onChange={(value) => setFormData({ ...formData, category: value as HookCategory })}
                      options={categories}
                      placeholder="Select a category"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Description <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-sm h-24 resize-none"
                      placeholder="Describe what your hook does and its main features..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-sm"
                      placeholder="referral, commission, rewards (comma separated)"
                    />
                    <p className="text-xs text-[#808080] mt-1">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="win98-group-box">
                <div className="win98-group-title text-xs font-bold">Deployed Contract Details</div>

                <div className="border-2 border-[#000080] bg-[#e0e0ff] px-3 py-2 mb-3">
                  <p className="text-xs font-bold text-[#000080]">
                    Submit your deployed hook contract
                  </p>
                  <p className="text-xs text-[#000080] mt-1">
                    Your hook must be deployed on Pharos before submission
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Contract Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-sm font-mono"
                      placeholder="0x..."
                    />
                    <p className="text-xs text-[#808080] mt-1">
                      The deployed contract address on Pharos
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Source Code <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={formData.sourceCode}
                      onChange={(e) => setFormData({ ...formData, sourceCode: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs font-mono h-64 resize-none"
                    />
                    <p className="text-xs text-[#808080] mt-1">
                      Paste your Solidity source code here
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Contract ABI (optional)
                    </label>
                    <textarea
                      value={formData.abi}
                      onChange={(e) => setFormData({ ...formData, abi: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs font-mono h-40 resize-none"
                    />
                    <p className="text-xs text-[#808080] mt-1">
                      Contract ABI in JSON format (optional, defaults to empty array)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="win98-group-box">
                <div className="win98-group-title text-xs font-bold">Additional Information</div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">Features</label>
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-sm h-20 resize-none"
                      placeholder="List key features (one per line)"
                    />
                    <p className="text-xs text-[#808080] mt-1">
                      One feature per line
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">Usage Example</label>
                    <textarea
                      value={formData.usageExample}
                      onChange={(e) => setFormData({ ...formData, usageExample: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs font-mono h-32 resize-none"
                      placeholder="// Example code showing how to use your hook"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">Documentation URL</label>
                    <input
                      type="url"
                      value={formData.documentationUrl}
                      onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-sm"
                      placeholder="https://docs.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-sm"
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="win98-group-box">
                <div className="win98-group-title text-xs font-bold">Preview</div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-bold">Name:</span> {formData.name || '(not set)'}
                  </div>
                  <div>
                    <span className="font-bold">Category:</span>{' '}
                    {formData.category ? categories.find(c => c.value === formData.category)?.label : '(not set)'}
                  </div>
                  <div>
                    <span className="font-bold">Description:</span> {formData.description || '(not set)'}
                  </div>
                  <div>
                    <span className="font-bold">Tags:</span> {formData.tags || '(none)'}
                  </div>
                  <div>
                    <span className="font-bold">Contract:</span>{' '}
                    <code className="text-xs">{formData.address || '(not set)'}</code>
                  </div>
                  <div>
                    <span className="font-bold">Network:</span> Pharos
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t-2 border-[#808080] p-4 flex items-center justify-between bg-[#d4d0c8]">
          <button
            onClick={onClose}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-4 py-2 text-sm font-bold"
          >
            Cancel
          </button>

          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-4 py-2 text-sm font-bold flex items-center gap-2"
              >
                <RightIcon width={14} height={14} color="#000000" style={{ transform: 'scaleX(-1)' }} />
                <span>Previous</span>
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#000080] text-white hover:bg-[#000060] active:shadow-win98-inner px-4 py-2 text-sm font-bold flex items-center gap-2"
              >
                <span>Next</span>
                <RightIcon width={14} height={14} color="white" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white hover:bg-[#006000] active:shadow-win98-inner px-4 py-2 text-sm font-bold disabled:bg-[#808080] disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Hook'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
