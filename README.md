# AssistHub Support - Frontend

A modern, responsive single-page AI chat interface for customer support. Built with React, TypeScript, Vite, and shadcn UI components.

## Overview

AssistHub Support is a customer support chat application that provides an intuitive interface for users to interact with an AI-powered customer support agent. The frontend features a clean, modern design with mobile-responsive layout, real-time message handling, and seamless thread management.

## Backend

This frontend application connects to the [Customer Support Backend API](https://github.com/vp21-sudo/customer-support-api), which provides the AI-powered customer support functionality, thread management, and message handling.

## Features

- 🤖 **AI Chat Interface**: Real-time conversation with AI-powered customer support agent
- 💬 **Thread Management**: Create, view, and delete conversation threads
- 📱 **Mobile Responsive**: Fully responsive design with collapsible sidebar for mobile devices
- 🎨 **Modern UI**: Built with shadcn UI components for a polished, professional look
- ✨ **Markdown Support**: AI responses render with full markdown support for rich text formatting
- 🔔 **Toast Notifications**: User-friendly error notifications using Sonner
- 💾 **Local Storage**: Automatic user ID persistence for seamless experience
- 🔄 **Optimistic UI**: Instant message display with loading indicators
- 🎯 **Auto-focus**: Input field automatically focuses after receiving AI responses

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn UI** - Component library
- **Sonner** - Toast notifications
- **react-markdown** - Markdown rendering
- **Lucide React** - Icons
- **Bun** - Runtime and package manager

## Key Features Explained

### Thread Management
- Create new conversation threads
- View all threads in a collapsible sidebar
- Delete threads with confirmation dialog
- Thread selection persists in URL for easy sharing

### Message Handling
- Send messages and receive AI responses
- View complete message history
- Optimistic UI updates for instant feedback
- Markdown rendering for AI responses
- Auto-focus input after receiving responses

### User Authentication
- Automatic anonymous user creation
- User ID persisted in local storage
- Seamless authentication with backend

### Mobile Experience
- Responsive sidebar that collapses to icons on desktop
- Full-width sidebar on mobile that closes when selecting threads
- Touch-friendly interface
- Truncated thread names to prevent layout shifts

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn UI components
│   │   ├── AppSidebar.tsx  # Sidebar with thread list
│   │   ├── MessageList.tsx # Message display component
│   │   ├── MessageInput.tsx # Message input with auto-resize
│   │   └── TypingIndicator.tsx # Loading animation
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # User authentication context
│   ├── services/           # API services
│   │   └── api.ts          # Backend API client
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env                    # Environment variables
└── package.json            # Dependencies
```

## Setup & Installation

### Prerequisites

- **Bun** runtime - Installation: https://bun.sh/docs/installation
- Backend API server running (see [backend repository](https://github.com/vp21-sudo/customer-support-api))

### Installation

1. Install dependencies:
```bash
bun install
```

2. Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Integration

The frontend communicates with the backend API for:
- User creation and management
- Thread CRUD operations
- Message sending and retrieval
- Authentication via user ID

See the [backend repository](https://github.com/vp21-sudo/customer-support-api) for detailed API documentation.
