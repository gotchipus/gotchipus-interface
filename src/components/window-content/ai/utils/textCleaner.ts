
export function cleanAIText(text: string): string {
  if (!text) return '';

  let cleaned = text
    .replace(/\*\*\s*\*\s*([^*]+?):\s*\*\*/g, '**$1:**')
    .replace(/\*\*\s*\*\s*([^*]+?):\s*\*\*\s*/g, '**$1:**\n')
    .replace(/\*\*\*([^*]+?):\*\*/g, '**$1:**')
    .replace(/\*\*([^*]+?)\s*:\s*\*\*/g, '**$1:**')
    .replace(/\*\*\s*\*\s*([^*]+?):\s*\*\*\s*\*/g, '**$1:**')
    .replace(/([.,;:!?])([A-Z])/g, '$1 $2')
    .replace(/\)([A-Za-z])/g, ') $1')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/d\s+Apps/g, 'dApps')
    .replace(/De\s+Fi/g, 'DeFi')
    .replace(/\*\*Key Features:\s*\*\*\s*\*/g, '**Key Features:**')
    .replace(/\*\*Modular Stack:\s*\*\*\s*\*/g, '**Modular Stack:**')
    .replace(/\*\*Ethereum Compatibility:\s*\*\*\s*\*/g, '**Ethereum Compatibility:**')
    .replace(/\*\*Data Layer:\s*\*\*\s*\*/g, '**Data Layer:**')
    .replace(/\*\*Consensus Layer:\s*\*\*\s*\*/g, '**Consensus Layer:**')
    .replace(/\*\*Transaction Layer:\s*\*\*\s*\*/g, '**Transaction Layer:**')
    .replace(/\*\*Use Cases:\s*\*\*\s*\*/g, '**Use Cases:**')
    .replace(/\*\*Benefits:\s*\*\*\s*\*/g, '**Benefits:**')
    .replace(/\*\*Overview:\s*\*\*\s*\*/g, '**Overview:**')
    .replace(/\*\*Features:\s*\*\*\s*\*/g, '**Features:**')
    .replace(/\*\*\s*\*([^*]+?)\*\*\s*\*/g, '**$1:**')
    .replace(/\*\*\s*\*([^*]+?)\*\*\s*/g, '**$1:**')
    .replace(/\*\*\s*\*([^*]+?)\*\*$/g, '**$1:**')
    .replace(/\*\*\*([^*]+):\s*\*\*\*/g, '**$1:**')
    .replace(/\*\*([^*]+):\s*\*\*/g, '**$1:**')
    .replace(/\*\*\*([^*]+):\s*\*\*/g, '**$1:**')
    .replace(/\*\s+\*/g, '**')
    .replace(/\*\*\s+\*\*/g, '**')
    .replace(/\*\*\*\s+\*\*\*/g, '***')
    .replace(/^\s*\*\s+\*\s+\*\s+([^*\n]+)/gm, '* $1')
    .replace(/^\s*\*\s+\*\s+([^*\n]+)/gm, '* $1')
    .replace(/\n\s*\*\s+\*\s+\*\s+([^*\n]+)/g, '\n* $1')
    .replace(/\n\s*\*\s+\*\s+([^*\n]+)/g, '\n* $1')
    .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*/g, '**$1.**')
    .replace(/\*\*([^*]+)\*\*\.\*\*/g, '**$1.**')
    .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*([^*]+)\*\*\*/g, '**$1.** **$2:**')
    .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*([^*]+)\*\*\*\.\*\*\*/g, '**$1.** **$2.**')
    .replace(/([^*\n]+)\*\*\*\.\*\*\*([^*\n]+)/g, '$1. $2')
    .replace(/([^*\n]+)\*\*\.\*\*([^*\n]+)/g, '$1. $2')
    .replace(/```\s*\*\s*/g, '```')
    .replace(/\s*\*\s*```/g, '```')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/\n\s*\*\s*\n/g, '\n\n');

  return cleaned.trim();
}

export function testTextCleaning() {
  const testCases = [
    {
      name: 'Specific malformed bold pattern',
      input: '** *Modular Stack: **',
      expected: '**Modular Stack:**'
    },
    {
      name: 'Ethereum Compatibility pattern',
      input: '** *Ethereum Compatibility: **',
      expected: '**Ethereum Compatibility:**'
    },
    {
      name: 'Data Layer pattern',
      input: '** *Data Layer: **',
      expected: '**Data Layer:**'
    },
    {
      name: 'Section headers with extra asterisks',
      input: '***Modular Stack: ***',
      expected: '**Modular Stack:**'
    },
    {
      name: 'Key Features section with trailing asterisks',
      input: '**Key Features: ***',
      expected: '**Key Features:**'
    },
    {
      name: 'List items with multiple asterisks',
      input: '*   * item',
      expected: '* item'
    },
    {
      name: 'Complex pattern with multiple sections',
      input: '***Data Layer: *** It utilizes a Decentralized Data Exchange Protocol.***Consensus Layer: ***',
      expected: '**Data Layer:** It utilizes a Decentralized Data Exchange Protocol.**Consensus Layer:**'
    },
    {
      name: 'Broken bold formatting with spaces',
      input: '** text **',
      expected: '**text**'
    },
    {
      name: 'Mixed bold pattern with extra asterisks',
      input: '** *bold text* **',
      expected: '**bold text**'
    },
    {
      name: 'Trailing asterisks on sentence',
      input: 'This is a sentence*',
      expected: 'This is a sentence'
    },
    {
      name: 'Code block with asterisks',
      input: '```* code *```',
      expected: '```code```'
    },
    {
      name: 'Orphaned asterisks on separate lines',
      input: 'Text\n*\nMore text',
      expected: 'Text\n\nMore text'
    }
  ];

  console.log('=== Text Cleaning Test Results ===');
  
  testCases.forEach(testCase => {
    const result = cleanAIText(testCase.input);
    const passed = result === testCase.expected;
    
    console.log(`\n${testCase.name}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Input:    "${testCase.input}"`);
    console.log(`Expected: "${testCase.expected}"`);
    console.log(`Result:   "${result}"`);
  });
}

if (typeof window !== 'undefined') {
  (window as any).testTextCleaning = testTextCleaning;
  (window as any).cleanAIText = cleanAIText;
} 