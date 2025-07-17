'use client'

import React, { useState, useEffect } from 'react'
import { useStores } from "@stores/context"
import Image from 'next/image'

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

interface TaskListProps {
  tasks: Task[]
  selectedTaskType: string
  onTaskTypeChange: (type: string) => void
  openWindow: (view: string) => void
  isMobile?: boolean
}

const taskTypes = [
  {id: 'all', name: 'All'},
  {id: 'social', name: 'Social'},
  {id: 'onChain', name: 'On-Chain'},
  {id: 'community', name: 'Community'},
  {id: 'specialEvent', name: 'Special Event'}
]

const fixedTasks = [
  {
    id: 'follow-x',
    title: 'Follow us on X',
    description: 'Follow our official X account to stay updated with the latest news and announcements.',
    type: 'social',
    xp_reward: 50,
    completed: false,
    icon: '/icons/x-icon.png'
  },
  {
    id: 'join-discord',
    title: 'Join Discord',
    description: 'Join our Discord community to connect with other players and get support.',
    type: 'community',
    xp_reward: 50,
    completed: false,
    icon: '/icons/discord-icon.png'
  }
]

const taskTypeIcons: Record<string, string> = {
  'social': '/icons/pharos-proof.png',
  'onChain': '/icons/pharos-proof.png',
  'community': '/icons/pharos-proof.png',
  'specialEvent': '/icons/pharos-proof.png'
}

