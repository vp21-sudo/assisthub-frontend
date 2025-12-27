const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';


export interface Thread {
  id: string;
  title?: string;
  resourceId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface CreateThreadRequest {
  title?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface CreateThreadResponse {
  thread: Thread;
}

export interface GetThreadsResponse {
  threads: Thread[];
}

export interface GetThreadResponse {
  thread: Thread;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface SendMessageResponse {
  message: Message;
  response: Message;
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const userId = localStorage.getItem('spur_user_id');
  if (!userId) {
    throw new Error('User ID not found. Please set your user ID first.');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface CreateUserResponse {
  userId: string;
}

export const api = {
  // Users
  createUser: async (): Promise<CreateUserResponse> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Threads
  createThread: async (data: CreateThreadRequest): Promise<CreateThreadResponse> => {
    return fetchWithAuth<CreateThreadResponse>('/threads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getThreads: async (): Promise<GetThreadsResponse> => {
    return fetchWithAuth<GetThreadsResponse>('/threads');
  },

  getThread: async (threadId: string): Promise<GetThreadResponse> => {
    return fetchWithAuth<GetThreadResponse>(`/threads/${threadId}`);
  },

  deleteThread: async (threadId: string): Promise<{ success: boolean }> => {
    return fetchWithAuth<{ success: boolean }>(`/threads/${threadId}`, {
      method: 'DELETE',
    });
  },

  // Messages
  getThreadMessages: async (threadId: string): Promise<GetMessagesResponse> => {
    return fetchWithAuth<GetMessagesResponse>(`/threads/${threadId}/messages`);
  },

  sendMessage: async (
    threadId: string,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    return fetchWithAuth<SendMessageResponse>(`/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

