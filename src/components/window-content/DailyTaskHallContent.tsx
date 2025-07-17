'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Win98Loading } from "@/components/ui/win98-loading"
import { useStores } from "@stores/context"
import { useCheckIn } from '@/hooks/useSign'
import TaskList from './tasks/Task'
import { useSearchParams } from 'next/navigation'
import useResponsive from "@/hooks/useResponsive"
import { useAccount } from 'wagmi'

interface Task {
  task_id: number
  task_title: string
  task_description: string
  is_open: string
  task_type: string
  xp_reward: number
  start_at: number
  end_at: number
  reward_type: string
  completed?: boolean
}

interface DailyTaskHallContentProps {
  openWindow: (view: string) => void;
}

const DailyTaskHallContent = ({ openWindow }: DailyTaskHallContentProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [userInfo, setUserInfo] = useState({
    id: 0,
    level: 0,
    xp: 0,
    daily_check_in: 0,
    latest_check_in_at: 0,
    badges: [] as any[]
  });

  const { walletStore } = useStores();
  const searchParams = useSearchParams();
  const isMobile = useResponsive();
  const { address: wagmiAddress } = useAccount();
  
  const currentAddress = wagmiAddress || walletStore.address;

  const experienceToNextLevel = Math.floor(100 * ((userInfo.level + 1) ** 1.5));
  const timeNow = Math.floor(Date.now() / 1000);
  const checkedInToday = timeNow < userInfo.latest_check_in_at + 86400;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  const fetchAllData = React.useCallback(async () => {
    if (!currentAddress) {
      setLoading(false);
      walletStore.setIsTaskRefreshing(false);
      return;
    }

    try {
      const infoResponse = await fetch("/api/tasks/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "address": currentAddress }),
        cache: 'no-store'
      });

      let userData = null;
      if (infoResponse.ok) {
        const infoResult = await infoResponse.json();
        if (infoResult.code === 0 && infoResult.data) {
          userData = infoResult.data;
          setUserInfo(userData);
        }
      }
      if (!userData) {
        setLoading(false);
        walletStore.setIsTaskRefreshing(false);
        return;
      }

      const allTasksResponse = await fetch("/api/tasks/allTasks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: 'no-store'
      });
      if (!allTasksResponse.ok) {
        throw new Error('Failed to fetch the main task list.');
      }
      const allTasksResult = await allTasksResponse.json();
      if (allTasksResult.code !== 0) {
        throw new Error(`Task list API returned an error: ${allTasksResult.status}`);
      }
      const allTasks: Task[] = allTasksResult.data;

      const completedStatus = await Promise.all(
        allTasks.map(async (task) => {
          try {
            const res = await fetch("/api/tasks/task-completed", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ "user_id": userData.id, "task_id": task.task_id }),
              cache: 'no-store'
            });
            if (!res.ok) return false;
            const result = await res.json();
            return result.code === 0 && Array.isArray(result.data) && result.data.length > 0;
          } catch {
            return false;
          }
        })
      );

      const finalTasks = allTasks.map((task, idx) => ({
        ...task,
        completed: completedStatus[idx]
      }));
      setTasks(finalTasks);
      setLoading(false);
      walletStore.setIsTaskRefreshing(false);
    } catch (error) {
      console.error("An error occurred during data fetching:", error);
      setLoading(false);
      walletStore.setIsTaskRefreshing(false);
    }
  }, [currentAddress, walletStore.setIsTaskRefreshing]);

  useEffect(() => {
    const viewParam = searchParams.get('view');
    const windowsParam = searchParams.get('windows');
    const refreshParam = searchParams.get('refresh');
    
    if (!currentAddress) {
      setLoading(false);
      return;
    }
    
    const isDailyTaskHallOpen = viewParam === 'daily-task-hall' || windowsParam?.includes('daily-task-hall');
    const shouldFetchForRefresh = refreshParam && isDailyTaskHallOpen;
    const shouldFetchForTaskRefresh = walletStore.isTaskRefreshing;
    const isInitialLoad = !refreshParam && !walletStore.isTaskRefreshing;
    
    if (shouldFetchForRefresh || shouldFetchForTaskRefresh || isInitialLoad) {
      setLoading(true);
      fetchAllData();
    }
  }, [currentAddress, walletStore.isTaskRefreshing, searchParams, fetchAllData]);


  const { checkIn, isCheckingIn, error: checkInError } = useCheckIn({
    onSuccess: (data) => {      
      if (data.code === 0 && data.status === "success" && data.data === true) {
        const handleCheckIn = async () => {
          try {
            const payload = {
              "address": currentAddress,
              "event": "check_in"
            };
            const response = await fetch("/api/tasks/checkin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.code === 0 && result.status === "success" && result.data === true) {
              fetchAllData();
            }
          } catch (error) {
            console.error("Error checking in:", error);
          }
        };
        handleCheckIn();
      }
    },
    onError: (error) => {
      console.error("Check-in error:", error);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Win98Loading text={isMobile ? "Loading..." : "Loading Task Hall..."} />
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full gap-4 ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className={`flex gap-4 flex-1 ${isMobile ? 'flex-col' : ''}`}>
        <div className={`flex flex-col gap-4 ${isMobile ? 'w-full' : 'w-1/3'}`}>
          <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] ${isMobile ? 'p-2' : 'p-3'}`}>
            <h2 className={`text-black font-bold mb-2 ${isMobile ? 'text-sm' : ''}`}>Experience & Level</h2>
            
            <div className={`bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2 mb-2 ${isMobile ? 'p-1 mb-1' : ''}`}>
              <div className="flex justify-between mb-1">
                <span className={`${isMobile ? 'text-xs' : 'text-xs'}`}>Level {userInfo.level}</span>
                <span className={`${isMobile ? 'text-xs' : 'text-xs'}`}>{userInfo.xp} / {experienceToNextLevel} XP</span>
              </div>
              <div className="w-full h-4 border border-[#808080] shadow-win98-outer bg-[#d4d0c8] overflow-hidden">
                <div 
                  className="h-full bg-[#000080] transition-all duration-200 ease-linear" 
                  style={{ width: `${(userInfo.xp / experienceToNextLevel) * 100}%` }} 
                />
              </div>
            </div>
            
            <div className={`bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2 ${isMobile ? 'p-1' : ''}`}>
              <div className={`mb-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Honor Badges:</div>
              {userInfo.badges && userInfo.badges.length > 0 ? (
                <div className={`grid gap-1 ${isMobile ? 'grid-cols-10' : 'grid-cols-6'}`}>
                  {userInfo.badges.map((badge) => (
                    <Image 
                      src={badge.url} 
                      key={badge.name} 
                      alt="Honor Badge" 
                      width={isMobile ? 30 : 50} 
                      height={isMobile ? 30 : 50} 
                    />
                  ))}
                </div>
              ) : (
                <div className={`${isMobile ? 'text-xs' : 'text-xs'}`}>No badges yet</div>
              )}
            </div>
          </div>
          
          <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] ${isMobile ? 'p-2' : 'p-3'}`}>
            <h2 className={`text-black font-bold mb-2 ${isMobile ? 'text-sm' : ''}`}>Daily Check-in</h2>
            
            <div className={`bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-3 mb-2 ${isMobile ? 'p-2 mb-1' : ''}`}>
              <div className={`mb-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>Check in daily to earn rewards!</div>
              
              <div className={`grid gap-1 mb-2 ${isMobile ? 'grid-cols-7 gap-0.5' : 'grid-cols-7'}`}>
                {Array.from({ length: 7 }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square border border-[#808080] shadow-win98-inner flex items-center justify-center ${
                      index < userInfo.daily_check_in ? 'bg-[#000080] text-white' : 'bg-[#d4d0c8]'
                    } ${isMobile ? 'text-xs' : 'text-xs'}`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              
              <div className={`mb-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                <span className="font-bold">Today's Reward:</span> 10 XP
              </div>
              
              <button 
                className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center justify-center ${
                  checkedInToday ? 'opacity-50 cursor-not-allowed' : ''
                } ${isMobile ? 'py-1 text-xs' : 'py-1'}`}
                onClick={checkIn}
                disabled={checkedInToday}
              >
                {checkedInToday ? 'Checked In Today' : 'Check In'}
              </button>
            </div>
            
            <div className={`bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2 ${isMobile ? 'p-1' : ''}`}>
              <div className={`font-bold mb-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Check-in Streak: {userInfo.daily_check_in} days</div>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'}`}>Keep checking in to earn more rewards!</div>
            </div>
          </div>
        </div>
        
        <TaskList 
          tasks={tasks} 
          selectedTaskType={selectedTaskType} 
          onTaskTypeChange={setSelectedTaskType} 
          openWindow={openWindow}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}

export default DailyTaskHallContent 