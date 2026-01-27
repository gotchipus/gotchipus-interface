/**
 * Validates if the provided source code is a valid Hook contract
 * A valid hook must:
 * 1. Import BaseHook (BeforeExecuteHook, AfterExecuteHook, or FullHook)
 * 2. Import IHook interface
 * 3. Inherit from one of the base hook contracts
 * 4. Have a constructor that accepts _gotchipus parameter
 * 5. Implement at least one hook method (_beforeExecute or _afterExecute)
 * 6. Include Solidity pragma declaration
 */
export const validateHookSourceCode = (sourceCode: string): { isValid: boolean; error?: string } => {
  if (!sourceCode || sourceCode.trim().length === 0) {
    return { isValid: false, error: 'Source code is required' };
  }

  const cleanCode = sourceCode
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ');

  const hasBaseHookImport =
    cleanCode.includes('BeforeExecuteHook') ||
    cleanCode.includes('AfterExecuteHook') ||
    cleanCode.includes('FullHook');

  const hasIHookImport = cleanCode.includes('IHook');

  if (!hasBaseHookImport) {
    return {
      isValid: false,
      error: 'Source code must import one of: BeforeExecuteHook, AfterExecuteHook, or FullHook from BaseHook'
    };
  }

  if (!hasIHookImport) {
    return {
      isValid: false,
      error: 'Source code must import IHook interface'
    };
  }

  const inheritancePattern = /contract\s+\w+\s+is\s+(BeforeExecuteHook|AfterExecuteHook|FullHook)/;
  const hasInheritance = inheritancePattern.test(cleanCode);

  if (!hasInheritance) {
    return {
      isValid: false,
      error: 'Contract must inherit from BeforeExecuteHook, AfterExecuteHook, or FullHook'
    };
  }

  const hasGotchipusConstructor =
    cleanCode.includes('constructor') &&
    cleanCode.includes('_gotchipus');

  if (!hasGotchipusConstructor) {
    return {
      isValid: false,
      error: 'Contract must have a constructor that accepts _gotchipus address parameter'
    };
  }

  const hasBeforeExecute = cleanCode.includes('_beforeExecute');
  const hasAfterExecute = cleanCode.includes('_afterExecute');

  if (!hasBeforeExecute && !hasAfterExecute) {
    return {
      isValid: false,
      error: 'Contract must implement at least one hook method: _beforeExecute or _afterExecute'
    };
  }

  if (!cleanCode.includes('pragma solidity')) {
    return {
      isValid: false,
      error: 'Source code must include Solidity pragma declaration'
    };
  }

  return { isValid: true };
};

/**
 * Quick check if source code looks like a valid hook
 * Used for fast filtering without detailed error messages
 */
export const isValidHook = (sourceCode: string): boolean => {
  return validateHookSourceCode(sourceCode).isValid;
};
