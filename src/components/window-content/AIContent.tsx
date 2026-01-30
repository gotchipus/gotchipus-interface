"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChatInterface, Message } from "./ai";
import { ActionCards } from "./ai/components/modern/ActionCards";
import { ChatHeader } from "./ai/components/modern/ChatHeader";
import { ChatSidebar } from "./ai/components/modern/ChatSidebar";
import { ConversationInput } from "./ai/components/modern/ConversationInput";
import { QuickQuestions } from "./ai/components/modern/QuickQuestions";
import { ChatResponse } from "./ai/types";
import useChat from "@/hooks/useChat";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { CustomConnectButton } from "../footer/CustomConnectButton";
import useResponsive from "@/src/hooks/useResponsive";
import { useContractRead } from "@/hooks/useContract";

const AIContent = observer(() => {
  const { walletStore } = useStores();
  const isMobile = useResponsive();

  const [input, setInput] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system",
      role: "system",
      content: "You are Gotchipus, an AI assistant.",
    },
  ]);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    title: string;
    timestamp: Date;
  }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { send: sendChatEvent } = useChat();
  const isProcessingRef = useRef(false);

  const { data: balance, isLoading: isCheckingBalance } = useContractRead(
    "balanceOf",
    [walletStore.address],
    { enabled: walletStore.isConnected && !!walletStore.address }
  );

  const hasNFT = balance && Number(balance) > 0;

  useEffect(() => {
    if (hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, hasStartedChat]);

  useEffect(() => {
    if (hasStartedChat && status === "streaming") {
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      };
      
      const intervalId = setInterval(scrollToBottom, 300);
      
      return () => clearInterval(intervalId);
    }
  }, [hasStartedChat, status]);

  useEffect(() => {
    if (hasStartedChat && inputRef.current && status === "idle") {
      inputRef.current.focus();
    }
  }, [hasStartedChat, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  const handleBackToInput = () => {
    if (hasStartedChat && currentChatId && messages.length > 1) {
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, timestamp: new Date() }
            : chat
        )
      );
    }

    setHasStartedChat(false);
    setCurrentChatId(undefined);
    setInput("");
    setMessages([
      {
        id: "system",
        role: "system",
        content: "You are Gotchipus, an AI assistant.",
      },
    ]);
    setStatus("idle");
    setCurrentChatId(undefined);
    isProcessingRef.current = false;
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleSelectChat = (chatId: string) => {
    console.log("Select chat:", chatId);
  };

  const getToolData = useCallback((agentIndex: number) => {
    const toolDataMap: Record<number, object> = {
      2: { pet: true },
      3: { mint: true },
      4: { summon: true },
      5: { wearable: true },
      6: { call: true },
      7: { swap: true },
      8: { addLiquidity: true },
      9: { removeLiquidity: true },
    };
    return toolDataMap[agentIndex] || null;
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages(prev =>
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const processTextChunk = useCallback((chunk: string) => {
    let contentToAdd = chunk;
    try {
      const jsonChunk = JSON.parse(chunk);
      if (jsonChunk.content) {
        contentToAdd = jsonChunk.content;
      }
    } catch (e) {
      contentToAdd = chunk;
    }
    return contentToAdd;
  }, []);

  const createTextHandler = useCallback((messageId: string, chatResponse: ChatResponse) => {
    return (chunk: string) => {
      const contentToAdd = processTextChunk(chunk);

      setMessages(prev => {
        return prev.map(msg => {
          if (msg.id !== messageId) return msg;

          const currentContent = msg.content || '';
          const newContent = currentContent + contentToAdd;

          return {
            ...msg,
            content: newContent,
            isCallTools: chatResponse.agent_index === 1 ? true : false,
            agentIndex: chatResponse.agent_index === 1 ? 1 : undefined,
            isLoading: false,
            isStreaming: true,
            ...(msg.agentIndex === 0 && !msg.data
              ? { isCallTools: false, agentIndex: undefined }
              : {})
          };
        });
      });
    };
  }, [processTextChunk]);

  const addErrorMessage = useCallback((content: string) => {
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (message.trim() === "" || isProcessingRef.current) return;

    isProcessingRef.current = true;

    const isFirstMessage = !hasStartedChat;
    const newChatId = isFirstMessage ? Date.now().toString() : currentChatId;

    if (isFirstMessage) {
      setHasStartedChat(true);
      setCurrentChatId(newChatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (isFirstMessage) {
      const chatTitle = message.slice(0, 50) + (message.length > 50 ? "..." : "");
      setChatHistory(prev => [
        {
          id: newChatId || Date.now().toString(),
          title: chatTitle,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    setStatus("streaming");
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      createdAt: new Date(),
      isCallTools: false,
      agentIndex: 0,
      isLoading: false,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    const chatResponse: ChatResponse = {
      is_call_tools: false,
      message: "",
      agent_index: 0,
    };

    try {
      await sendChatEvent(
        {
          msg: message,
        },
        {
          onText: (chunk) => {
            createTextHandler(assistantMessage.id, chatResponse)(chunk);
          },
          onThinking: (thinkingText) => {
            console.log("AI thinking:", thinkingText);
          },
          onAction: (actionData) => {
            const { action, params } = actionData;

            const actionToAgentIndex: Record<string, number> = {
              'pet': 2,
              'mint': 3,
              'summon': 4,
              'wearable': 5,
              'call': 6,
              'swap': 7,
              'addLiquidity': 8,
              'removeLiquidity': 9,
            };

            const agentIndex = actionToAgentIndex[action];

            if (agentIndex) {
              updateMessage(assistantMessage.id, {
                isCallTools: true,
                agentIndex: agentIndex,
                data: { [action]: true, ...params },
              });
            }
          },
          onError: (error) => {
            console.error("Stream error:", error);
            addErrorMessage("Network error! Please try again.");
            updateMessage(assistantMessage.id, {
              isLoading: false,
              isStreaming: false,
            });
          },
          onComplete: () => {
            updateMessage(assistantMessage.id, { isStreaming: false });
          },
        }
      );
    } catch (error) {
      console.error("Send message error:", error);
      addErrorMessage("Network error! Please try again.");
      updateMessage(assistantMessage.id, {
        isLoading: false,
        isStreaming: false,
      });
    } finally {
      setStatus("idle");
      isProcessingRef.current = false;
    }
  }, [hasStartedChat, sendChatEvent, createTextHandler, updateMessage, addErrorMessage]);

  const handleSendMessage = () => {
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRegenerate = useCallback(async (messageId: string) => {
    if (isProcessingRef.current) return;

    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    let userMessage: Message | undefined;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        userMessage = messages[i];
        break;
      }
    }

    if (!userMessage) return;

    isProcessingRef.current = true;

    setMessages(prev => prev.slice(0, messageIndex));

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "",
      createdAt: new Date(),
      isCallTools: false,
      agentIndex: 0,
      isLoading: false,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setStatus("streaming");

    const chatResponse: ChatResponse = {
      is_call_tools: false,
      message: "",
      agent_index: 0,
    };

    try {
      await sendChatEvent(
        {
          msg: userMessage.content,
        },
        {
          onText: (chunk) => {
            createTextHandler(assistantMessage.id, chatResponse)(chunk);
          },
          onThinking: (thinkingText) => {
            console.log("AI thinking:", thinkingText);
          },
          onAction: (actionData) => {
            const { action, params } = actionData;

            const actionToAgentIndex: Record<string, number> = {
              'pet': 2,
              'mint': 3,
              'summon': 4,
              'wearable': 5,
              'call': 6,
              'swap': 7,
              'addLiquidity': 8,
              'removeLiquidity': 9,
            };

            const agentIndex = actionToAgentIndex[action];

            if (agentIndex) {
              updateMessage(assistantMessage.id, {
                isCallTools: true,
                agentIndex: agentIndex,
                data: { [action]: true, ...params },
              });
            }
          },
          onError: (error) => {
            console.error("Stream error:", error);
            addErrorMessage("Network error! Please try again.");
            updateMessage(assistantMessage.id, {
              isLoading: false,
              isStreaming: false,
            });
          },
          onComplete: () => {
            updateMessage(assistantMessage.id, { isStreaming: false });
          },
        }
      );
    } catch (error) {
      console.error("Regenerate error:", error);
      addErrorMessage("Network error! Please try again.");
      updateMessage(assistantMessage.id, {
        isLoading: false,
        isStreaming: false,
      });
    } finally {
      setStatus("idle");
      isProcessingRef.current = false;
    }
  }, [messages, sendChatEvent, createTextHandler, updateMessage, addErrorMessage]);

  const handleSummonSuccess = useCallback((
    tokenId: string,
    txHash: string,
    pusName: string,
    pusStory: string
  ) => {
    setMessages((prev) => 
      prev.map(msg => 
        msg.isCallTools && msg.agentIndex === 4 
          ? { ...msg, data: { ...msg.data, summonSuccess: { tokenId, txHash, pusName, pusStory } } }
          : msg
      )
    );
  }, []);

  const handleMintSuccess = useCallback((txHash: string) => {
    setMessages((prev) => 
      prev.map(msg => 
        msg.isCallTools && msg.agentIndex === 3 
          ? { ...msg, data: { ...msg.data, mintSuccess: { txHash } } }
          : msg
      )
    );
  }, []);

  const handlePetSuccess = useCallback((tokenId: string, txHash: string) => {
    setMessages((prev) => 
      prev.map(msg => 
        msg.isCallTools && msg.agentIndex === 2 
          ? { ...msg, data: { ...msg.data, petSuccess: { tokenId, txHash } } }
          : msg
      )
    );
  }, []);

  const handleWearableSuccess = useCallback((tokenId: string, txHash: string) => {
    setMessages((prev) => 
      prev.map(msg => 
        msg.isCallTools && msg.agentIndex === 5 
          ? { ...msg, data: { ...msg.data, wearableSuccess: { tokenId, txHash } } }
          : msg
      )
    );
  }, []);

  const handleMintDataReady = useCallback((messageId: string, mintData: { txHash: string }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: `Successfully minted Pharos NFT! Your transaction is confirmed.` }
          : msg
      )
    );
  }, []);

  const handlePetDataReady = useCallback((messageId: string, petData: { tokenId: string, txHash: string }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: `Successfully petted Gotchi #${petData.tokenId}! Your Gotchi is happy.` }
          : msg
      )
    );
  }, []);

  const handleSummonDataReady = useCallback((messageId: string, summonData: { tokenId: string, txHash: string, pusName: string, pusStory: string }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: `Successfully summoned ${summonData.pusName}! Your Gotchipus is ready.` }
          : msg
      )
    );
  }, []);

  const handleWearableDataReady = useCallback((messageId: string, wearableData: { tokenId: string, txHash: string }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: `Successfully equipped Gotchi #${wearableData.tokenId}! Your Gotchi is ready.` }
          : msg
      )
    );
  }, []);

  const handleCallSuccess = useCallback((tokenId: string, txHash: string) => {

    setMessages((prev) => 
      prev.map(msg => 
        msg.isCallTools && msg.agentIndex === 6 
          ? { ...msg, data: { ...msg.data, callSuccess: { tokenId, txHash } } }
          : msg
      )
    );
  }, []);

  const handleCallDataReady = useCallback((messageId: string, callData: { tokenId: string, txHash: string }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: `Successfully called ${callData.tokenId}! Your Gotchi is ready.` }
          : msg
      )
    );
  }, []);

  if (!walletStore.isConnected) {
    return (
      <div className={`h-full flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center flex flex-col items-center">
          <div className={`mb-4 ${isMobile ? 'mb-2' : ''}`}>
            <Image src="/not-any.png" alt="No NFTs" width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} />
          </div>
          <h3 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>No Wallet Connected</h3>
          <p className={`text-[#000080] mb-4 ${isMobile ? 'text-sm' : ''}`}>Please connect your wallet to continue.</p>
          <div
            className={`text-sm flex items-center justify-center bg-[#c0c0c0] border border-[#808080] shadow-win98-outer active:shadow-inner ${isMobile ? 'h-8' : 'h-10'}`}
          >
            <CustomConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingBalance) {
    return (
      <div className="h-full flex items-center justify-center bg-[#c0c0c0]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#000080] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#000080] font-medium">Checking your Gotchis...</p>
        </div>
      </div>
    );
  }

  if (!hasNFT) {
    return (
      <div className={`h-full flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center flex flex-col items-center max-w-md">
          <div className={`mb-4 ${isMobile ? 'mb-2' : ''}`}>
            <Image src="/not-any.png" alt="No Gotchis" width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} />
          </div>
          <h3 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>No Gotchipus Found</h3>
          <p className={`text-[#000080] mb-4 ${isMobile ? 'text-sm' : ''} text-center`}>
            You need to own at least one Gotchipus NFT to use the AI assistant.
            Each Gotchipus has its unique personality and abilities!
          </p>
          <div className="flex gap-2">
            <a
              href="/gotchi"
              className="px-4 py-2 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer hover:bg-white active:shadow-win98-inner text-sm"
            >
              View All Gotchis
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#c0c0c0] h-full flex flex-col relative">
      <div className="flex gap-0 flex-1 overflow-hidden">
        {!isMobile && (
          <ChatSidebar
            onNewChat={handleBackToInput}
            chatHistory={chatHistory}
            onSelectChat={handleSelectChat}
            currentChatId={currentChatId}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-[#c0c0c0]">
          <ChatHeader />

          {!hasStartedChat ? (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-3 py-6">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold mb-2 text-[#000080]">
                  Hello, GOTCHI
                </h2>
                <p className="text-[#808080] text-sm">
                  Ready to trade, summon, or play your Gotchi? Just ask me!
                </p>
              </div>

              <div className="mb-6">
                <ActionCards
                  onQuestionClick={sendMessage}
                  userName="GOTCHI"
                />
              </div>

              <div className="max-w-2xl w-full px-4">
                <div className="mb-2">
                  <ConversationInput
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onSend={handleSendMessage}
                    inputRef={inputRef}
                    isLoading={status === "streaming"}
                  />
                </div>

                <QuickQuestions onQuestionClick={sendMessage} />
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-hidden p-3">
                <div className="h-full max-w-2xl mx-auto ">
                  <ChatInterface
                    messages={messages}
                    chatContainerRef={chatContainerRef}
                    messagesEndRef={messagesEndRef}
                    status={status}
                    onSummonSuccess={handleSummonSuccess}
                    onSummonDataReady={handleSummonDataReady}
                    onMintDataReady={handleMintDataReady}
                    onPetDataReady={handlePetDataReady}
                    onMintSuccess={handleMintSuccess}
                    onPetSuccess={handlePetSuccess}
                    onWearableSuccess={handleWearableSuccess}
                    onWearableDataReady={handleWearableDataReady}
                    onCallSuccess={handleCallSuccess}
                    onCallDataReady={handleCallDataReady}
                    onRegenerate={handleRegenerate}
                  />
                </div>
              </div>

              <div className="p-3">
                <div className="max-w-2xl mx-auto">
                  <ConversationInput
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onSend={handleSendMessage}
                    inputRef={inputRef}
                    isLoading={status === "streaming"}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default AIContent;