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
}

const WalletConnectTBA = observer(({ tbaAddress, tokenId, handleWalletConnected }: WalletConnectTBAProps) => {
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
      <div className="p-6 bg-[#d4d0c8] h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#808080] border-t-[#000080] animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold">Initializing WalletConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#d4d0c8] rounded-sm">
      {!walletStore.isConnected ? (
        <div className="text-center">
          <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-6 mb-4">
            <div className="text-center mb-4 flex flex-col items-center">
              <Image src="/icons/walletconnect-logo.png" alt="Wallet" width={128} height={128} className="mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">Connect Your GOTCHI</h2>
              <p className="text-[#000080] mb-4">Start by connecting your GOTCHI wallet to proceed</p>
            </div>
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-8 py-3 font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <Image src="/icons/walletconnect-logo.png" alt="Wallet" width={24} height={24} className="mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect dApp'}
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wallet Status */}
          <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Image src="/icons/tba-gotchi.png" alt="Wallet" width={24} height={24} className="mr-2" />
                <span className="font-bold">Your GOTCHI Owner</span>
              </div>
              <button 
                onClick={() => copyToClipboard(walletStore.address!)}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-3 py-1 text-sm font-bold hover:bg-[#c0c0c0]"
              >
                Copy
              </button>
            </div>
            <div className="p-3 bg-white border border-[#808080] shadow-win98-inner text-xs font-mono">{walletStore.address}</div>
          </div>

          {/* Configuration Form */}
          <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4">
            <h3 className="text-lg font-bold mb-4 border-b border-[#808080] pb-2">Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  WalletConnect URI:
                </label>
                <input
                  type="text"
                  placeholder="wc://..."
                  value={walletStore.walletConnectUri}
                  onChange={(e) => walletStore.setWalletConnectUri(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#808080] shadow-win98-inner font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={walletStore.isWalletConnectConnected ? handleDisconnect : pairWithDApp}
            disabled={!walletStore.walletConnectUri || walletStore.isWalletConnectPairing}
            className={`w-full border-2 border-[#808080] shadow-win98-outer py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
              walletStore.isWalletConnectConnected 
                ? 'bg-[#c0c0c0] text-[#000080] hover:bg-[#d4d0c8]' 
                : 'bg-[#c0c0c0] text-black hover:bg-[#d4d0c0]'
            }`}
          >
            {walletStore.isWalletConnectPairing ? (
              <>
                <div className="w-4 h-4 border-2 border-[#808080] border-t-[#000080] animate-spin mr-2 inline-block"></div>
                Connecting with DApp...
              </>
            ) : walletStore.isWalletConnectConnected ? (
              <div className="flex items-center justify-center">
                <Image src="/icons/connect.png" alt="Wallet" width={24} height={24} className="mr-2" />
                Disconnect
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Image src="/icons/walletconnect-logo.png" alt="Wallet" width={24} height={24} className="mr-2" />
                Connect with DApp
              </div>
            )}
          </button>

          {/* TBA Address Display */}
          {tbaAddress && (
            <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">TBA Address:</span>
                <button 
                  onClick={() => copyToClipboard(tbaAddress)}
                  className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-3 py-1 text-sm font-bold hover:bg-[#c0c0c0]"
                >
                  Copy
                </button>
              </div>
              <div className="p-3 bg-white border border-[#808080] shadow-win98-inner text-xs font-mono break-all">{tbaAddress}</div>
            </div>
          )}

          {walletStore.walletConnectSession && walletStore.walletConnectDappMetadata && (
            <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4">
              <div className="flex items-center border-b border-[#808080] pb-2 mb-2">
                <div className="relative">
                  <div className={`w-2 h-2 mr-2 rounded-full bg-[#008000]`}></div>
                  <div className={`absolute top-0 left-0 w-2 h-2 mr-2  rounded-full animate-ping bg-[#008000]`}></div>
                </div>
                <span className="font-bold">Connected GOTCHI to {walletStore.walletConnectDappMetadata.name}</span>
              </div>
              <div className="flex items-center">
                {walletStore.walletConnectDappMetadata.icons && walletStore.walletConnectDappMetadata.icons.length > 0 && (
                  <Image 
                    src={walletStore.walletConnectDappMetadata.icons[0]} 
                    alt={`${walletStore.walletConnectDappMetadata.name} icon`}
                    width={48}
                    height={48}
                    className="w-12 h-12 mr-4 border-2 border-[#808080] shadow-win98-inner"
                  />
                )}
                <div>
                  <p className="font-bold text-base">{walletStore.walletConnectDappMetadata.name}</p>
                  <a 
                    href={walletStore.walletConnectDappMetadata.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-[#000080] hover:underline break-all"
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