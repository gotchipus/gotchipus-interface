'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeDNA, calculateRarityScore, getRarityColor, getRarityLabel } from '../../utils/dna';
import { DNATraits } from '../../types/dna';

const DNAAnalyzerContent = () => {
  const [dnaId, setDnaId] = useState('');
  const [traits, setTraits] = useState<DNATraits | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'traits' | 'genetic' | 'breeding'>('traits');
  const [rarityScore, setRarityScore] = useState(0);

  const exampleDnaIds = [
    '100420794452324007740289417880043935369077597111104194087309767408790248852035',
    '100420794452324007740289417880043935369077597111104194087309767408790248852035',
    '100420794452324007740289417880043935369077597111104194087309767408790248852035',
    '100420794452324007740289417880043935369077597111104194087309767408790248852035'
  ];

  const handleAnalyze = () => {
    try {
      setError(null);
      setIsLoading(true);
      
      setTimeout(() => {
        const result = analyzeDNA(dnaId);
        setTraits(result);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid DNA ID');
      setTraits(null);
      setIsLoading(false);
    }
  };

  const renderDNAVisualization = () => {
    if (!traits) return null;

    return (
      <div className="mb-4 overflow-x-auto">
        <div className="flex">
          {traits.sequence.map((segment, index) => (
            <div
              key={index}
              className="flex flex-col items-center mx-1 cursor-pointer group relative"
              title={`${segment.name}: ${segment.description}`}
            >
              <div
                className="h-8 min-w-6 px-1 flex items-center justify-center text-xs font-mono border border-[#808080]"
                style={{ backgroundColor: segment.color, color: '#fff' }}
              >
                {segment.value}
              </div>
              <div className="text-[10px] mt-1 text-center">{segment.name}</div>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-[#ffffcc] border border-[#808080] p-2 text-xs hidden group-hover:block z-10">
                <p className="font-bold">{segment.name}</p>
                <p>{segment.description}</p>
                <p className="mt-1">Value: {segment.value}</p>
                <p>Position: {segment.start}-{segment.end}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCreaturePreview = () => {
    if (!traits) return null;

    return (
      <div className="border-2 border-[#808080] shadow-win98-outer bg-[#000000] p-4 mb-4 flex items-center justify-center">
        <div className="w-32 h-32 relative">
          {/* Body */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`w-20 h-20 rounded-full bg-${traits.bodyColor.name.toLowerCase()}`}></div>
          </div>
          
          {/* Eyes */}
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: Number(traits.eyeCount.name) }).map((_, i) => {
              const angle = (i / Number(traits.eyeCount.name)) * Math.PI * 2;
              const radius = 8;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white rounded-full flex items-center justify-center"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    boxShadow: '0 0 2px #000'
                  }}
                >
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
              );
            })}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: Number(traits.tentacleCount.name) }).map((_, i) => {
              const angle = (i / Number(traits.tentacleCount.name)) * Math.PI * 2;
              const length = 16;
              const x = Math.cos(angle) * length;
              const y = Math.sin(angle) * length;
              
              return (
                <div
                  key={i}
                  className={`absolute w-2 h-${length} bg-${traits.bodyColor.name.toLowerCase()}`}
                  style={{
                    transform: `translate(${x/2}px, ${y/2}px) rotate(${angle + Math.PI/2}rad)`,
                    transformOrigin: 'center'
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderTraitCard = ({ title, trait }: { title: string; trait: any }) => {
    const rarityColor = getRarityColor(trait.rarity);
    
    return (
      <div className="border-2 border-[#808080] shadow-win98-outer bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm">
        <div className="p-2 border-b-2 border-[#808080] flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#000080]">{title}</h3>
          {trait.dominance && (
            <div className="text-xs px-1 bg-[#d4d0c8] border border-[#808080]">
              DOM: {trait.dominance}%
            </div>
          )}
        </div>
        <div className="p-2">
          <div className="space-y-1">
            <p className="font-medium text-sm">{trait.name}</p>
            <p className="text-xs text-gray-600">{trait.description}</p>
            <div className="flex justify-between items-center mt-1">
              <span 
                className="text-xs px-2 py-1 rounded-sm border border-[#808080] bg-[#c0c0c0]"
                style={{ color: rarityColor, fontWeight: 'bold' }}
              >
                {getRarityLabel(trait.rarity)}
              </span>
              
              {trait.genePosition && (
                <span className="text-xs text-gray-500">
                  Gene: {trait.genePosition[0]}-{trait.genePosition[1]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-[#c0c0c0] h-full overflow-auto">
      <div className="mb-4 border-2 border-[#808080] shadow-win98-outer bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm">
        <div className="p-3 border-b-2 border-[#808080]">
          <h2 className="text-lg font-bold text-[#000080]">DNA Analyzer</h2>
          <p className="text-sm text-gray-600">Enter a DNA ID to analyze genetic traits</p>
        </div>
        <div className="p-3">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter DNA ID (hex format)"
              value={dnaId}
              onChange={(e) => setDnaId(e.target.value)}
              className="flex-1 p-2 border-2 border-[#808080] shadow-win98-inner bg-white"
            />
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-4 py-2 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a] disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          
          <div className="text-xs">
            Example IDs:
            {exampleDnaIds.map((id, index) => (
              <button
                key={index}
                onClick={() => setDnaId(id)}
                className="ml-2 px-1 bg-[#d4d0c8] border border-[#808080] hover:bg-[#e0e0e0]"
              >
                {id.substring(0, 8)}...
              </button>
            ))}
          </div>
          
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
      </div>

      {traits && (
        <>
          <div className="mb-4 border-2 border-[#808080] shadow-win98-outer bg-[#f5f5f5] p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#000080]">DNA ID: {traits.id}</h3>
              <div className="flex items-center">
                <span className="text-sm mr-2">Rarity Score:</span>
                <span 
                  className="px-2 py-1 bg-[#c0c0c0] border border-[#808080] text-sm font-bold"
                  style={{ color: rarityScore > 20 ? '#FFD700' : rarityScore > 10 ? '#800080' : '#0000FF' }}
                >
                  {calculateRarityScore(traits).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex mb-4">
            <div className="w-1/3">
              {renderCreaturePreview()}
            </div>
            <div className="w-2/3 pl-4">
              {renderDNAVisualization()}
              
              <div className="border-2 border-[#808080] shadow-win98-outer bg-[#f5f5f5] p-3">
                <div className="flex flex-wrap">
                  <div className="mr-4 mb-2">
                    <span className="text-xs">Body: </span>
                    <span className="text-sm font-bold">
                      {traits.bodyShape.name} {traits.bodyColor.name}
                    </span>
                  </div>
                  <div className="mr-4 mb-2">
                    <span className="text-xs">Tentacles: </span>
                    <span className="text-sm font-bold">{traits.tentacleCount.name}</span>
                  </div>
                  <div className="mr-4 mb-2">
                    <span className="text-xs">Eyes: </span>
                    <span className="text-sm font-bold">{traits.eyeCount.name}</span>
                  </div>
                  <div className="mr-4 mb-2">
                    <span className="text-xs">Personality: </span>
                    <span className="text-sm font-bold">{traits.personality.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8]">
              <TabsTrigger value="traits">Traits</TabsTrigger>
              <TabsTrigger value="genetic">Genetic</TabsTrigger>
              <TabsTrigger value="breeding">Breeding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="traits" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {renderTraitCard({ title: 'Body Shape', trait: traits.bodyShape })}
                {renderTraitCard({ title: 'Body Color', trait: traits.bodyColor })}
                {renderTraitCard({ title: 'Tentacle Count', trait: traits.tentacleCount })}
                
                {traits.tentacleShapes.map((shape, index) => (
                  <div key={index}>
                    {renderTraitCard({
                      title: `Tentacle ${index + 1} Shape`,
                      trait: shape
                    })}
                  </div>
                ))}

                {renderTraitCard({ title: 'Eye Count', trait: traits.eyeCount })}
                
                {traits.eyeShapes.map((shape, index) => (
                  <div key={index}>
                    {renderTraitCard({
                      title: `Eye ${index + 1} Shape`,
                      trait: shape
                    })}
                  </div>
                ))}

                {renderTraitCard({ title: 'Personality', trait: traits.personality })}
              </div>
            </TabsContent>
            
            <TabsContent value="genetic" className="mt-4">
              <div className="border-2 border-[#808080] shadow-win98-outer bg-[#f5f5f5] p-3">
                <h3 className="text-sm font-bold mb-2">DNA Sequence</h3>
                <div className="font-mono text-xs bg-black text-green-500 p-2 overflow-x-auto">
                  {traits.rawSequence.match(/.{1,4}/g)?.join(' ')}
                </div>
              </div>
              
              <div className="border-2 border-[#808080] shadow-win98-outer bg-[#f5f5f5] p-3 mt-4">
                <h3 className="text-sm font-bold mb-2">Gene Segments</h3>
                <div className="space-y-2">
                  {traits.sequence.map((segment, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className="w-4 h-4 mr-2" style={{ backgroundColor: segment.color }}></div>
                      <div className="w-24">{segment.name}:</div>
                      <div className="font-mono">{segment.value}</div>
                      <div className="ml-2 text-gray-500">
                        (Pos: {segment.start}-{segment.end})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="breeding" className="mt-4">
              <div className="border-2 border-[#808080] shadow-win98-outer bg-[#f5f5f5] p-3">
                <h3 className="text-sm font-bold mb-2">Breeding Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs mb-1">Generation:</p>
                    <div className="border border-[#808080] bg-[#d4d0c8] p-1 text-sm">
                      {traits.generation}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-1">Cooldown Index:</p>
                    <div className="border border-[#808080] bg-[#d4d0c8] p-1 text-sm">
                      {traits.cooldownIndex}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-2 border-[#808080] shadow-win98-outer bg-[#f5f5f5] p-3 mt-4">
                <h3 className="text-sm font-bold mb-2">Breeding Potential</h3>
                <div className="flex items-center mb-2">
                  <div className="w-full bg-[#d4d0c8] border border-[#808080] h-4 mr-2">
                    <div 
                      className={`h-full ${
                        traits.breedingPotential > 70 ? 'bg-green-600' :
                        traits.breedingPotential > 40 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${traits.breedingPotential}%` }}
                    ></div>
                  </div>
                  <div className="text-xs w-8">{traits.breedingPotential}%</div>
                </div>
                <p className="text-xs text-gray-600">
                  {traits.breedingPotential > 70
                    ? 'Excellent breeding potential! This specimen will likely produce high-quality offspring.'
                    : traits.breedingPotential > 40
                      ? 'Average breeding potential. Offspring may inherit some desirable traits.'
                      : 'Poor breeding potential. Not recommended for breeding programs.'}
                </p>
              </div>
              
              <div className="border-2 border-[#808080] shadow-win98-outer bg-[#f5f5f5] p-3 mt-4">
                <h3 className="text-sm font-bold mb-2">Cooldown Time</h3>
                <div className="text-sm">
                  {[
                    '1 minute',
                    '2 minutes',
                    '5 minutes',
                    '10 minutes',
                    '30 minutes',
                    '1 hour',
                    '2 hours',
                    '4 hours',
                    '8 hours',
                    '16 hours',
                    '24 hours',
                    '2 days',
                    '4 days',
                    '1 week'
                  ][traits.cooldownIndex] || 'Unknown'}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Time required between breeding attempts
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default DNAAnalyzerContent;