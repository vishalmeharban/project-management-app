export const INITIAL_BOARDS = [
  {
    id: "board-1",
    title: "Sprint Alpha - Product Launch 🚀",
    description: "Core features & release milestones for the Q1 launch",
    category: "Engineering",
    columns: {
      "col-1": {
        id: "col-1",
        title: "To Do",
        color: "#6366f1", // indigo
        taskIds: ["task-1", "task-2"],
      },
      "col-2": {
        id: "col-2",
        title: "In Progress",
        color: "#f59e0b", // amber
        taskIds: ["task-3", "task-4"],
      },
      "col-3": {
        id: "col-3",
        title: "Under Review",
        color: "#8b5cf6", // purple
        taskIds: ["task-5"],
      },
      "col-4": {
        id: "col-4",
        title: "Completed",
        color: "#10b981", // emerald
        taskIds: ["task-6"],
      },
    },
    columnOrder: ["col-1", "col-2", "col-3", "col-4"],
  },
  {
    id: "board-2",
    title: "Marketing & Growth 📈",
    description: "Social outreach, SEO campaigns and brand awareness",
    category: "Marketing",
    columns: {
      "col-m-1": {
        id: "col-m-1",
        title: "Ideas & Backlog",
        color: "#06b6d4",
        taskIds: ["task-7"],
      },
      "col-m-2": {
        id: "col-m-2",
        title: "In Progress",
        color: "#f59e0b",
        taskIds: ["task-8"],
      },
      "col-m-3": {
        id: "col-m-3",
        title: "Published",
        color: "#10b981",
        taskIds: [],
      },
    },
    columnOrder: ["col-m-1", "col-m-2", "col-m-3"],
  },
];

