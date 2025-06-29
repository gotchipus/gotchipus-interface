'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import SignClient from '@walletconnect/sign-client';
import { getSdkError } from '@walletconnect/utils';
import { useStores } from '@stores/context';
import { observer } from 'mobx-react-lite';
import { useSignMessage, useSignTypedData, useWriteContract } from 'wagmi';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { useToast } from '@/hooks/use-toast'
import { CHAIN_ID } from '@/lib/constant';

interface WalletConnectTBAProps {
  tbaAddress: string;
  tokenId: string;
  handleWalletConnected: (isConnected: boolean, target: string) => void;
  isMobile?: boolean;
}

const WalletConnectTBA = observer(({ tbaAddress, tokenId, handleWalletConnected, isMobile = false }: WalletConnectTBAProps) => {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [clientKey, setClientKey] = useState(Date.now());
  const { toast } = useToast()
  const { walletStore } = useStores();

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
                throw new Error("TBA address is not available for session proposal.");
            }
            const isAuthorized = await verifyTBAAuthority(currentTba);
            if (!isAuthorized) return;

            const sessionNamespaces = {
              eip155: {
                chains: [`eip155:${CHAIN_ID}`],
                methods: ['eth_accounts', 'eth_sign', 'eth_sendTransaction', 'personal_sign'],
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
              description: `You can now use your GOTCHI to interact with ${metadata.name}`,
            });
          } catch (error) {
            const metadata = params.proposer.metadata;
            toast({
              title: `Failed to connect GOTCHI to ${metadata.name}`,
              description: "Please try again",
            });

            await client?.reject({ id, reason: getSdkError('USER_REJECTED') });
          } finally {
            walletStore.setWalletConnectPairing(false);
          }
        });

        client.on('session_request', async ({ id, topic, params }) => {
          const { request } = params;
          const { method, params: requestParams } = request;

          try {
            if (method === 'eth_accounts') {
              await client?.respond({
                topic,
                response: { id, jsonrpc: '2.0', result: [tbaAddressRef.current] },
              });
        
            } else if (method === 'eth_sign' || method === 'personal_sign') {
              const messageToSign = method === 'eth_sign' ? requestParams[1] : requestParams[0];
              const signature = await signMessageAsync({ message: messageToSign });

              await client?.respond({
                topic,
                response: { id, jsonrpc: '2.0', result: signature },
              });
        
            } else if (method === 'eth_signTypedData' || method === 'eth_signTypedData_v4') {
              const [from, typedDataString] = requestParams;
              const typedData = JSON.parse(typedDataString);
              
              const { domain, types, message, primaryType } = typedData;
              delete types.EIP712Domain;
              
              const signature = await signTypedDataAsync({ domain, message, primaryType, types });
              await client?.respond({
                topic,
                response: { id, jsonrpc: '2.0', result: signature },
              });
            } else if (method === 'eth_sendTransaction') { 

              const originalTx = requestParams[0];

              const estimatedGasLimit = BigInt(500000);
              let value = BigInt(0);
              if (originalTx.value && originalTx.value !== undefined) {
                value = BigInt(originalTx.value);
              }

              writeContract({
                address: PUS_ADDRESS as `0x${string}`, 
                abi: PUS_ABI,
                functionName: 'executeAccount',
                args: [
                    tbaAddressRef.current,
                    tokenId,
                    originalTx.to,     
                    value, 
                    originalTx.data || "0x",
                ],
                gas: estimatedGasLimit,
              }, 
              {
                  onSuccess: async (txHash) => {
                      await client?.respond({
                          topic,
                          response: { id, jsonrpc: '2.0', result: txHash },
                      });
                  },
                  onError: async (error) => {
                      await client?.respond({
                          topic,
                          response: { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED') },
                      });
                  }
              });
              toast({
                title: `Transaction Submitted on ${walletStore.walletConnectDappMetadata?.name}`,
                description: `Your ${walletStore.walletConnectDappMetadata?.name} transaction has been submitted`,
              });

            } else {
              toast({
                title: "Unsupported Method",
                description: "Please try again",
              });
              throw new Error(`Unsupported method: ${method}`);
            }
          } catch (error) {
            await client?.respond({
              topic,
              response: { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED') },
            });
            toast({
              title: "Transaction failed",
              description: "Please try again",
            });
          }
        });

        client.on('session_delete', ({ id, topic }) => {
          toast({
            title: `Disconnected by ${walletStore.walletConnectDappMetadata?.name}`,
            description: "Please try to connect again",
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
      <div className={`p-6 bg-[#d4d0c8] h-full flex items-center justify-center ${isMobile ? 'p-4' : ''}`}>
        <div className="text-center">
          <div className={`border-4 border-[#808080] border-t-[#000080] animate-spin mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}></div>
          <p className={`font-bold ${isMobile ? 'text-sm' : 'text-sm'}`}>Initializing WalletConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#d4d0c8] rounded-sm ${isMobile ? 'h-full overflow-auto' : ''}`}>
      {!walletStore.isConnected ? (
        <div className="text-center">
          <div className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-6 mb-4 ${isMobile ? 'p-4 mb-3' : ''}`}>
            <div className="text-center mb-4 flex flex-col items-center">
              <Image 
                src="/icons/walletconnect-logo.png" 
                alt="Wallet" 
                width={isMobile ? 96 : 128} 
                height={isMobile ? 96 : 128} 
                className="mx-auto mb-4" 
              />
              <h2 className={`font-bold mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>Connect Your GOTCHI</h2>
              <p className="text-[#000080] mb-4">Start by connecting your GOTCHI wallet to proceed</p>
            </div>
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-8 py-3 font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'px-6 py-2 text-sm' : ''}`}
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
          <div className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${isMobile ? 'p-3' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Image 
                  src="/icons/tba-gotchi.png" 
                  alt="Wallet" 
                  width={isMobile ? 20 : 24} 
                  height={isMobile ? 20 : 24} 
                  className={`mr-2 ${isMobile ? 'mr-1' : ''}`} 
                />
                <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>Your GOTCHI Owner</span>
              </div>
              <button 
                onClick={() => copyToClipboard(walletStore.address!)}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-3 py-1 font-bold hover:bg-[#c0c0c0] ${isMobile ? 'px-2 py-0.5 text-xs' : 'text-sm'}`}
              >
                Copy
              </button>
            </div>
            <div className={`p-3 bg-white border border-[#808080] shadow-win98-inner font-mono break-all ${isMobile ? 'text-xs p-2' : 'text-xs'}`}>
              {walletStore.address}
            </div>
          </div>

          <div className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${isMobile ? 'p-3' : ''}`}>
            <h3 className={`font-bold mb-4 border-b border-[#808080] pb-2 ${isMobile ? 'text-base mb-3' : 'text-lg'}`}>Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className={`block font-bold mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                  WalletConnect URI:
                </label>
                <input
                  type="text"
                  placeholder="wc://..."
                  value={walletStore.walletConnectUri}
                  onChange={(e) => walletStore.setWalletConnectUri(e.target.value)}
                  className={`w-full px-3 py-2 bg-white border border-[#808080] shadow-win98-inner font-mono ${isMobile ? 'text-xs py-1.5' : 'text-sm'}`}
                />
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
                <div className={`border-2 border-[#808080] border-t-[#000080] animate-spin mr-2 inline-block ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}></div>
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
            <div className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${isMobile ? 'p-3' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>TBA Address:</span>
                <button 
                  onClick={() => copyToClipboard(tbaAddress)}
                  className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-3 py-1 font-bold hover:bg-[#c0c0c0] ${isMobile ? 'px-2 py-0.5 text-xs' : 'text-sm'}`}
                >
                  Copy
                </button>
              </div>
              <div className={`p-3 bg-white border border-[#808080] shadow-win98-inner font-mono break-all ${isMobile ? 'text-xs p-2' : 'text-xs'}`}>
                {tbaAddress}
              </div>
            </div>
          )}

          {walletStore.walletConnectSession && walletStore.walletConnectDappMetadata && (
            <div className={`border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4 ${isMobile ? 'p-3' : ''}`}>
              <div className="flex items-center border-b border-[#808080] pb-2 mb-2">
                <div className="relative">
                  <div className={`rounded-full bg-[#008000] ${isMobile ? 'w-1.5 h-1.5 mr-1.5' : 'w-2 h-2 mr-2'}`}></div>
                  <div className={`absolute top-0 left-0 rounded-full animate-ping bg-[#008000] ${isMobile ? 'w-1.5 h-1.5 mr-1.5' : 'w-2 h-2 mr-2'}`}></div>
                </div>
                <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>Connected GOTCHI to {walletStore.walletConnectDappMetadata.name}</span>
              </div>
              <div className="flex items-center">
                {walletStore.walletConnectDappMetadata.icons && walletStore.walletConnectDappMetadata.icons.length > 0 && (
                  <Image 
                    src={walletStore.walletConnectDappMetadata.icons[0]} 
                    alt={`${walletStore.walletConnectDappMetadata.name} icon`}
                    width={isMobile ? 40 : 48}
                    height={isMobile ? 40 : 48}
                    className={`mr-4 border-2 border-[#808080] shadow-win98-inner ${isMobile ? 'w-10 h-10 mr-3' : 'w-12 h-12'}`}
                  />
                )}
                <div>
                  <p className={`font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>{walletStore.walletConnectDappMetadata.name}</p>
                  <a 
                    href={walletStore.walletConnectDappMetadata.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-[#000080] hover:underline break-all ${isMobile ? 'text-xs' : 'text-xs'}`}
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
});

export default WalletConnectTBA;