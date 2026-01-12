'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import SignClient from '@walletconnect/sign-client';
import { getSdkError } from '@walletconnect/utils';
import { useStores } from '@stores/context';
import { observer } from 'mobx-react-lite';
import { useSignMessage, useSignTypedData, useWriteContract, usePublicClient } from 'wagmi';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { useToast } from '@/hooks/use-toast';
import { CHAIN_ID } from '@/lib/constant';
import { hashMessage, hashTypedData } from 'viem';

// EIP-1271 magic value for valid signature
const EIP1271_MAGIC_VALUE = '0x1626ba7e';

interface WalletConnectTBAProps {
  tbaAddress: string;
  tokenId: string;
  handleWalletConnected: (isConnected: boolean, target: string) => void;
  isMobile?: boolean;
}

const WalletConnectTBA = observer(
  ({ tbaAddress, tokenId, handleWalletConnected, isMobile = false }: WalletConnectTBAProps) => {
    const [signClient, setSignClient] = useState<SignClient | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [clientKey, setClientKey] = useState(Date.now());
    const { toast } = useToast();
    const { walletStore } = useStores();
    const publicClient = usePublicClient();

    const { signMessageAsync } = useSignMessage();
    const { signTypedDataAsync } = useSignTypedData();
    const { writeContract } = useWriteContract();

    const tbaAddressRef = useRef(tbaAddress);
    const initialized = useRef(false);

    useEffect(() => {
      tbaAddressRef.current = tbaAddress;
    }, [tbaAddress]);

    useEffect(() => {
      if (walletStore.isWalletConnectConnected && walletStore.walletConnectDappMetadata) {
        handleWalletConnected(true, walletStore.connectedTarget);
      }
    }, []);

    const resetSession = () => {
      walletStore.setWalletConnectSession(null);
      walletStore.setWalletConnectUri('');
      walletStore.setWalletConnectDappMetadata(null);
      walletStore.setWalletConnectConnected(false);
      walletStore.setConnectedTarget('');
      setClientKey(Date.now());
    };

    const handleDisconnect = async () => {
      if (!signClient || !walletStore.walletConnectSession) {
        return;
      }

      try {
        await signClient.disconnect({
          topic: walletStore.walletConnectSession.topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
        resetSession();
        handleWalletConnected(false, '');
      } catch (error) {
        console.error('Failed to disconnect session:', error);
      }
    };

    // Check if an address is a contract account by checking if it has code
    const isContractAccount = async (address: string): Promise<boolean> => {
      if (!publicClient) {
        return false;
      }

      try {
        const code = await publicClient.getBytecode({ address: address as `0x${string}` });
        return code !== undefined && code !== null && code !== '0x' && code.length > 2;
      } catch (error) {
        console.error('Failed to check if address is contract:', error);
        return false;
      }
    };

    // Verify that the signature can be validated by TBA contract via EIP-1271
    const verifySignatureWithTBA = async (
      messageHash: `0x${string}`,
      signature: `0x${string}`
    ): Promise<boolean> => {
      if (!publicClient || !tbaAddressRef.current) {
        console.error('[WalletConnect] ❌ Missing publicClient or TBA address');
        return false;
      }

      try {
        const isContract = await isContractAccount(tbaAddressRef.current);
        if (!isContract) {
          console.warn('[WalletConnect] TBA address does not appear to be a contract account');
          return false;
        }

        const TBA_ABI = [
          {
            name: 'isValidSignature',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'hash', type: 'bytes32' },
              { name: 'signature', type: 'bytes' },
            ],
            outputs: [{ name: 'magicValue', type: 'bytes4' }],
          },
        ] as const;

        const magicValue = await publicClient.readContract({
          address: tbaAddressRef.current as `0x${string}`,
          abi: TBA_ABI,
          functionName: 'isValidSignature',
          args: [messageHash, signature],
        });

        const ok = magicValue.toLowerCase() === EIP1271_MAGIC_VALUE.toLowerCase();
        if (!ok) {
          console.warn(
            `[WalletConnect] EIP-1271 check failed. Returned: ${magicValue}, expected: ${EIP1271_MAGIC_VALUE}`
          );
        }
        return ok;
      } catch (error: any) {
        console.error('[WalletConnect] ❌ Failed to verify signature with TBA:', error);
        return false;
      }
    };

    useEffect(() => {
      if (initialized.current) {
        return;
      }
      initialized.current = true;
      let client: SignClient | null = null;

      async function initSignClient() {
        try {
          setIsLoading(true);
          client = await SignClient.init({
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
            metadata: {
              name: 'Gotchipus',
              description: 'Gotchipus Wallet for Gotchipus',
              url: 'http://localhost:3000',
              icons: ['https://images.gotchipus.com/favicon-96x96.png'],
            },
          });
          setSignClient(client);

          // ---- session_proposal ----
          client.on('session_proposal', async ({ id, params }) => {
            try {
              walletStore.setWalletConnectPairing(true);
              walletStore.setWalletConnectConnected(true);

              const metadata = params.proposer.metadata;
              walletStore.setWalletConnectDappMetadata(metadata);
              walletStore.setConnectedTarget(metadata.name);
              handleWalletConnected(true, metadata.name);
              walletStore.setWalletConnected(true);

              const currentTba = tbaAddressRef.current;
              if (!currentTba) {
                throw new Error('TBA address is not available for session proposal.');
              }

              const isContract = await isContractAccount(currentTba);
              if (!isContract) {
                console.warn(
                  `[WalletConnect] Address ${currentTba} does not appear to be a contract account`
                );
                toast({
                  title: 'Warning',
                  description:
                    'The TBA address may not be a contract account. Signature verification may fail.',
                  variant: 'destructive',
                });
              } else {
                console.log(`[WalletConnect] Confirmed ${currentTba} is a contract account`);
              }

              const isAuthorized = await verifyTBAAuthority(currentTba);
              if (!isAuthorized) return;

              const sessionNamespaces = {
                eip155: {
                  chains: [`eip155:${CHAIN_ID}`],
                  methods: [
                    'eth_accounts',
                    'eth_sign',
                    'eth_sendTransaction',
                    'personal_sign',
                    'eth_signTypedData',
                    'eth_signTypedData_v4',
                  ],
                  events: ['accountsChanged', 'chainChanged'],
                  accounts: [`eip155:${CHAIN_ID}:${currentTba}`],
                },
              };

              const session = await client?.approve({ id, namespaces: sessionNamespaces });
              if (session) {
                walletStore.setWalletConnectSession(session);
              }

              toast({
                title: `Connected GOTCHI to ${metadata.name}`,
                description:
                  'Connected successfully. When signing, your wallet plugin (e.g., OKX Wallet) will show your EOA address (the NFT owner). The DApp MUST use EIP-1271 to verify contract account signatures.',
                duration: 10000,
              });
            } catch (error) {
              const metadata = params.proposer.metadata;
              toast({
                title: `Failed to connect GOTCHI to ${metadata.name}`,
                description: 'Please try again',
              });

              await client?.reject({ id, reason: getSdkError('USER_REJECTED') });
            } finally {
              walletStore.setWalletConnectPairing(false);
            }
          });

          // ---- session_request ----
          client.on('session_request', async ({ id, topic, params }) => {
            const { request } = params;
            const { method, params: reqParams } = request;

            try {
              // ---------- eth_accounts ----------
              if (method === 'eth_accounts') {
                return client?.respond({
                  topic,
                  response: { id, jsonrpc: '2.0', result: [tbaAddressRef.current] },
                });
              }

              // ---------- personal_sign / eth_sign ----------
              if (method === 'personal_sign' || method === 'eth_sign') {
                // personal_sign: [message, address]
                const message =
                  method === 'personal_sign'
                    ? reqParams[0]
                    : reqParams[1] ?? reqParams[0];

                console.log(`[WalletConnect] 🔐 ${method} request received`);
                console.log(
                  `[WalletConnect]   NOTE: Wallet popup will show EOA (NFT owner). This is expected.`
                );

                const signature = (await signMessageAsync({
                  message,
                })) as `0x${string}`;

                return client?.respond({
                  topic,
                  response: { id, jsonrpc: '2.0', result: signature },
                });
              }

              // ---------- eth_signTypedData / v4 ----------
              if (method === 'eth_signTypedData' || method === 'eth_signTypedData_v4') {
                const typedDataString = reqParams[1] ?? reqParams[0];
                const typedData = JSON.parse(typedDataString);

                const { domain, types, message, primaryType } = typedData;

                console.log(`[WalletConnect] 🔐 ${method} request received`);

                const signature = (await signTypedDataAsync({
                  domain,
                  types,
                  message,
                  primaryType,
                })) as `0x${string}`;

                try {
                  const digest = hashTypedData({
                    domain,
                    types,
                    primaryType: primaryType as string,
                    message,
                  });

                  const ok = await verifySignatureWithTBA(digest, signature);
                } catch (e) {
                  console.warn('[WalletConnect] EIP-1271 sanity check error (typedData):', e);
                }

                return client?.respond({
                  topic,
                  response: { id, jsonrpc: '2.0', result: signature },
                });
              }

              // ---------- eth_sendTransaction ----------
              if (method === 'eth_sendTransaction') {
                const originalTx = reqParams[0];

                console.log('[WalletConnect] 📤 eth_sendTransaction request received');

                const estimatedGasLimit = BigInt(500000);
                let value = BigInt(0);
                if (originalTx.value && originalTx.value !== undefined) {
                  value = BigInt(originalTx.value);
                }

                writeContract(
                  {
                    address: PUS_ADDRESS as `0x${string}`,
                    abi: PUS_ABI,
                    functionName: 'executeAccount',
                    args: [
                      tbaAddressRef.current,
                      tokenId,
                      originalTx.to,
                      value,
                      originalTx.data || '0x',
                    ],
                    gas: estimatedGasLimit,
                  },
                  {
                    onSuccess: async (txHash) => {
                      console.log('[WalletConnect] ✅ Transaction sent:', txHash);
                      await client?.respond({
                        topic,
                        response: { id, jsonrpc: '2.0', result: txHash },
                      });
                      toast({
                        title: `Transaction Submitted on ${walletStore.walletConnectDappMetadata?.name}`,
                        description: `Your ${walletStore.walletConnectDappMetadata?.name} transaction has been submitted`,
                      });
                    },
                    onError: async (error) => {
                      console.error('[WalletConnect] ❌ Transaction failed:', error);
                      await client?.respond({
                        topic,
                        response: { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED') },
                      });
                      toast({
                        title: 'Transaction failed',
                        description: 'Please try again',
                        variant: 'destructive',
                      });
                    },
                  }
                );
                return;
              }

              toast({
                title: 'Unsupported Method',
                description: `Method ${method} is not supported.`,
                variant: 'destructive',
              });
              throw new Error(`Unsupported method: ${method}`);
            } catch (error) {
              console.error('WC Request error:', error);
              return client?.respond({
                topic,
                response: { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED') },
              });
            }
          });

          // ---- session_delete ----
          client.on('session_delete', () => {
            toast({
              title: `Disconnected by ${walletStore.walletConnectDappMetadata?.name}`,
              description: 'Please try to connect again',
            });

            resetSession();
            handleWalletConnected(false, '');
          });
        } catch (error) {
          console.error('SignClient initialization failed:', error);
        } finally {
          setIsLoading(false);
        }
      }

      initSignClient();
    }, [clientKey]);

    const connectWallet = async () => {
      try {
        setIsConnecting(true);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    const verifyTBAAuthority = async (tba: string) => {
      try {
        return true;
      } catch (error) {
        console.error('TBA authority verification failed:', error);
        return false;
      }
    };

    const pairWithDApp = async () => {
      if (!signClient || !walletStore.walletConnectUri) {
        return;
      }

      try {
        walletStore.setWalletConnectPairing(true);
        await signClient.pair({ uri: walletStore.walletConnectUri });
      } catch (error) {
        console.error('Pairing failed:', error);
      } finally {
        walletStore.setWalletConnectPairing(false);
      }
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    if (isLoading) {
      return (
        <div
          className={`p-6 bg-[#d4d0c8] h-full flex items-center justify-center ${
            isMobile ? 'p-4' : ''
          }`}
        >
          <div className="text-center">
            <div
              className={`border-4 border-[#808080] border-t-[#000080] animate-spin mx-auto mb-4 ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              }`}
            ></div>
            <p className={`font-bold ${isMobile ? 'text-sm' : 'text-sm'}`}>
              Initializing WalletConnect...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-[#d4d0c8] rounded-sm ${isMobile ? 'h-full overflow-auto' : ''}`}>
        {!walletStore.isConnected ? (
          <div className="text-center">
            <div
              className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-6 mb-4 ${
                isMobile ? 'p-4 mb-3' : ''
              }`}
            >
              <div className="text-center mb-4 flex flex-col items-center">
                <Image
                  src="/icons/walletconnect-logo.png"
                  alt="Wallet"
                  width={isMobile ? 96 : 128}
                  height={isMobile ? 96 : 128}
                  className="mx-auto mb-4"
                />
                <h2 className={`font-bold mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                  Connect Your GOTCHI
                </h2>
                <p className="text-[#000080] mb-4">
                  Start by connecting your GOTCHI wallet to proceed
                </p>
              </div>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-8 py-3 font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isMobile ? 'px-6 py-2 text-sm' : ''
                }`}
              >
                <div className="flex items-center">
                  <Image
                    src="/icons/walletconnect-logo.png"
                    alt="Wallet"
                    width={isMobile ? 20 : 24}
                    height={isMobile ? 20 : 24}
                    className={`mr-2 ${isMobile ? 'mr-1' : ''}`}
                  />
                  {isConnecting ? 'Connecting...' : 'Connect dApp'}
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className={`space-y-4 ${isMobile ? 'space-y-3' : ''}`}>
            <div
              className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${
                isMobile ? 'p-3' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Image
                    src="/icons/tba-gotchi.png"
                    alt="Wallet"
                    width={isMobile ? 20 : 24}
                    height={isMobile ? 20 : 24}
                    className={`mr-2 ${isMobile ? 'mr-1' : ''}`}
                  />
                  <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>
                    Your GOTCHI Owner
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(walletStore.address!)}
                  className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-3 py-1 font-bold hover:bg-[#c0c0c0] ${
                    isMobile ? 'px-2 py-0.5 text-xs' : 'text-sm'
                  }`}
                >
                  Copy
                </button>
              </div>
              <div
                className={`p-3 bg-white border border-[#808080] shadow-win98-inner font-mono break-all ${
                  isMobile ? 'text-xs p-2' : 'text-xs'
                }`}
              >
                {walletStore.address}
              </div>
            </div>

            <div
              className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${
                isMobile ? 'p-3' : ''
              }`}
            >
              <h3
                className={`font-bold mb-4 border-b border-[#808080] pb-2 ${
                  isMobile ? 'text-base mb-3' : 'text-lg'
                }`}
              >
                Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block font-bold mb-2 ${
                      isMobile ? 'text-sm' : 'text-sm'
                    }`}
                  >
                    WalletConnect URI:
                  </label>
                  <input
                    type="text"
                    placeholder="wc://..."
                    value={walletStore.walletConnectUri}
                    onChange={(e) => walletStore.setWalletConnectUri(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border border-[#808080] shadow-win98-inner font-mono ${
                      isMobile ? 'text-xs py-1.5' : 'text-sm'
                    }`}
                  />
                </div>
                <div
                  className={`bg-yellow-100 border-2 border-yellow-600 p-3 ${
                    isMobile ? 'p-2' : ''
                  }`}
                >
                  <p
                    className={`font-bold text-yellow-900 mb-1 ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    ⚠️ Important Notice
                  </p>
                  <p
                    className={`text-yellow-900 ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}
                  >
                    You are connecting with a <strong>contract account (TBA)</strong>. When
                    signing messages, your wallet will show your{' '}
                    <strong>EOA address (NFT owner)</strong>. The DApp <strong>MUST</strong>{' '}
                    support <strong>EIP-1271</strong> to verify signatures from contract
                    accounts. If signature verification fails, the DApp may not support
                    contract accounts.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={walletStore.isWalletConnectConnected ? handleDisconnect : pairWithDApp}
              disabled={!walletStore.walletConnectUri || walletStore.isWalletConnectPairing}
              className={`w-full border-2 border-[#808080] shadow-win98-outer py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
                walletStore.isWalletConnectConnected
                  ? 'bg-[#c0c0c0] text-[#000080] hover:bg-[#d4d0c8]'
                  : 'bg-[#c0c0c0] text-black hover:bg-[#d4d0c0]'
              } ${isMobile ? 'py-2 text-sm' : ''}`}
            >
              {walletStore.isWalletConnectPairing ? (
                <>
                  <div
                    className={`border-2 border-[#808080] border-t-[#000080] animate-spin mr-2 inline-block ${
                      isMobile ? 'w-3 h-3' : 'w-4 h-4'
                    }`}
                  ></div>
                  Connecting with DApp...
                </>
              ) : walletStore.isWalletConnectConnected ? (
                <div className="flex items-center justify-center">
                  <Image
                    src="/icons/connect.png"
                    alt="Wallet"
                    width={isMobile ? 20 : 24}
                    height={isMobile ? 20 : 24}
                    className={`mr-2 ${isMobile ? 'mr-1' : ''}`}
                  />
                  Disconnect
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Image
                    src="/icons/walletconnect-logo.png"
                    alt="Wallet"
                    width={isMobile ? 20 : 24}
                    height={isMobile ? 20 : 24}
                    className={`mr-2 ${isMobile ? 'mr-1' : ''}`}
                  />
                  Connect with DApp
                </div>
              )}
            </button>

            {tbaAddress && (
              <div
                className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${
                  isMobile ? 'p-3' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>
                    TBA Address:
                  </span>
                  <button
                    onClick={() => copyToClipboard(tbaAddress)}
                    className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-3 py-1 font-bold hover:bg-[#c0c0c0] ${
                      isMobile ? 'px-2 py-0.5 text-xs' : 'text-sm'
                    }`}
                  >
                    Copy
                  </button>
                </div>
                <div
                  className={`p-3 bg-white border border-[#808080] shadow-win98-inner font-mono break-all ${
                    isMobile ? 'text-xs p-2' : 'text-xs'
                  }`}
                >
                  {tbaAddress}
                </div>
              </div>
            )}

            {walletStore.walletConnectSession && walletStore.walletConnectDappMetadata && (
              <div
                className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${
                  isMobile ? 'p-3' : ''
                }`}
              >
                <div className="flex items-center border-b border-[#808080] pb-2 mb-2">
                  <div className="relative">
                    <div
                      className={`rounded-full bg-[#008000] ${
                        isMobile ? 'w-1.5 h-1.5 mr-1.5' : 'w-2 h-2 mr-2'
                      }`}
                    ></div>
                    <div
                      className={`absolute top-0 left-0 rounded-full animate-ping bg-[#008000] ${
                        isMobile ? 'w-1.5 h-1.5 mr-1.5' : 'w-2 h-2 mr-2'
                      }`}
                    ></div>
                  </div>
                  <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>
                    Connected GOTCHI to {walletStore.walletConnectDappMetadata.name}
                  </span>
                </div>
                <div className="flex items-center">
                  {walletStore.walletConnectDappMetadata.icons &&
                    walletStore.walletConnectDappMetadata.icons.length > 0 && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={walletStore.walletConnectDappMetadata.icons[0]}
                        alt={`${walletStore.walletConnectDappMetadata.name} icon`}
                        width={isMobile ? 40 : 48}
                        height={isMobile ? 40 : 48}
                        className={`mr-4 border-2 border-[#808080] shadow-win98-inner ${
                          isMobile ? 'w-10 h-10 mr-3' : 'w-12 h-12'
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  <div>
                    <p className={`font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {walletStore.walletConnectDappMetadata.name}
                    </p>
                    <a
                      href={walletStore.walletConnectDappMetadata.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[#000080] hover:underline break-all ${
                        isMobile ? 'text-xs' : 'text-xs'
                      }`}
                    >
                      {walletStore.walletConnectDappMetadata.url}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default WalletConnectTBA;