export const INITIAL_TASKS = {
  "task-1": {
    id: "task-1",
    boardId: "board-1",
    title: "Implement Dark Mode & Theme Toggle",
    description: "Persist user theme preference in localStorage and support smooth CSS transitions.",
    priority: "high",
    tags: ["UI/UX", "Frontend"],
    dueDate: "2026-11-10",
    assignee: {
      name: "Sophia Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 2,
    attachmentsCount: 1,
    subtasks: [
      { id: "sub-1", text: "Create Redux slice for theme", completed: true },
      { id: "sub-2", text: "Add smooth CSS variables", completed: false },
    ],
    comments: [
      {
        id: "comm-1",
        author: {
          name: "Marcus Ray",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        },
        text: "Make sure theme preference persists across browser refreshes.",
        createdAt: "2026-11-01T10:30:00.000Z",
      },
      {
        id: "comm-2",
        author: {
          name: "Sophia Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
        },
        text: "Added smooth CSS transition to prevent sudden flicker on toggle.",
        createdAt: "2026-11-01T11:45:00.000Z",
      },
    ],
    activity: [
      { id: "act-1", text: "Task created by Sophia Chen", createdAt: "2026-10-30T09:00:00.000Z", type: "create" },
      { id: "act-2", text: "Priority set to high", createdAt: "2026-10-30T09:05:00.000Z", type: "priority" },
      { id: "act-3", text: "Marcus Ray added a comment", createdAt: "2026-11-01T10:30:00.000Z", type: "comment" },
    ],
  },
  "task-2": {
    id: "task-2",
    boardId: "board-1",
    title: "Integrate OAuth 2.0 Auth Flow",
    description: "Set up Google & GitHub authentication with secure JWT refresh tokens.",
    priority: "urgent",
    tags: ["Security", "Backend"],
    dueDate: "2026-11-08",
    assignee: {
      name: "Marcus Ray",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 1,
    attachmentsCount: 3,
    subtasks: [
      { id: "sub-3", text: "Configure Auth0 / NextAuth", completed: true },
      { id: "sub-4", text: "Test session expiration handler", completed: false },
    ],
    comments: [
      {
        id: "comm-3",
        author: {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
        },
        text: "JWT refresh token rotation is configured in staging. Needs QA pass.",
        createdAt: "2026-11-02T08:15:00.000Z",
      },
    ],
    activity: [
      { id: "act-4", text: "Task created by Marcus Ray", createdAt: "2026-10-29T14:00:00.000Z", type: "create" },
      { id: "act-5", text: "Priority elevated to urgent", createdAt: "2026-10-31T11:00:00.000Z", type: "priority" },
    ],
  },
  "task-3": {
    id: "task-3",
    boardId: "board-1",
    title: "Kanban Drag-and-Drop Optimization",
    description: "Refactor @hello-pangea/dnd column reordering to maintain 60 FPS under high task load.",
    priority: "medium",
    tags: ["Performance", "Frontend"],
    dueDate: "2026-11-12",
    assignee: {
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 1,
    attachmentsCount: 0,
    subtasks: [
      { id: "sub-5", text: "Implement optimistic drag updates", completed: true },
      { id: "sub-6", text: "Memoize task card components", completed: true },
    ],
    comments: [
      {
        id: "comm-4",
        author: {
          name: "Emma Watson",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
        },
        text: "FPS is now steady at 60 FPS during drag-drop transitions.",
        createdAt: "2026-11-02T11:00:00.000Z",
      },
    ],
    activity: [
      { id: "act-6", text: "Task created by Emma Watson", createdAt: "2026-10-31T12:00:00.000Z", type: "create" },
      { id: "act-7", text: "Moved to In Progress", createdAt: "2026-11-01T09:30:00.000Z", type: "move" },
    ],
  },
  "task-4": {
    id: "task-4",
    boardId: "board-1",
    title: "REST API Rate Limiting & Caching",
    description: "Add Redis-based token bucket rate limiter to prevent API abuse on public endpoints.",
    priority: "high",
    tags: ["DevOps", "Backend"],
    dueDate: "2026-11-15",
    assignee: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 0,
    attachmentsCount: 2,
    subtasks: [],
    comments: [],
    activity: [
      { id: "act-8", text: "Task created by David Kim", createdAt: "2026-11-01T14:00:00.000Z", type: "create" },
      { id: "act-9", text: "Moved to In Progress", createdAt: "2026-11-02T10:00:00.000Z", type: "move" },
    ],
  },
  "task-5": {
    id: "task-5",
    boardId: "board-1",
    title: "Design System & Component Library",
    description: "Standardize buttons, modals, dropdowns, and form inputs according to modern Figma specs.",
    priority: "low",
    tags: ["Design", "UI/UX"],
    dueDate: "2026-11-20",
    assignee: {
      name: "Sophia Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 1,
    attachmentsCount: 4,
    subtasks: [
      { id: "sub-7", text: "Create accessible Dialog / Modal", completed: true },
      { id: "sub-8", text: "Build customizable Badge component", completed: true },
    ],
    comments: [
      {
        id: "comm-5",
        author: {
          name: "Sophia Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
        },
        text: "Figma design tokens are fully mapped to Tailwind CSS classes.",
        createdAt: "2026-11-02T12:00:00.000Z",
      },
    ],
    activity: [
      { id: "act-10", text: "Task created by Sophia Chen", createdAt: "2026-11-01T08:00:00.000Z", type: "create" },
      { id: "act-11", text: "Moved to Under Review", createdAt: "2026-11-02T13:30:00.000Z", type: "move" },
    ],
  },
  "task-6": {
    id: "task-6",
    boardId: "board-1",
    title: "Initial Vite & Redux Toolkit Setup",
    description: "Scaffold Vite React project, configure Redux Toolkit store, and wire up Tailwind v4.",
    priority: "urgent",
    tags: ["Setup", "Architecture"],
    dueDate: "2026-11-02",
    assignee: {
      name: "Marcus Ray",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 1,
    attachmentsCount: 1,
    subtasks: [
      { id: "sub-9", text: "Install all dependencies", completed: true },
      { id: "sub-10", text: "Structure folders and slices", completed: true },
    ],
    comments: [
      {
        id: "comm-6",
        author: {
          name: "Marcus Ray",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        },
        text: "Store and slices configured, tested and building without errors.",
        createdAt: "2026-11-02T14:00:00.000Z",
      },
    ],
    activity: [
      { id: "act-12", text: "Task created by Marcus Ray", createdAt: "2026-11-01T10:00:00.000Z", type: "create" },
      { id: "act-13", text: "Moved to Completed 🎉", createdAt: "2026-11-02T14:30:00.000Z", type: "move" },
    ],
  },
  "task-7": {
    id: "task-7",
    boardId: "board-2",
    title: "Launch ProductHunt Teaser Page",
    description: "Write copy, prepare teaser banners, and schedule ProductHunt upcoming page.",
    priority: "high",
    tags: ["Marketing", "Launch"],
    dueDate: "2026-11-18",
    assignee: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 0,
    attachmentsCount: 2,
    subtasks: [],
    comments: [],
    activity: [
      { id: "act-14", text: "Task created by Alex Morgan", createdAt: "2026-11-02T09:00:00.000Z", type: "create" },
    ],
  },
  "task-8": {
    id: "task-8",
    boardId: "board-2",
    title: "Technical Blog Post: Scaling React 19",
    description: "Draft 1500-word deep dive into React 19 server actions and client state management.",
    priority: "medium",
    tags: ["Content", "SEO"],
    dueDate: "2026-11-22",
    assignee: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
    commentsCount: 0,
    attachmentsCount: 1,
    subtasks: [],
    comments: [],
    activity: [
      { id: "act-15", text: "Task created by Alex Morgan", createdAt: "2026-11-02T09:30:00.000Z", type: "create" },
    ],
  },
};
