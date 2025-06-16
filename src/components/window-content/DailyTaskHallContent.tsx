'use client'

import Image from 'next/image'
import React, { useState, useEffect, useMemo } from 'react'
import { Win98Loading } from "@/components/ui/win98-loading"
import { useStores } from "@stores/context"
import { useCheckIn } from '@/hooks/useSign'

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

const taskTypes = [
  {id: 'all', name: 'All'},
  {id: 'social', name: 'Social'},
  {id: 'onChain', name: 'On-Chain'},
  {id: 'community', name: 'Community'},
  {id: 'specialEvent', name: 'Special Event'}
]

const DailyTaskHallContent = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all')
  const [userInfo, setUserInfo] = useState({
    id: 0,
    level: 0,
    xp: 0,
    daily_check_in: 0,
    latest_check_in_at: 0,
    badges: [] as any[]
  });
  
  const { walletStore } = useStores()

  const experienceToNextLevel = 100 * (userInfo.level ** 1.5) || 100;
  const timeNow = Math.floor(Date.now() / 1000);
  const checkedInToday = timeNow < userInfo.latest_check_in_at + 86400;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  const fetchAllData = React.useCallback(async () => {
    if (!walletStore.address) {
      setLoading(false);
      return;
    } 
    
    try {
      let completedTaskIds = new Set<number>();

      const infoResponse = await fetch("/api/tasks/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "address": walletStore.address })
      });

      if (infoResponse.ok) {
        const infoResult = await infoResponse.json();
        if (infoResult.code === 0 && infoResult.data) {
          const userData = infoResult.data;
          setUserInfo(userData);

          const completedTasksResponse = await fetch("/api/tasks/task-completed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "user_id": userData.id })
          });

          if (completedTasksResponse.ok) {
            const completedTasksResult = await completedTasksResponse.json();
            if (completedTasksResult.code === 0 && completedTasksResult.data) {
              completedTaskIds = new Set(completedTasksResult.data.map((task: Task) => task.task_id));
            }
          }
        }
      }

      const allTasksResponse = await fetch("/api/tasks/allTasks");
      if (!allTasksResponse.ok) {
        throw new Error('Failed to fetch the main task list.');
      }
      const allTasksResult = await allTasksResponse.json();
      if (allTasksResult.code !== 0) {
          throw new Error(`Task list API returned an error: ${allTasksResult.status}`);
      }

      const finalTasks = allTasksResult.data.map((task: Task) => ({
        ...task,
        completed: completedTaskIds.has(task.task_id)
      }));

      setTasks(finalTasks);

    } catch (error) {
      console.error("An error occurred during data fetching:", error);
    }
  }, [walletStore.address]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);


  const { checkIn, isCheckingIn, error: checkInError } = useCheckIn({
    onSuccess: (data) => {      
      if (data.code === 0 && data.status === "success" && data.data === true) {
        const handleCheckIn = async () => {
          try {
            const payload = {
              "address": walletStore.address,
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


  const filteredTasks = useMemo(() => {
    if (selectedTaskType === 'all') {
      return tasks;
    }
    return tasks?.filter(task => task.task_type === selectedTaskType);
  }, [tasks, selectedTaskType]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Win98Loading text="Loading Task Hall..." />
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex gap-4 flex-1">
        <div className="w-1/3 flex flex-col gap-4">
          <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] p-3">
            <h2 className="text-black font-bold mb-2">Experience & Level</h2>
            
            <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2 mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs">Level {userInfo.level}</span>
                <span className="text-xs">{userInfo.xp} / {experienceToNextLevel} XP</span>
              </div>
              <div className="w-full h-4 border border-[#808080] shadow-win98-outer bg-[#d4d0c8] overflow-hidden">
                <div 
                  className="h-full bg-[#000080] transition-all duration-200 ease-linear" 
                  style={{ width: `${(userInfo.xp / experienceToNextLevel) * 100}%` }} 
                />
              </div>
            </div>
            
            <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2">
              <div className="text-xs mb-1">Honor Badges:</div>
              {userInfo.badges.length > 0 ? (
                userInfo.badges.map((badge) => (
                  <Image src={badge.url} key={badge.name} alt="Honor Badge" width={50} height={50} />
                ))
              ) : (
                <div className="text-xs">No badges yet</div>
              )}
            </div>
          </div>
          
          <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] p-3">
            <h2 className="text-black font-bold mb-2">Daily Check-in</h2>
            
            <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-3 mb-2">
              <div className="text-xs mb-2">Check in daily to earn rewards!</div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square border border-[#808080] shadow-win98-inner flex items-center justify-center text-xs ${
                      index < userInfo.daily_check_in ? 'bg-[#000080] text-white' : 'bg-[#d4d0c8]'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              
              <div className="text-xs mb-2">
                <span className="font-bold">Today's Reward:</span> 10 XP
              </div>
              
              <button 
                className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm py-1 hover:bg-[#c0c0c0] flex items-center justify-center ${
                  checkedInToday ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={checkIn}
                disabled={checkedInToday}
              >
                {checkedInToday ? 'Checked In Today' : 'Check In'}
              </button>
            </div>
            
            <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2">
              <div className="text-xs font-bold mb-1">Check-in Streak: {userInfo.daily_check_in} days</div>
              <div className="text-xs">Keep checking in to earn more rewards!</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] p-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-black font-bold">Available Tasks</h2>
            
            <div className="flex gap-1">
              {taskTypes.map(type => (
                <button 
                  className={`px-2 py-1 border-2 border-[#808080] shadow-win98-outer text-xs ${
                  selectedTaskType === type.id ? 'bg-[#000080] text-white' : 'bg-[#d4d0c8] hover:bg-[#c0c0c0] hover:text-black'
                }`}
                onClick={() => setSelectedTaskType(type.id)}
                key={type.id}
              >
                {type.name}
              </button>
                ))}
              </div>
            </div>
          
          <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2 h-5/6 overflow-y-auto">
            {filteredTasks?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm">
                No tasks available in this category
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTasks?.map(task => (
                  <div 
                    key={task.task_id} 
                    className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] p-2 ${
                      task.completed ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <div 
                          className={`w-4 h-4 border border-[#808080] shadow-win98-inner mr-2 flex items-center justify-center ${
                            task.completed ? 'bg-[#000080]' : 'bg-white'
                          }`}
                        >
                          {task.completed && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold">{task.task_title}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-[#000080] text-white px-2 py-0.5">
                        +{task.xp_reward} XP
                      </span>
                    </div>
                    
                    <p className="text-xs mb-2 ml-6">{task.task_description}</p>
                    
                    <div className="flex justify-between items-center ml-6">
                      <span className="text-xs text-[#808080]">
                        {task.task_type.charAt(0).toUpperCase() + task.task_type.slice(1)} Task
                      </span>
                      
                      <button 
                        className={`px-3 py-0.5 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] text-xs hover:bg-[#c0c0c0] ${
                          task.completed ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => {}}
                        disabled={task.completed}
                      >
                        {task.completed ? 'Completed' : 'Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyTaskHallContent 