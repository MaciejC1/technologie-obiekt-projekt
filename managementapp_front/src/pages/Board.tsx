import { useState } from "react";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  ListChecks,
  Layout
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  dueDate: string;
  description?: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export default function Board() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "to-do",
      title: "To Do",
      tasks: [
        { id: "1", title: "Update user dashboard", priority: "High", status: "To Do", dueDate: "2025-03-27" },
        { id: "2", title: "Fix navigation menu bug", priority: "Medium", status: "To Do", dueDate: "2025-03-28" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        { id: "3", title: "Implement authentication", priority: "High", status: "In Progress", dueDate: "2025-03-30" },
        { id: "4", title: "Create mobile responsive UI", priority: "Medium", status: "In Progress", dueDate: "2025-04-02" },
      ],
    },
    {
      id: "in-review",
      title: "In Review",
      tasks: [
        { id: "5", title: "Data migration script", priority: "Low", status: "In Review", dueDate: "2025-04-03" },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [],
    },
  ]);

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask(task);
    setSourceColumnId(columnId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask || !sourceColumnId || sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      setSourceColumnId(null);
      return;
    }

    const newColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== draggedTask.id),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, { ...draggedTask, status: column.title }],
        };
      }
      return column;
    });

    setColumns(newColumns);
    setDraggedTask(null);
    setSourceColumnId(null);
  };

  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Layout className="mr-2 text-blue-400" /> Kanban Board
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <h2 className="text-xl font-semibold mb-3 flex items-center border-b border-gray-700 pb-2">
              {column.title === "Done" ? (
                <CheckCircle className="mr-2 text-green-400" />
              ) : column.title === "In Progress" ? (
                <Clock className="mr-2 text-yellow-400" />
              ) : column.title === "In Review" ? (
                <AlertCircle className="mr-2 text-purple-400" />
              ) : (
                <ListChecks className="mr-2 text-blue-400" />
              )}
              {column.title} ({column.tasks.length})
            </h2>
            <div className="min-h-[200px]">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task, column.id)}
                  className="mb-2 bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors cursor-move"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="flex items-center space-x-2">
                      <div className={`${getPriorityColor(task.priority)} text-xs px-2 py-1 rounded-full text-white`}>
                        {task.priority}
                      </div>
                      {expandedTask === task.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                  </div>
                  {expandedTask === task.id && (
                    <div className="mt-2 text-sm text-gray-300">
                      <p><span className="font-medium">Due Date:</span> {task.dueDate}</p>
                      <p><span className="font-medium">Status:</span> {task.status}</p>
                      <p><span className="font-medium">Description:</span> {task.description || "No description provided"}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}