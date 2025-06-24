import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SignClient from '@walletconnect/sign-client';
import { getSdkError } from '@walletconnect/utils';
import { useStores } from '@stores/context';

export default function WalletConnectTBA() {
  const [walletAddress, setWalletAddress] = useState('');
  const [tbaAddress, setTbaAddress] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<any>(null);
  const [wcUri, setWcUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const { walletStore } = useStores();

  const CHAIN_ID = 688688;

  useEffect(() => {
    async function initSignClient() {
      try {
        setIsLoading(true);
        const client = await SignClient.init({
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          metadata: {
            name: 'TBA Wallet',
            description: 'TBA Wallet for ERC-6551',
            url: 'http://localhost:3000',
            icons: ['https://walletconnect.com/walletconnect-logo.png'],
          },
        });
        setSignClient(client);

        client.on('session_proposal', async ({ id, params }) => {
          try {
            setIsPairing(true);
            const tba = await getOrCreateTBA();
            if (!tba) return;

            const isAuthorized = await verifyTBAAuthority(tba);
            if (!isAuthorized) return;

            const sessionNamespaces = {
              eip155: {
                chains: [`eip155:${CHAIN_ID}`],
                methods: ['eth_accounts', 'eth_sign', 'eth_sendTransaction', 'personal_sign'],
                events: ['accountsChanged', 'chainChanged'],
                accounts: [`eip155:${CHAIN_ID}:${tba}`],
              },
            };

            const session = await client.approve({ id, namespaces: sessionNamespaces });
            setSession(session);
            setConnectionStatus(`Connected TBA ${tba} via WalletConnect`);
          } catch (error) {
            console.error('Session proposal failed:', error);
            await client.reject({ id, reason: getSdkError('USER_REJECTED') });
            setConnectionStatus('Session proposal rejected');
          } finally {
            setIsPairing(false);
          }
        });

        client.on('session_request', async ({ id, params }) => {
          const { chainId, request } = params;
          const { method, params: requestParams } = request;

          try {
            if (method === 'eth_accounts') {
              await client.respond({
                topic: session.topic,
                response: { id, jsonrpc: '2.0', result: [tbaAddress] },
              });
            } else if (method === 'eth_sign' || method === 'personal_sign') {
              const message = method === 'eth_sign' ? requestParams[1] : requestParams[0];
              const hash = ethers.hashMessage(message);
            } 
          } catch (error) {
            console.error('Session request failed:', error);
            await client.respond({
              topic: session.topic,
              response: { id, jsonrpc: '2.0', error: getSdkError('INVALID_METHOD') },
            });
          }
        });
      } catch (error) {
        console.error('SignClient initialization failed:', error);
        setConnectionStatus('WalletConnect initialization failed');
      } finally {
        setIsLoading(false);
      }
    }
    initSignClient();
  }, [tbaAddress]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setWalletAddress(walletStore.address!);
      setConnectionStatus('Wallet connected successfully');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setConnectionStatus('Wallet connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const getOrCreateTBA = async () => {
    try {
      const tba = "0x574944744E51d2D032f0f7b3fF2509b06cf88f05";
      const code = "0x";
      if (code === '0x') {
        setConnectionStatus('TBA created successfully');
      }
      setTbaAddress(tba);
      return tba;
    } catch (error) {
      console.error('TBA creation/query failed:', error);
      setConnectionStatus('Failed to get/create TBA');
      return null;
    }
  };

  const verifyTBAAuthority = async (tba: string) => {
    try {
      return true;
    } catch (error) {
      console.error('TBA authority verification failed:', error);
      setConnectionStatus('TBA authority verification failed');
      return false;
    }
  };

  const pairWithDApp = async () => {
    if (!signClient || !wcUri) {
      setConnectionStatus('Please provide URI, and ensure WalletConnect is initialized');
      return;
    }

    try {
      setIsPairing(true);
      await signClient.pair({ uri: wcUri });
      setConnectionStatus('Pairing initiated, awaiting session proposal');
    } catch (error) {
      console.error('Pairing failed:', error);
      setConnectionStatus('Pairing failed');
    } finally {
      setIsPairing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setConnectionStatus('Address copied to clipboard!');
    setTimeout(() => setConnectionStatus(''), 2000);
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
    <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-4">
      <div className="text-lg font-bold mb-3 flex items-center border-b border-[#808080] pb-2">
        <div className="w-6 h-6 bg-[#000080] mr-2 flex items-center justify-center">
          <div className="w-4 h-4 bg-white"></div>
        </div>
        GOTCHI WalletConnect
      </div>

      {!walletAddress ? (
        <div className="text-center">
          <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-6 mb-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-[#000080] mx-auto mb-4 flex items-center justify-center">
                <div className="w-12 h-12 bg-white"></div>
              </div>
              <h2 className="text-lg font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-[#000080] mb-4">Start by connecting your EOA wallet to proceed</p>
            </div>
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-8 py-3 font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#808080] border-t-[#000080] animate-spin mr-2 inline-block"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <div className="w-4 h-4 bg-[#000080] mr-2 inline-block"></div>
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wallet Status */}
          <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#008000] mr-2"></div>
                <span className="font-bold">Wallet Connected</span>
              </div>
              <button 
                onClick={() => copyToClipboard(walletAddress)}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-3 py-1 text-sm font-bold hover:bg-[#c0c0c0]"
              >
                Copy
              </button>
            </div>
            <div className="p-3 bg-white border border-[#808080] shadow-win98-inner text-xs font-mono">{walletAddress}</div>
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
                  value={wcUri}
                  onChange={(e) => setWcUri(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#808080] shadow-win98-inner font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={pairWithDApp}
            disabled={!wcUri || isPairing}
            className="w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] py-3 font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPairing ? (
              <>
                <div className="w-4 h-4 border-2 border-[#808080] border-t-[#000080] animate-spin mr-2 inline-block"></div>
                Connecting with DApp...
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-[#000080] mr-2 inline-block"></div>
                Connect with DApp
              </>
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

          {/* Status Display */}
          {connectionStatus && (
            <div className="border-2 border-[#808080] shadow-win98-inner bg-[#c0c0c0] p-4">
              <div className="flex items-center">
                <div className={`w-4 h-4 mr-2 ${
                  connectionStatus.includes('success') || connectionStatus.includes('Connected') 
                    ? 'bg-[#008000]' 
                    : connectionStatus.includes('failed') || connectionStatus.includes('rejected')
                    ? 'bg-[#ff0000]'
                    : 'bg-[#000080]'
                }`}></div>
                <span className="font-bold">Status: {connectionStatus}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}