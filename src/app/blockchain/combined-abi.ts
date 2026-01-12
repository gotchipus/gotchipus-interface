import gotchipusAbi from './abi/gotchipus-abi.json';
import dnaAbi from './abi/dna-abi.json';
import erc6551RegistryAbi from './abi/erc6551-registry-abi.json';
import hooksAbi from './abi/hooks-abi.json';
import ownershipAbi from './abi/ownership-abi.json';
import simpleErc20Abi from './abi/simple-erc20-abi.json';
import attributesAbi from './abi/attributes-facet-abi.json';
import diamondCutAbi from './abi/diamond-cut-abi.json';
import diamondLoupeAbi from './abi/diamond-loupe-abi.json';
import diamondAbi from './abi/diamond-abi.json';
import erc6551FacetAbi from './abi/erc6551-facet-abi.json';
import svgFacetAbi from './abi/svg-facet-abi.json';
import wearableFacetAbi from './abi/wearable-facet-abi.json';
import metadataFacetAbi from './abi/metadata-facet-abi.json';
import timeFacetAbi from './abi/time-facet-abi.json';
import mintFacetAbi from './abi/mint-facet-abi.json';
import paymasterFacetAbi from './abi/paymaster-facet-abi.json';
import gotchiWearableFacetAbi from './abi/gotchi-wearable-facet-abi.json';

export const PUS_ABI = [
  ...gotchipusAbi,
  ...dnaAbi,
  ...hooksAbi,
  ...ownershipAbi,
  ...simpleErc20Abi,
  ...attributesAbi,
  ...diamondCutAbi,
  ...diamondLoupeAbi,
  ...diamondAbi,
  ...erc6551FacetAbi,
  ...svgFacetAbi,
  ...metadataFacetAbi,
  ...timeFacetAbi,
  ...mintFacetAbi,
  ...paymasterFacetAbi,
  ...gotchiWearableFacetAbi,
];

export const PUS_ADDRESS = '0x000000007B5758541e9d94a487B83e11Cd052437'; 
export const ERC6551_REGISTRY_ADDRESS = '0x000000E7C8746fdB64D791f6bb387889c5291454';
export const ERC6551_ACCOUNT_IMPLEMENTATION_ADDRESS = '0xb98aA33B8a0C6Ca0fb5667DC2601032Bff92D7B3';
export const WEARABLE_MARKETPLACE_ADDRESS = '0x22646d4E832132E93F2dEF9Ea875Aa5329B7feF4';
export const WEARABLE_MARKETPLACE_ABI = wearableFacetAbi;
export const ERC6551_ABI = erc6551RegistryAbi;
export const ERC20_ABI = simpleErc20Abi;