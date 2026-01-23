'use client'

import { Hook } from '@src/types/hook';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LikeIcon from '@assets/icons/LikeIcon';
import CopyIcon from '@assets/icons/CopyIcon';
import LinkIcon from '@assets/icons/LinkIcon';
import RightIcon from '@assets/icons/rightIcon';

interface HookDetailProps {
  hook: Hook;
  onBack: () => void;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'reward': 'bg-[#c00000] text-white',
    'social': 'bg-[#008080] text-white',
    'defi': 'bg-[#c08000] text-white',
    'rwa': 'bg-[#800080] text-white',
    'automation': 'bg-[#008000] text-white',
    'security': 'bg-[#000080] text-white'
  };
  return colors[category] || 'bg-[#808080] text-white';
};

const getTagColor = (tag: string) => {
  const tagLower = tag.toLowerCase();

  if (tagLower.includes('defi') || tagLower.includes('swap') || tagLower.includes('liquidity') || tagLower.includes('yield')) {
    return 'bg-[#c08000] text-white border-[#a06000]';
  }
  if (tagLower.includes('nft') || tagLower.includes('game') || tagLower.includes('collectible')) {
    return 'bg-[#800080] text-white border-[#600060]';
  }
  if (tagLower.includes('security') || tagLower.includes('audit') || tagLower.includes('safe')) {
    return 'bg-[#000080] text-white border-[#000060]';
  }
  if (tagLower.includes('auto') || tagLower.includes('bot') || tagLower.includes('schedule')) {
    return 'bg-[#008000] text-white border-[#006000]';
  }
  if (tagLower.includes('social') || tagLower.includes('community') || tagLower.includes('chat')) {
    return 'bg-[#008080] text-white border-[#006060]';
  }
  if (tagLower.includes('reward') || tagLower.includes('incentive') || tagLower.includes('earn')) {
    return 'bg-[#c00000] text-white border-[#a00000]';
  }
  return 'bg-[#808080] text-white border-[#606060]';
};

