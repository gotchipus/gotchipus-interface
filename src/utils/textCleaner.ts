
export function cleanAIText(text: string): string {
  if (!text) return '';
  
  return text
    // Fix asterisk formatting patterns (consolidated)
    .replace(/\*\s+\*/g, '**')
    .replace(/\*\s+\*\s+\*/g, '***')
    .replace(/\*\*\*\s+\*\*\*/g, '***')
    .replace(/\*\*\s+\*\*/g, '**')
    
    // Fix list formatting
    .replace(/\n\s*\*\s+\*/g, '\n* ')
    .replace(/\n\s*\*\s+\*\s+\*/g, '\n* ')
    .replace(/\n\s*\*\s+\*\s+\*\s+\*/g, '\n* ')
    
    // Fix section headers with colons
    .replace(/\*\*\*([^*]+):\s*\*\*\*/g, '**$1:**')
    .replace(/\*\*([^*]+):\s*\*\*/g, '**$1:**')
    .replace(/\*\*\*([^*]+):\s*\*\*/g, '**$1:**')
    
    // Fix incomplete sentences and formatting
    .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*/g, '**$1.**')
    .replace(/\*\*([^*]+)\*\*\.\*\*/g, '**$1.**')
    
    // Fix specific complex patterns
    .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*([^*]+)\*\*\*/g, '**$1.** **$2:**')
    .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*([^*]+)\*\*\*\.\*\*\*/g, '**$1.** **$2.**')
    
    // Fix Key Features section specifically
    .replace(/\*\*Key Features:\s*\*\*\s*\*/g, '**Key Features:**')
    .replace(/\*\*Key Features:\s*\*\*/g, '**Key Features:**')
    
    // Fix bullet points in lists
    .replace(/\*\s+\*\s+\*\s+([^*]+)/g, '* $1')
    .replace(/\*\s+\*\s+([^*]+)/g, '* $1')
    
    // Clean up excessive empty lines
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    
    // Fix spacing around colons in headers
    .replace(/\*\*([^*]+):\s*\*\*/g, '**$1:**')
    
    // Fix broken sentences
    .replace(/([^*]+)\*\*\*\.\*\*\*([^*]+)/g, '$1. $2')
    .replace(/([^*]+)\*\*\.\*\*([^*]+)/g, '$1. $2')
    
    // Remove trailing whitespace
    .trim();
}

/**
 * Test function to verify text cleaning
 */
export function testTextCleaning() {
  const testCases = [
    {
      name: 'Basic asterisk formatting',
      input: '* *text* *',
      expected: '**text**'
    },
    {
      name: 'Section headers',
      input: '***Modular Stack: ***',
      expected: '**Modular Stack:**'
    },
    {
      name: 'Key Features section',
      input: '**Key Features: ***',
      expected: '**Key Features:**'
    },
    {
      name: 'List items',
      input: '*   * item',
      expected: '* item'
    },
    {
      name: 'Complex pattern',
      input: '***Data Layer: *** It utilizes a Decentralized Data Exchange Protocol.***Consensus Layer: ***',
      expected: '**Data Layer:** It utilizes a Decentralized Data Exchange Protocol.**Consensus Layer:**'
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

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testTextCleaning = testTextCleaning;
  (window as any).cleanAIText = cleanAIText;
} 