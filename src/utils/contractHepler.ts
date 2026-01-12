import { ethers, keccak256, solidityPacked, getAddress, AbiCoder } from "ethers";
import { PUS_ADDRESS } from "@/src/app/blockchain";

const abi = new AbiCoder();

export function getERC6551AccountSalt(chainId: number | bigint, tokenId: number | bigint) {
  const encoded = abi.encode(
    ["uint256", "uint256", "address"],
    [BigInt(chainId), BigInt(tokenId), getAddress(PUS_ADDRESS)]
  );
  return keccak256(encoded);
}


export async function getPharosNativeBalance(address: string) {
  const provider = new ethers.JsonRpcProvider("https://atlantic.dplabs-internal.com");
  const balance = await provider.getBalance(address);
  return balance;
}


export function getTraitsIndex(
  tokenId: number,
  account: string,
  sender: string,
  preIndex: number
) {

  const salt = BigInt("0x" + Buffer.from("gotchipus", "utf8").toString("hex").padEnd(64, "0"));

  let seed = keccak256(
    solidityPacked(
      ["uint256", "address", "address", "uint256", "uint256"],
      [tokenId, getAddress(account), getAddress(sender), BigInt(salt), preIndex]
    )
  );

  const counts = [16, 8, 8];
  const indices: number[] = [];

  for (let i = 0; i < 3; i++) {

    seed = keccak256(solidityPacked(["bytes32", "uint256"], [seed, BigInt(i)]));
    const index = Number(BigInt(seed) % BigInt(counts[i]));
    indices.push(index);
  }

  return indices;
}