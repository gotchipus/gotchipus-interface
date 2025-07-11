import React from 'react';

export const TestSummonComponent: React.FC = () => {
  console.log('TestSummonComponent rendered successfully!');
  
  return (
    <div className="bg-red-500 text-white p-4 border-2 border-black">
      <h1>TEST SUMMON COMPONENT</h1>
      <p>If you see this, the component is rendering correctly!</p>
    </div>
  );
};