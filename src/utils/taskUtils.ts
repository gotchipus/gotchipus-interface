export const checkAndCompleteTask = async (address: string, taskId: number) => {
    if (!address || typeof taskId !== 'number') {
      return false;
    }
  
    try {
      const isCompletedResponse = await fetch('/api/tasks/is_task_completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, task_id: taskId }),
      });
  
      if (!isCompletedResponse.ok) {
        return false;
      }
  
      const isCompletedData = await isCompletedResponse.json();
  
      if (isCompletedData.code === 0 && isCompletedData.data === true) {
        return false;
      }
  
      const completeResponse = await fetch('/api/tasks/complete-select-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, task_id: taskId }),
      });
  
      if (!completeResponse.ok) {
        return false;
      }
  
      const completeData = await completeResponse.json();
      
      if (completeData.code === 0) {
          return true;
      } else {
          return false;
      }
  
    } catch (error) {
      console.error(`Error processing task (ID: ${taskId}):`, error);
      return false;
    }
  };