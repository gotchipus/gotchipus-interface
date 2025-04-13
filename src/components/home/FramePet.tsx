"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useWindowSize } from "@/hooks/useWindowSize";

interface FramePetProps {
  initialX?: number;
  initialY?: number;
}

type AnimationState = "idle" | "run" | "jump" | "attack" | "hurt" | "die" | "dash" | "S_attack";

// Define number of frames for each animation state
const ANIMATION_FRAMES: Record<AnimationState, number> = {
  idle: 4,
  run: 4,
  jump: 4,
  attack: 5,
  hurt: 3,
  die: 6,
  dash: 4,
  S_attack: 9,
};

// Define animation duration in milliseconds
const ANIMATION_DURATIONS: Record<AnimationState, number> = {
  idle: 1000,
  run: 800,
  jump: 1000,
  attack: 1200,
  hurt: 1000,
  die: 2000,
  dash: 800,
  S_attack: 1200,
};

// Pet dimensions
const PET_SIZE = {
  width: 240,
  height: 240,
};

// Random action configuration
const RANDOM_ACTIONS = {
  idle: { weight: 3, duration: 2000 }, // Higher weight for idle state
  jump: { weight: 1, duration: 1000 },
  attack: { weight: 1, duration: 1200 },
  dash: { weight: 1, duration: 800 },
  S_attack: { weight: 1, duration: 1200 },
};

// Random messages
const RANDOM_MESSAGES = [
  "Hello!",
  "Nice weather today~",
  "Play with me!",
  "I'm a bit hungry...",
  "I'm bored...",
  "Let me rest~",
  "Don't poke me!",
  "Hehe, got you!",
  "Watch me perform!",
  "I'm sleepy...",
  "Keep going!",
  "Want to be friends?",
  "Am I cute?",
  "Let's play hide and seek!",
  "Don't disturb my sleep!",
];

export default function FramePet({ initialX = 100, initialY = 100 }: FramePetProps) {
  const windowSize = useWindowSize();
  const [state, setState] = useState<AnimationState>("idle");
  const [frame, setFrame] = useState(1);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState(false);
  const petRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout>();
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const messageTimeoutRef = useRef<NodeJS.Timeout>();

  // Get movement boundaries
  const getMoveBounds = () => {
    // Ensure valid window size
    const validWidth = Math.max(windowSize.width, PET_SIZE.width);
    const validHeight = Math.max(windowSize.height, PET_SIZE.height);
    
    return {
      minX: 0,
      minY: 0,
      maxX: validWidth - PET_SIZE.width,
      maxY: validHeight - PET_SIZE.height - 128, // Subtract taskbar height
    };
  };

  // Ensure position stays within boundaries
  const clampPosition = (pos: { x: number; y: number }) => {
    const bounds = getMoveBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, pos.x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, pos.y)),
    };
  };

  // Initialize position to bottom right corner
  useEffect(() => {
    const bounds = getMoveBounds();
    const initialPosition = {
      x: bounds.maxX - 150, // Slightly to the left
      y: bounds.maxY - 50, // Slightly up
    };
    setPosition(clampPosition(initialPosition));
  }, [windowSize]);

  // Handle animation frames
  useEffect(() => {
    const frameCount = ANIMATION_FRAMES[state];
    const interval = setInterval(() => {
      setFrame((prev) => {
        const next = prev + 1;
        return next > frameCount ? 1 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [state]);

  // Get current frame image path
  const getCurrentFrame = () => {
    const frameCount = ANIMATION_FRAMES[state];
    const currentFrame = Math.min(frame, frameCount);
    return `/octopus/images/${state}_${currentFrame}.png`;
  };

  // Play animation
  const playAnimation = (newState: AnimationState, duration?: number) => {
    setState(newState);
    // Clear previous timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    // Set new timeout
    animationTimeoutRef.current = setTimeout(() => {
      setState("idle");
    }, duration || ANIMATION_DURATIONS[newState]);
  };

  // Show random message
  const showRandomMessage = () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    const randomMessage = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
    setMessage(randomMessage);
    setShowMessage(true);
    
    messageTimeoutRef.current = setTimeout(() => {
      setShowMessage(false);
    }, 3000); // Show message for 3 seconds
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Clear previous click timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      setShowMessage(false);
    }

    setIsDragging(true);
    const rect = petRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setState("run");
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPos = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      setPosition(clampPosition(newPos));
      setDirection(e.movementX > 0 ? "right" : "left");
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setState("idle");
    }
  };

  // Handle click
  const handleClick = () => {
    if (!isDragging) {
      playAnimation("attack");
      showRandomMessage();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // Clear timeouts
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [isDragging]);

  // Random action changes
  useEffect(() => {
    if (isDragging) return;

    const getRandomAction = () => {
      const actions = Object.entries(RANDOM_ACTIONS);
      const totalWeight = actions.reduce((sum, [_, { weight }]) => sum + weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const [action, { weight, duration }] of actions) {
        random -= weight;
        if (random <= 0) {
          return { action: action as AnimationState, duration };
        }
      }
      return { action: "idle" as AnimationState, duration: 2000 };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const { action, duration } = getRandomAction();
        playAnimation(action, duration);
        // 30% chance to show message
        if (Math.random() > 0.7) {
          showRandomMessage();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <div
      ref={petRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
        transform: `scaleX(${direction === "left" ? -1 : 1})`,
        transition: "transform 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* Speech bubble */}
      {showMessage && (
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-lg"
          style={{
            minWidth: "120px",
            maxWidth: "200px",
            transform: `translateX(${direction === "left" ? "50%" : "-50%"})`,
          }}
        >
          <div className="text-sm text-gray-800">{message}</div>
          {/* Speech bubble triangle */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-t-8 border-t-white border-l-8 border-l-transparent border-r-8 border-r-transparent"
            style={{
              transform: `translateX(${direction === "left" ? "50%" : "-50%"})`,
            }}
          />
        </div>
      )}
      <div className="relative" style={{ width: PET_SIZE.width, height: PET_SIZE.height }}>
        <Image
          src={getCurrentFrame()}
          alt="Desktop Pet"
          fill
          sizes={`${PET_SIZE.width}px`}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
} 