import gotchipusAbi from './abi/gotchipus-abi.json';
import dnaAbi from './abi/dna-abi.json';
import erc6551AccountAbi from './abi/erc6551-account-abi.json';
import erc6551RegistryAbi from './abi/erc6551-registry-abi.json';
import hooksAbi from './abi/hooks-abi.json';
import ownershipAbi from './abi/ownership-abi.json';
import simpleErc20Abi from './abi/simple-erc20-abi.json';
import farmAbi from './abi/farm-abi.json';
import attributesAbi from './abi/attributes-facet-abi.json';
import diamondCutAbi from './abi/diamond-cut-abi.json';
import diamondLoupeAbi from './abi/diamond-loupe-abi.json';
import diamondAbi from './abi/diamond-abi.json';
import erc6551FacetAbi from './abi/erc6551-facet-abi.json';
import svgFacetAbi from './abi/svg-facet-abi.json';
import wearableFacetAbi from './abi/wearable-facet-abi.json';

export const PUS_ABI = [
  ...gotchipusAbi,
  ...dnaAbi,
  ...hooksAbi,
  ...ownershipAbi,
  ...simpleErc20Abi,
  ...farmAbi,
  ...attributesAbi,
  ...diamondCutAbi,
  ...diamondLoupeAbi,
  ...diamondAbi,
  ...erc6551FacetAbi,
  ...svgFacetAbi,
  ...wearableFacetAbi,
];

export const PUS_ADDRESS = '0x0000000038f050528452D6Da1E7AACFA7B3Ec0a8'; 
export const ERC6551_REGISTRY_ADDRESS = '0x000000E7C8746fdB64D791f6bb387889c5291454';
export const ERC6551_ABI = erc6551RegistryAbi;
export const ERC20_ABI = simpleErc20Abi;