const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTaskType, onTaskTypeChange, openWindow, isMobile }) => {
  const [fixedTasksState, setFixedTasksState] = useState(fixedTasks)
  const { walletStore } = useStores()

  useEffect(() => {
    const checkFixedTasksStatus = async () => {
      if (!walletStore.address) return

      try {
        const infoResponse = await fetch("/api/tasks/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "address": walletStore.address }),
          cache: 'no-store'
        })

        if (infoResponse.ok) {
          const infoResult = await infoResponse.json()
          if (infoResult.code === 0 && infoResult.data) {
            const userData = infoResult.data
            
            setFixedTasksState(prevTasks => 
              prevTasks.map(task => {
                if (task.id === 'follow-x' && userData.x) {
                  return { ...task, completed: true }
                }
                if (task.id === 'join-discord' && userData.discord) {
                  return { ...task, completed: true }
                }
                return task
              })
            )
          }
        }
      } catch (error) {
        console.error("Error checking fixed tasks status:", error)
      }
    }

    checkFixedTasksStatus()
  }, [walletStore.address])

  const handleFollowX = () => {
    window.open('https://twitter.com/intent/follow?screen_name=gotchipus', '_blank')
  }

  const handleVerifyX = () => {
    if (!walletStore.address) {
      return
    }
    window.location.href = `/api/connect/x?address=${walletStore.address}`
  }

  const handleJoinDiscord = () => {
    window.open('https://discord.gg/gotchilabs', '_blank')
  }

  const handleVerifyDiscord = () => {
    if (!walletStore.address) {
      return
    }
    window.location.href = `/api/connect/discord?address=${walletStore.address}`
  }

  const filteredTasks = React.useMemo(() => {
    let filtered = selectedTaskType === 'all' ? tasks : tasks?.filter(task => task.task_type === selectedTaskType)
    return filtered || []
  }, [tasks, selectedTaskType])

  const filteredFixedTasks = React.useMemo(() => {
    let filtered = selectedTaskType === 'all' ? fixedTasksState : fixedTasksState.filter(task => task.type === selectedTaskType)
    return filtered
  }, [fixedTasksState, selectedTaskType])

  const mergedTasks = React.useMemo(() => {
    const fixed = filteredFixedTasks.map(task => ({ ...task, _isFixedTask: true }))
    const normal = filteredTasks.map(task => ({ ...task, _isFixedTask: false }))
    return [...fixed, ...normal].sort((a, b) => Number(!!a.completed) - Number(!!b.completed))
  }, [filteredFixedTasks, filteredTasks])

  const getTaskIcon = (taskType: string, isFixedTask: boolean, taskId?: string): string => {
    if (isFixedTask && taskId) {
      if (taskId === 'follow-x') return '/icons/x-icon.png'
      if (taskId === 'join-discord') return '/icons/discord-icon.png'
    }
    return taskTypeIcons[taskType] || '/icons/pharos-proof.png'
  }

  const handleCompleteTask = (taskId: number) => {
    if (!walletStore.address) {
      return;
    }

    const taskViewMap: { [key: number]: string } = {
      4: 'mint',
      5: 'dashboard',
      7: 'dashboard',
    };

    const viewToOpen = taskViewMap[taskId];

    if (viewToOpen) {
      openWindow(viewToOpen);
    }
  };

  const renderTaskItem = (task: any, isFixedTask: boolean = false): JSX.Element => {
    const taskId = isFixedTask ? task.id : task.task_id
    const taskTitle = isFixedTask ? task.title : task.task_title
    const taskDescription = isFixedTask ? task.description : task.task_description
    const taskType = isFixedTask ? task.type : task.task_type
    const taskXpReward = isFixedTask ? task.xp_reward : task.xp_reward
    const isCompleted = isFixedTask ? task.completed : task.completed
    const taskIcon = getTaskIcon(taskType, isFixedTask, taskId)

    return (
      <div 
        key={taskId} 
        className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] ${isMobile ? 'p-1' : 'p-2'} ${
          isCompleted ? 'opacity-70' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center">
            <div 
              className={`border border-[#808080] shadow-win98-inner mr-2 flex items-center justify-center ${
                isCompleted ? 'bg-[#000080]' : 'bg-white'
              } ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
            >
              {isCompleted && (
                <span className={`text-white ${isMobile ? 'text-xs' : 'text-xs'}`}>✓</span>
              )}
            </div>
            <div className="flex items-center">
              <div className={`mr-2 relative ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}>
                <Image 
                  src={taskIcon} 
                  alt={`${taskType} icon`} 
                  width={isMobile ? 16 : 20} 
                  height={isMobile ? 16 : 20} 
                  className="object-contain"
                />
              </div>
              <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>{taskTitle}</span>
            </div>
          </div>
          <span className={`bg-[#000080] text-white px-2 py-0.5 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              +{taskXpReward} XP
          </span>
        </div>
        
        <p className={`mb-2 ${isMobile ? 'text-xs ml-5' : 'text-xs ml-6'}`}>{taskDescription}</p>
        
        <div className={`flex justify-between items-center ${isMobile ? 'ml-5' : 'ml-6'}`}>
          <span className={`text-[#808080] ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {taskType.charAt(0).toUpperCase() + taskType.slice(1)} Task
          </span>
          
          {isFixedTask ? (
            <div className={`flex gap-2 ${isMobile ? 'gap-1' : ''}`}>
              {taskId === 'follow-x' && !isCompleted && (
                <>
                  <button 
                    className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-0.5 text-xs'}`}
                    onClick={handleFollowX}
                  >
                    Follow
                  </button>
                  <button 
                    className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-0.5 text-xs'}`}
                    onClick={handleVerifyX}
                  >
                    Verify
                  </button>
                </>
              )}
              {taskId === 'join-discord' && !isCompleted && (
                <>
                  <button 
                    className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-0.5 text-xs'}`}
                    onClick={handleJoinDiscord}
                  >
                    Join
                  </button>
                  <button 
                    className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-0.5 text-xs'}`}
                    onClick={handleVerifyDiscord}
                  >
                    Verify
                  </button>
                </>
              )}
              {isCompleted && (
                <button 
                  className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] opacity-50 cursor-not-allowed ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-0.5 text-xs'}`}
                  disabled
                >
                  Completed
                </button>
              )}
            </div>
          ) : (
            <button 
              className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] ${
                isCompleted ? 'opacity-50 cursor-not-allowed' : ''
              } ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-0.5 text-xs'}`}
              onClick={() => handleCompleteTask(taskId)}
              disabled={isCompleted}
            >
              {isCompleted ? 'Completed' : 'Complete'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] ${isMobile ? 'p-2' : 'p-3'}`}>
      <div className={`flex justify-between items-center mb-3 ${isMobile ? 'mb-2 flex-col gap-2' : ''}`}>
        <h2 className={`text-black font-bold ${isMobile ? 'text-sm' : ''}`}>Available Tasks</h2>
        
        <div className={`flex gap-1 ${isMobile ? 'flex-wrap justify-center' : ''}`}>
          {taskTypes.map(type => (
            <button 
              className={`border-2 border-[#808080] shadow-win98-outer ${
              selectedTaskType === type.id ? 'bg-[#000080] text-white' : 'bg-[#d4d0c8] hover:bg-[#c0c0c0] hover:text-black'
            } ${isMobile ? 'px-1 py-0.5 text-xs' : 'px-2 py-1 text-xs'}`}
              onClick={() => onTaskTypeChange(type.id)}
              key={type.id}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
    
      <div className={`bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2 h-5/6 overflow-y-auto ${isMobile ? 'p-1' : ''}`}>
        {mergedTasks.length === 0 ? (
          <div className={`flex items-center justify-center h-full ${isMobile ? 'text-xs' : 'text-sm'}`}>
            No tasks available in this category
          </div>
        ) : (
          <div className={`space-y-2 ${isMobile ? 'space-y-1' : ''}`}>
            {mergedTasks.map(task => renderTaskItem(task, task._isFixedTask))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskList
