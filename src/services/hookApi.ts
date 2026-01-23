import {
  ApiResponse,
  HookApiData,
  CreateHookRequest,
  GetHooksRequest,
  apiDataToHook,
} from '@src/types/hook-api';
import { Hook } from '@src/types/hook';

/**
 * Hook API Service
 * Handles all API calls related to hooks
 */
export const hookApi = {
  /**
   * Get all hooks with pagination
   * @param page - Page number (0-indexed), 30 items per page
   */
  async getAllHooks(page: number = 0): Promise<Hook[]> {
    try {
      const response = await fetch('/api/hooks/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hooks: ${response.status}`);
      }

      const data: ApiResponse<HookApiData[]> = await response.json();

      if (data.code !== 0) {
        throw new Error('Backend returned error code');
      }

      // Convert backend data to frontend Hook type
      return data.data.map(apiDataToHook);
    } catch (error) {
      console.error('Error fetching hooks:', error);
      throw error;
    }
  },

  /**
   * Create a new hook
   * @param hookData - Hook creation data
   */
  async createHook(hookData: CreateHookRequest): Promise<Hook> {
    try {
      const response = await fetch('/api/hooks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hookData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create hook: ${response.status}`);
      }

      const data: ApiResponse<HookApiData[]> = await response.json();

      if (data.code !== 0 || !data.data || data.data.length === 0) {
        throw new Error('Backend returned error or no data');
      }

      // Convert backend data to frontend Hook type
      return apiDataToHook(data.data[0]);
    } catch (error) {
      console.error('Error creating hook:', error);
      throw error;
    }
  },

  /**
   * Load all hooks with pagination support (loads all pages)
   * Useful for initial load or when you need complete dataset
   */
  async loadAllHooks(): Promise<Hook[]> {
    const allHooks: Hook[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const hooks = await this.getAllHooks(page);

      if (hooks.length === 0) {
        hasMore = false;
      } else {
        allHooks.push(...hooks);

        // If we got less than 30 items, we've reached the end
        if (hooks.length < 30) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return allHooks;
  },
};

export default hookApi;
