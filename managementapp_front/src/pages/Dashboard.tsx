import { useState } from "react";
import {
  Calendar,
  Users,
  ListChecks,
  ChevronDown,
  ChevronUp,
  User,
  Bell,
  Settings,
  BarChart2,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Board from "./Board";
import NavigationBar from "../components/Navbar";
import Backlog from "./Backlog";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [expandedTeam, setExpandedTeam] = useState(null);

  const teams = [
    {
      id: 1,
      name: "Frontend Team",
      members: [
        { name: "John Doe", role: "Lead Developer", avatar: "JD" },
        { name: "Jane Smith", role: "UI Developer", avatar: "JS" },
        { name: "Mike Johnson", role: "React Developer", avatar: "MJ" }
      ]
    },
    {
      id: 2,
      name: "Backend Team",
      members: [
        { name: "Emily Davis", role: "Backend Lead", avatar: "ED" },
        { name: "Robert Wilson", role: "API Developer", avatar: "RW" },
        { name: "Sarah Brown", role: "Database Engineer", avatar: "SB" }
      ]
    },
    {
      id: 3,
      name: "Design Team",
      members: [
        { name: "Alex Turner", role: "UX Designer", avatar: "AT" },
        { name: "Lisa Wang", role: "UI Designer", avatar: "LW" },
        { name: "David Kim", role: "Graphics Designer", avatar: "DK" }
      ]
    }
  ];

  const tasks = [
    { id: 1, title: "Update user dashboard", priority: "High", status: "In Progress", dueDate: "2025-03-27" },
    { id: 2, title: "Fix navigation menu bug", priority: "Medium", status: "To Do", dueDate: "2025-03-28" },
    { id: 3, title: "Implement authentication", priority: "High", status: "In Progress", dueDate: "2025-03-30" },
    { id: 4, title: "Create mobile responsive UI", priority: "Medium", status: "To Do", dueDate: "2025-04-02" },
    { id: 5, title: "Data migration script", priority: "Low", status: "In Review", dueDate: "2025-04-03" }
  ];

  const deadlines = [
    { id: 1, title: "Sprint Review", date: "2025-03-25", daysLeft: 1 },
    { id: 2, title: "Client Presentation", date: "2025-03-26", daysLeft: 2 },
    { id: 3, title: "Alpha Release", date: "2025-04-01", daysLeft: 8 }
  ];

  const sprints = [
    { id: 1, name: "Sprint 23", startDate: "2025-03-15", endDate: "2025-03-28", progress: 65 },
    { id: 2, name: "Sprint 24", startDate: "2025-03-29", endDate: "2025-04-11", progress: 10 }
  ];

  const toggleTeam = (teamId) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case "board":
        return <Board />;
      case "backlog":
        return <Backlog />;
      default:
        return (
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-3 flex items-center border-b border-gray-700 pb-2">
                    <ListChecks className="mr-2 text-blue-400" /> Assigned Tasks
                  </h2>
                  <div className="max-h-64 overflow-y-auto pr-1">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="mb-2 bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors cursor-pointer flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-gray-400">Due: {task.dueDate}</div>
                          </div>
                          <div className={`${getPriorityColor(task.priority)} text-xs px-2 py-1 rounded-full text-white`}>
                            {task.priority}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-3 flex items-center border-b border-gray-700 pb-2">
                    <Calendar className="mr-2 text-purple-400" /> Upcoming Deadlines
                  </h2>
                  <div className="max-h-64 overflow-y-auto pr-1">
                    {deadlines.map(deadline => (
                        <div
                            key={deadline.id}
                            className="mb-2 bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors cursor-pointer flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{deadline.title}</div>
                            <div className="text-xs text-gray-400">{deadline.date}</div>
                          </div>
                          <div className={`flex items-center ${deadline.daysLeft <= 2 ? 'text-red-400' : 'text-yellow-400'}`}>
                            <Clock size={14} className="mr-1" />
                            <span className="text-xs">{deadline.daysLeft} {deadline.daysLeft === 1 ? 'day' : 'days'}</span>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-3 flex items-center border-b border-gray-700 pb-2">
                    <Users className="mr-2 text-indigo-400" /> Assigned Sprints
                  </h2>
                  <div className="max-h-64 overflow-y-auto pr-1">
                    {sprints.map(sprint => (
                        <div
                            key={sprint.id}
                            className="mb-2 bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{sprint.name}</div>
                            <div className="text-xs text-gray-400">
                              {sprint.startDate} - {sprint.endDate}
                            </div>
                          </div>
                          <div className="w-full bg-gray-600 h-2 rounded-full mt-2">
                            <div
                                className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${sprint.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-right mt-1 text-gray-300">{sprint.progress}% complete</div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center">
                  <Users className="mr-2 text-green-400" /> Teams
                </h2>
                <div className="space-y-3">
                  {teams.map((team) => (
                      <div key={team.id} className="bg-gray-700 rounded-lg">
                        <div
                            className="flex justify-between items-center cursor-pointer p-3 hover:bg-gray-600 transition-colors rounded-lg"
                            onClick={() => toggleTeam(team.id)}
                        >
                          <h3 className="font-medium flex items-center">
                            <Users size={16} className="mr-2 text-blue-300" />
                            {team.name}
                          </h3>
                          {expandedTeam === team.id ? (
                              <ChevronUp size={18} />
                          ) : (
                              <ChevronDown size={18} />
                          )}
                        </div>

                        {expandedTeam === team.id && (
                            <div className="p-3 pt-0 border-t border-gray-600 mt-1">
                              <div className="max-h-48 overflow-y-auto pr-1">
                                {team.members.map((member, idx) => (
                                    <div key={idx} className="flex items-center p-2 hover:bg-gray-600 rounded-md my-1 cursor-pointer">
                                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-xs font-bold">
                                        {member.avatar}
                                      </div>
                                      <div>
                                        <div className="font-medium">{member.name}</div>
                                        <div className="text-xs text-gray-400">{member.role}</div>
                                      </div>
                                    </div>
                                ))}
                              </div>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg shadow-md flex items-center">
                  <div className="bg-blue-700 p-3 rounded-lg mr-3">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">75%</div>
                    <div className="text-sm text-blue-300">Tasks Completed</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-4 rounded-lg shadow-md flex items-center">
                  <div className="bg-purple-700 p-3 rounded-lg mr-3">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">3</div>
                    <div className="text-sm text-purple-300">Critical Issues</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-lg shadow-md flex items-center">
                  <div className="bg-green-700 p-3 rounded-lg mr-3">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">12</div>
                    <div className="text-sm text-green-300">Team Members</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-4 rounded-lg shadow-md flex items-center">
                  <div className="bg-indigo-700 p-3 rounded-lg mr-3">
                    <BarChart2 size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">89%</div>
                    <div className="text-sm text-indigo-300">Sprint Progress</div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
  };
}