export const HookDetail = ({ hook, onBack }: HookDetailProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'usage' | 'reviews'>('overview');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const reviews: any[] = [];

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#c0c0c0]">
      <div className="border-b-2 border-[#808080] px-6 py-4">
        <div className="mb-3">
          <button
            onClick={onBack}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-4 py-2 text-sm font-bold flex items-center gap-2"
          >
            <RightIcon width={16} height={16} color="#000080" style={{ transform: 'scaleX(-1)' }} />
            <span>Back</span>
          </button>
        </div>
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-black">{hook.name}</h2>
            <span className={`px-3 py-1 text-xs font-bold uppercase border border-black/20 ${getCategoryColor(hook.category)}`}>
              {hook.category}
            </span>
          </div>
          <div
            className="relative inline-block"
            onMouseEnter={() => setHoveredButton('favorite')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <button className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-4 py-2 text-sm font-bold flex items-center gap-2 flex-shrink-0">
              <LikeIcon width={16} height={16} color="#c00000" />
              <span>{hook.reviewCount}</span>
            </button>
            <AnimatePresence>
              {hoveredButton === 'favorite' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-30 bottom-full mb-2 right-0 bg-[#FFFFCC] border-2 border-[#000000] px-3 py-1.5 rounded whitespace-nowrap text-xs shadow-win98-outer"
                >
                  Add to Favorites
                  <div className="absolute right-3 bottom-0 translate-y-full">
                    <div className="border-4 border-transparent border-t-[#000000]"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="border-b-2 border-[#808080] bg-[#c0c0c0] px-6 py-3 flex gap-3">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'code', label: 'Code' },
          { key: 'usage', label: 'Usage' },
          { key: 'reviews', label: 'Reviews' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-6 py-2 text-sm font-bold border-2 border-[#808080] rounded-sm ${
              activeTab === tab.key
                ? 'bg-[#d4d0c8] shadow-win98-inner'
                : 'bg-[#c0c0c0] shadow-win98-outer hover:bg-[#d4d4d4] active:shadow-win98-inner'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div className="win98-group-box">
              <div className="win98-group-title text-xs font-bold">Description</div>
              <p className="text-sm text-black leading-relaxed">{hook.description}</p>
            </div>

            <div className="win98-group-box">
              <div className="win98-group-title text-xs font-bold">Deployed Contract</div>
              <div className="border-2 border-[#008000] bg-[#e0ffe0] px-4 py-3 mb-4">
                <p className="text-xs font-bold text-[#008000]">
                  Deployed hook ready to attach to your Gotchipus
                </p>
                <p className="text-xs text-[#008000] mt-1">
                  Runs inside your ERC-6551 tokenbound account via Diamond Proxy
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold min-w-[100px]">Address:</span>
                  <code className="text-xs bg-white border border-[#808080] px-3 py-2 font-mono">
                    {hook.address}
                  </code>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative"
                      onMouseEnter={() => setHoveredButton('copy-address')}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      <button
                        onClick={() => copyToClipboard(hook.address, 'address')}
                        className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-2 py-1.5 text-sm flex items-center justify-center"
                      >
                        <CopyIcon width={14} height={14} color="#000080" />
                      </button>
                      <AnimatePresence>
                        {(hoveredButton === 'copy-address' || copySuccess === 'address') && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-30 top-full mt-2 left-0 bg-[#FFFFCC] border-2 border-[#000000] px-3 py-1.5 rounded whitespace-nowrap text-xs shadow-win98-outer"
                          >
                            {copySuccess === 'address' ? 'Copied!' : 'Copy Address'}
                            <div className="absolute left-3 top-0 -translate-y-full">
                              <div className="border-4 border-transparent border-b-[#000000]"></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {hook.explorerUrl && (
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredButton('explorer')}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        <Link
                          href={`https://atlantic.pharosscan.xyz/address/${hook.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-2 py-1.5 text-sm flex items-center justify-center"
                        >
                          <LinkIcon width={14} height={14} color="#000080" />
                        </Link>
                        <AnimatePresence>
                          {hoveredButton === 'explorer' && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-30 top-full mt-2 left-0 bg-[#FFFFCC] border-2 border-[#000000] px-3 py-1.5 rounded whitespace-nowrap text-xs shadow-win98-outer"
                            >
                              View on Explorer
                              <div className="absolute left-3 top-0 -translate-y-full">
                                <div className="border-4 border-transparent border-b-[#000000]"></div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold min-w-[100px]">Network:</span>
                  <span className="text-sm">{hook.network}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold min-w-[100px]">Creator:</span>
                  <Link
                    href={`https://atlantic.pharosscan.xyz/address/${hook.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#000080] hover:underline"
                  >
                    {shortenAddress(hook.creator)}
                  </Link>
                  {hook.creatorName && (
                    <span className="text-sm text-[#808080]">({hook.creatorName})</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold min-w-[100px]">Deployed:</span>
                  <span className="text-sm">{hook.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {hook.hookPoints && hook.hookPoints.length > 0 && (
              <div className="win98-group-box">
                <div className="win98-group-title text-xs font-bold">Hook Points</div>
                <p className="text-xs text-[#808080] mb-3">
                  This hook executes on the following triggers:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {hook.hookPoints.map((point, index) => (
                    <code
                      key={index}
                      className="px-3 py-1.5 bg-[#000080] text-white text-xs border border-[#808080] shadow-win98-outer font-mono"
                    >
                      {point}
                    </code>
                  ))}
                </div>
              </div>
            )}

            <div className="win98-group-box">
              <div className="win98-group-title text-xs font-bold">How to Integrate This Hook</div>
              <ol className="space-y-2.5 text-sm list-decimal list-inside">
                <li>Review the hook's source code and features</li>
                <li>Copy the deployed hook address above</li>
                <li>Navigate to your Gotchipus's Dashboard</li>
                <li>Hook will automatically execute on configured events</li>
              </ol>
              <p className="text-xs text-[#808080] mt-4 italic">
                Note: Hooks run inside your GOTCHI ERC-6551 account
              </p>
            </div>

            <div className="win98-group-box">
              <div className="win98-group-title text-xs font-bold">Features</div>
              <ul className="space-y-2">
                {hook.features.map((feature, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-[#008000] mt-0.5">•</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="win98-group-box">
              <div className="win98-group-title text-xs font-bold">Tags</div>
              <div className="flex flex-wrap gap-2.5">
                {hook.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1.5 text-xs font-bold uppercase border-2 shadow-win98-outer ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {(hook.documentationUrl || hook.githubUrl || hook.auditReportUrl) && (
              <div className="win98-group-box">
                <div className="win98-group-title text-xs font-bold">Links</div>
                <div className="flex flex-wrap gap-3">
                  {hook.documentationUrl && (
                    <Link
                      href={hook.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-4 py-2 text-sm font-bold"
                    >
                      Documentation
                    </Link>
                  )}
                  {hook.githubUrl && (
                    <Link
                      href={hook.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-4 py-2 text-sm font-bold"
                    >
                      GitHub
                    </Link>
                  )}
                  {hook.auditReportUrl && (
                    <Link
                      href={hook.auditReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-4 py-2 text-sm font-bold"
                    >
                      Audit Report
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="win98-group-box">
            <div className="win98-group-title text-xs font-bold">Contract Source Code</div>
            <div className="relative">
              <div className="flex border-2 border-[#808080] shadow-win98-inner bg-[#ffffff] overflow-hidden">
                {/* Line Numbers */}
                <div className="bg-[#d4d0c8] border-r-2 border-[#808080] px-3 py-3 select-none pointer-events-none">
                  <pre className="text-xs font-mono text-[#808080] leading-[1.5] m-0">
                    {hook.sourceCode.split('\n').map((_, i) => (
                      <div key={i} className="text-right h-[18px]">
                        {i + 1}
                      </div>
                    ))}
                  </pre>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    readOnly
                    value={hook.sourceCode}
                    className="w-full h-[500px] px-3 py-3 text-xs font-mono font-medium leading-[1.5] bg-[#ffffff] text-black border-none outline-none resize-none overflow-auto scrollbar-none"
                    spellCheck={false}
                    style={{
                      lineHeight: '18px',
                      fontFamily: "'Courier New', Courier, monospace",
                      color: '#000000',
                      WebkitTextFillColor: '#000000'
                    }}
                  />
                </div>
              </div>
              <div
                className="absolute top-3 right-3 z-10"
                onMouseEnter={() => setHoveredButton('copy-code')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <button
                  onClick={() => copyToClipboard(hook.sourceCode, 'code')}
                  className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-3 py-2 text-sm"
                >
                  <CopyIcon width={14} height={14} color="#000080" />
                </button>
                <AnimatePresence>
                  {(hoveredButton === 'copy-code' || copySuccess === 'code') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-30 top-full mt-2 right-0 bg-[#FFFFCC] border-2 border-[#000000] px-3 py-1.5 rounded whitespace-nowrap text-xs shadow-win98-outer"
                    >
                      {copySuccess === 'code' ? 'Copied!' : 'Copy Code'}
                      <div className="absolute right-3 top-0 -translate-y-full">
                        <div className="border-4 border-transparent border-b-[#000000]"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="win98-group-box">
            <div className="win98-group-title text-xs font-bold">Usage Example</div>
            {hook.usageExample ? (
              <div className="relative">
                <div className="flex border-2 border-[#808080] shadow-win98-inner bg-[#ffffff] overflow-hidden">
                  {/* Line Numbers */}
                  <div className="bg-[#d4d0c8] border-r-2 border-[#808080] px-3 py-3 select-none pointer-events-none">
                    <pre className="text-xs font-mono text-[#808080] leading-[1.5] m-0">
                      {hook.usageExample.split('\n').map((_, i) => (
                        <div key={i} className="text-right h-[18px]">
                          {i + 1}
                        </div>
                      ))}
                    </pre>
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      readOnly
                      value={hook.usageExample}
                      className="w-full h-[500px] px-3 py-3 text-xs font-mono font-medium leading-[1.5] bg-[#ffffff] text-black border-none outline-none resize-none overflow-auto scrollbar-none"
                      spellCheck={false}
                      style={{
                        lineHeight: '18px',
                        fontFamily: "'Courier New', Courier, monospace",
                        color: '#000000',
                        WebkitTextFillColor: '#000000'
                      }}
                    />
                  </div>
                </div>
                <div
                  className="absolute top-3 right-3 z-10"
                  onMouseEnter={() => setHoveredButton('copy-usage')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <button
                    onClick={() => copyToClipboard(hook.usageExample!, 'usage')}
                    className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d4d4] active:shadow-win98-inner px-3 py-2 text-sm"
                  >
                    <CopyIcon width={14} height={14} color="#000080" />
                  </button>
                  <AnimatePresence>
                    {(hoveredButton === 'copy-usage' || copySuccess === 'usage') && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-30 top-full mt-2 right-0 bg-[#FFFFCC] border-2 border-[#000000] px-3 py-1.5 rounded whitespace-nowrap text-xs shadow-win98-outer"
                      >
                        {copySuccess === 'usage' ? 'Copied!' : 'Copy Code'}
                        <div className="absolute right-3 top-0 -translate-y-full">
                          <div className="border-4 border-transparent border-b-[#000000]"></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#808080] italic">No usage example provided</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="win98-group-box">
              <div className="win98-group-title text-xs font-bold">
                Reviews ({reviews.length})
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-2 border-[#808080] shadow-win98-inner bg-white p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">
                            {review.authorName || shortenAddress(review.author)}
                          </span>
                          <span className="text-xs text-[#808080]">Rating: {review.rating}/5</span>
                        </div>
                        <span className="text-xs text-[#808080]">
                          {review.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#808080] italic">No reviews yet</p>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
