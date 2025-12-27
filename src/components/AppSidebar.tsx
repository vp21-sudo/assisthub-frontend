import { useState } from 'react';
import type { Thread } from '@/services/api';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, MessageSquare, Sparkles, X } from 'lucide-react';

interface AppSidebarProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
  onDeleteThread: (threadId: string) => void;
}

export function AppSidebar({
  threads,
  selectedThreadId,
  onSelectThread,
  onCreateThread,
  onDeleteThread,
}: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);

  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
    // Close sidebar on mobile when thread is selected
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleCreateThread = () => {
    onCreateThread();
    // Close sidebar on mobile when new thread is created
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    setThreadToDelete(threadId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (threadToDelete) {
      onDeleteThread(threadToDelete);
      setDeleteDialogOpen(false);
      setThreadToDelete(null);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="AssistHub Support">
              <a href="#" className="flex items-center gap-2 py-7">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AssistHub</span>
                  <span className="truncate text-xs text-muted-foreground">Support</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {threads.length === 0 ? (
                <SidebarMenuItem>
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No threads yet.</p>
                    <p className="text-xs mt-1">Create a new one to get started!</p>
                  </div>
                </SidebarMenuItem>
              ) : (
                threads.map((thread) => (
                  <SidebarMenuItem key={thread.id} className="">
                    <SidebarMenuButton
                      onClick={() => handleSelectThread(thread.id)}
                      isActive={selectedThreadId === thread.id}
                      tooltip={thread.title || `Thread ${thread.id.slice(0, 8)}`}
                      className=' h-10'
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span className="truncate text-left flex-1 min-w-0 line-clamp-1">
                        {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                      </span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={(e) => handleDeleteClick(e, thread.id)}
                      showOnHover
                    >
                      <X className="h-4 w-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleCreateThread}
              tooltip="New Thread"
              size="lg"
              variant="default"
            >
              <Plus className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">New Thread</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Thread</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this thread? This action cannot be undone and all messages in this thread will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}

