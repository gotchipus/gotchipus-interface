"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { WelcomeScreen, ChatInterface, Message } from "./ai";
import { ChatResponse } from "./ai/types";
import useChat from "@/hooks/useChat";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { CustomConnectButton } from "../footer/CustomConnectButton";
import useResponsive from "@/src/hooks/useResponsive";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { send: sendChatEvent } = useChat();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasStartedChat]);

  useEffect(() => {
    if (hasStartedChat && inputRef.current && status === "idle") {
      inputRef.current.focus();
    }
  }, [hasStartedChat, status]);

  useEffect(() => {
    return () => {
      streamingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  const handleBackToInput = () => {
    streamingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    streamingTimeoutsRef.current = [];
    setProcessedSummonIds(new Set());
    
    setHasStartedChat(false);
    setInput("");
    setMessages([
      {
        id: "system",
        role: "system",
        content: "You are Gotchipus, an AI assistant.",
      },
    ]);
    setStatus("idle");
    isProcessingRef.current = false;
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
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

  const formatTextChunk = useCallback((prevContent: string, contentToAdd: string) => {
    if (prevContent && contentToAdd && !prevContent.endsWith(' ') && !contentToAdd.startsWith(' ')) {
      if (!/^[.,;:!?\-\n]/.test(contentToAdd) && !/[\n]$/.test(prevContent)) {
        return ' ' + contentToAdd;
      }
    }
    return contentToAdd;
  }, []);

  const createTextHandler = useCallback((messageId: string, chatResponse: ChatResponse) => {
    return (chunk: string) => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id !== messageId) return msg;
          const prevContent = msg.content || '';
          const contentToAdd = processTextChunk(chunk);
          const formattedChunk = formatTextChunk(prevContent, contentToAdd);
          
          return {
            ...msg,
            content: prevContent + formattedChunk,
            isCallTools: chatResponse.agent_index === 1 ? true : false,
            agentIndex: chatResponse.agent_index === 1 ? 1 : undefined,
            isLoading: false,
            isStreaming: true,
            ...(msg.agentIndex === 0 && !msg.data
              ? { isCallTools: false, agentIndex: undefined }
              : {})
          };
        })
      );
    };
  }, [processTextChunk, formatTextChunk]);

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

    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus("streaming");
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (response.ok) {
        const chatResponse: ChatResponse = await response.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: (chatResponse.is_call_tools && chatResponse.agent_index !== 1 && chatResponse.agent_index !== 0) ? chatResponse.message : "",
          createdAt: new Date(),
          isCallTools: chatResponse.is_call_tools,
          agentIndex: chatResponse.agent_index,
          isLoading: !chatResponse.is_call_tools || (chatResponse.is_call_tools && chatResponse.agent_index === 1),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (!chatResponse.is_call_tools || (chatResponse.is_call_tools && chatResponse.agent_index === 1)) {
          try {
            await sendChatEvent(
              {
                query: message,
                is_call_tools: chatResponse.is_call_tools,
                agent_index: chatResponse.agent_index || 0,
                message: chatResponse.message,
              },
              {
                onText: createTextHandler(assistantMessage.id, chatResponse),
                onError: (error) => {
                  updateMessage(assistantMessage.id, {
                    content: chatResponse.message,
                    isCallTools: chatResponse.agent_index === 1 ? true : false,
                    agentIndex: chatResponse.agent_index === 1 ? 1 : undefined,
                    isLoading: false,
                    isStreaming: false,
                  });
                },
                onComplete: () => {
                  updateMessage(assistantMessage.id, { isStreaming: false });
                },
              }
            );
          } catch (textError) {
            updateMessage(assistantMessage.id, {
              content: chatResponse.message,
              isCallTools: chatResponse.agent_index === 1 ? true : false,
              agentIndex: chatResponse.agent_index === 1 ? 1 : undefined,
              isLoading: false,
              isStreaming: false,
            });
          }
        } else if (chatResponse.is_call_tools && chatResponse.agent_index >= 2 && chatResponse.agent_index <= 9) {
          const toolData = getToolData(chatResponse.agent_index);
          if (toolData) {
            updateMessage(assistantMessage.id, { data: toolData });
          }
        } else if (chatResponse.is_call_tools) {
          try {
            await sendChatEvent(
              {
                query: message,
                is_call_tools: true,
                agent_index: chatResponse.agent_index,
                message: chatResponse.message,
              },
              {
                onData: (data) => {
                  const poolData = data.data || data;
                  updateMessage(assistantMessage.id, { data: poolData });
                },
                onText: createTextHandler(assistantMessage.id, chatResponse),
                onError: (error) => {
                  console.error("Tool call error:", error);
                },
                onComplete: () => {
                  updateMessage(assistantMessage.id, { isStreaming: false });
                },
              }
            );
          } catch (toolError) {
            console.error("Tool call failed:", toolError);
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        addErrorMessage(errorData.error || "Network error! Please try again.");
      }
    } catch (error) {
      addErrorMessage("Network error! Please try again.");
    } finally {
      setStatus("idle");
      isProcessingRef.current = false;
    }
  }, [hasStartedChat, sendChatEvent, createTextHandler, updateMessage, getToolData, addErrorMessage]);

  const handleSendMessage = () => {
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSummonSuccess = useCallback(async (
    tokenId: string,
    txHash: string,
    pusName: string,
    pusStory: string
  ) => {
    const summonDataMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "",
      createdAt: new Date(),
      data: {
        summonSuccess: {
          tokenId,
          txHash,
          pusName,
          pusStory
        }
      }
    };

    setMessages((prev) => {
      const filteredMessages = prev.filter(msg => !msg.data?.summon);
      return [...filteredMessages, summonDataMessage];
    });
  }, []);

  const [processedSummonIds, setProcessedSummonIds] = useState<Set<string>>(new Set());
  const streamingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const handleDataReady = useCallback(async (
    messageId: string, 
    config: {
      query: string;
      agentIndex: number;
      message: string;
    }
  ) => {
    if (processedSummonIds.has(messageId)) {
      return;
    }

    setProcessedSummonIds(prev => {
      const newSet = new Set(prev);
      newSet.add(messageId);
      return newSet;
    });

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      createdAt: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      await sendChatEvent(
        {
          query: config.query,
          is_call_tools: true,
          agent_index: config.agentIndex,
          message: config.message,
        },
        {
          onText: (chunk) => {
            setMessages(prev =>
              prev.map(msg => {
                if (msg.id !== loadingMessage.id) return msg;
                const prevContent = msg.content || '';
                
                let formattedChunk = chunk;
                if (prevContent && chunk && !prevContent.endsWith(' ') && !chunk.startsWith(' ')) {
                  if (!/^[.,;:!?\-\n]/.test(chunk) && !/[\n]$/.test(prevContent)) {
                    formattedChunk = ' ' + chunk;
                  }
                }
                
                return {
                  ...msg,
                  content: prevContent + formattedChunk,
                  isLoading: false,
                  isStreaming: true,
                };
              })
            );
          },
          onError: (error) => {
            console.error("Failed to call intent API:", error);
            setMessages(prev =>
              prev.map(msg => {
                if (msg.id !== loadingMessage.id) return msg;
                return {
                  ...msg,
                  content: config.message,
                  isLoading: false,
                  isStreaming: false,
                };
              })
            );
          },
          onComplete: () => {
            setMessages(prev =>
              prev.map(msg => {
                if (msg.id !== loadingMessage.id) return msg;
                return {
                  ...msg,
                  isStreaming: false,
                };
              })
            );
          },
        }
      );
    } catch (error) {
      console.error("Failed to call intent API:", error);
      
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id !== loadingMessage.id) return msg;
          return {
            ...msg,
            content: config.message,
            isLoading: false,
            isStreaming: false,
          };
        })
      );
    }
  }, [processedSummonIds, sendChatEvent]);

  const handleMintDataReady = useCallback(async (messageId: string, mintData: { txHash: string }) => {
    await handleDataReady(messageId, {
      query: `Successfully minted Pharos NFT! Transaction hash: ${mintData.txHash}`,
      agentIndex: 3,
      message: `Successfully minted Pharos NFT! Your transaction is confirmed.`,
    });
  }, [handleDataReady]);

  const handlePetDataReady = useCallback(async (messageId: string, petData: { tokenId: string, txHash: string }) => {
    await handleDataReady(messageId, {
      query: `Successfully petted Gotchi #${petData.tokenId}! Transaction hash: ${petData.txHash}`,
      agentIndex: 2,
      message: `Successfully petted Gotchi #${petData.tokenId}! Your Gotchi is happy.`,
    });
  }, [handleDataReady]);

  const handleSummonDataReady = useCallback(async (messageId: string, summonData: { tokenId: string, txHash: string, pusName: string, pusStory: string }) => {
    await handleDataReady(messageId, {
      query: `Successfully summoned ${summonData.tokenId}! Summon ${summonData.pusName} with ${summonData.pusStory}`,
      agentIndex: 4,
      message: `Successfully summoned ${summonData.pusName}! Your Gotchipus is ready.`,
    });
  }, [handleDataReady]);


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

  return (
    <div className="bg-[#c0c0c0] w-full h-full">
      {!hasStartedChat ? (
        <WelcomeScreen
          input={input}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSendMessage={handleSendMessage}
          inputRef={inputRef}
          isDisabled={status === "streaming"}
          onQuestionClick={sendMessage}
        />
      ) : (
        <ChatInterface
          messages={messages}
          input={input}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSendMessage={handleSendMessage}
          onBackClick={handleBackToInput}
          inputRef={inputRef}
          chatContainerRef={chatContainerRef}
          messagesEndRef={messagesEndRef}
          isDisabled={status === "streaming"}
          status={status}
          onSummonSuccess={handleSummonSuccess}
          onSummonDataReady={handleSummonDataReady}
          onMintDataReady={handleMintDataReady}
          onPetDataReady={handlePetDataReady}
        />
      )}
    </div>
  );
});

export default AIContent;