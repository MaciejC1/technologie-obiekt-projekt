import { useState } from "react";
import {
    ListPlus,
    ChevronDown,
    ChevronUp,
    Filter,
    Search,
    CheckCircle,
    Circle,
    AlertCircle,
    Clock
} from "lucide-react";

export default function Backlog() {
    const [expandedEpic, setExpandedEpic] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const epics = [
        {
            id: 1,
            name: "User Management",
            description: "Features related to user accounts and profiles",
            items: [
                {
                    id: 101,
                    title: "User registration flow",
                    description: "Implement secure registration with email verification",
                    priority: "High",
                    status: "To Do",
                    estimate: "8",
                    assignee: "John Doe",
                    tags: ["frontend", "security"]
                },
                {
                    id: 102,
                    title: "Password reset functionality",
                    description: "Allow users to reset password via email",
                    priority: "Medium",
                    status: "In Progress",
                    estimate: "5",
                    assignee: "Jane Smith",
                    tags: ["frontend", "email"]
                },
                {
                    id: 103,
                    title: "User profile settings",
                    description: "Create profile editing interface",
                    priority: "Low",
                    status: "Done",
                    estimate: "3",
                    assignee: "Mike Johnson",
                    tags: ["frontend", "ui"]
                }
            ]
        },
        {
            id: 2,
            name: "Payment Processing",
            description: "Integration with payment providers and billing features",
            items: [
                {
                    id: 201,
                    title: "Stripe integration",
                    description: "Connect application to Stripe API for payments",
                    priority: "High",
                    status: "In Progress",
                    estimate: "13",
                    assignee: "Emily Davis",
                    tags: ["backend", "api", "security"]
                },
                {
                    id: 202,
                    title: "Subscription management",
                    description: "Create UI for managing subscription plans",
                    priority: "Medium",
                    status: "To Do",
                    estimate: "8",
                    assignee: "Lisa Wang",
                    tags: ["frontend", "payments"]
                }
            ]
        },
        {
            id: 3,
            name: "Reporting",
            description: "Data visualization and reporting capabilities",
            items: [
                {
                    id: 301,
                    title: "Dashboard analytics",
                    description: "Create analytics dashboard with key metrics",
                    priority: "Medium",
                    status: "To Do",
                    estimate: "8",
                    assignee: "Alex Turner",
                    tags: ["frontend", "data"]
                },
                {
                    id: 302,
                    title: "CSV export",
                    description: "Allow exporting report data to CSV",
                    priority: "Low",
                    status: "Done",
                    estimate: "3",
                    assignee: "Sarah Brown",
                    tags: ["backend", "data"]
                },
                {
                    id: 303,
                    title: "Chart components",
                    description: "Create reusable chart components for metrics",
                    priority: "High",
                    status: "In Progress",
                    estimate: "5",
                    assignee: "David Kim",
                    tags: ["frontend", "ui"]
                }
            ]
        }
    ];

    const toggleEpic = (epicId) => {
        if (expandedEpic === epicId) {
            setExpandedEpic(null);
        } else {
            setExpandedEpic(epicId);
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

    const getStatusIcon = (status) => {
        switch(status) {
            case "Done": return <CheckCircle size={16} className="text-green-400" />;
            case "In Progress": return <Clock size={16} className="text-yellow-400" />;
            case "To Do": return <Circle size={16} className="text-gray-400" />;
            case "Blocked": return <AlertCircle size={16} className="text-red-400" />;
            default: return <Circle size={16} />;
        }
    };

    const filteredItems = () => {
        let allItems = [];

        epics.forEach(epic => {
            const filteredEpicItems = epic.items.filter(item => {
                // Apply status filter
                if (statusFilter !== "all" && item.status !== statusFilter) {
                    return false;
                }

                // Apply priority filter
                if (priorityFilter !== "all" && item.priority !== priorityFilter) {
                    return false;
                }

                // Apply search query
                if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return false;
                }

                return true;
            });

            if (filteredEpicItems.length > 0) {
                allItems.push({
                    ...epic,
                    items: filteredEpicItems
                });
            }
        });

        return allItems;
    };

    const filteredEpics = filteredItems();

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <ListPlus className="mr-2 text-indigo-400" /> Backlog
                </h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
                    <ListPlus size={18} className="mr-1" /> Create Item
                </button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                            placeholder="Search backlog items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center bg-gray-700 rounded-md">
                        <Filter size={18} className="text-gray-400 ml-3" />
                        <select
                            className="block w-full py-2 px-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                    </div>

                    <div className="flex items-center bg-gray-700 rounded-md">
                        <Filter size={18} className="text-gray-400 ml-3" />
                        <select
                            className="block w-full py-2 px-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="all">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredEpics.length > 0 ? (
                    filteredEpics.map((epic) => (
                        <div key={epic.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden">
                            <div
                                className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-700 transition-colors"
                                onClick={() => toggleEpic(epic.id)}
                            >
                                <div>
                                    <h3 className="font-medium text-lg flex items-center">
                                        {epic.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">{epic.description}</p>
                                </div>
                                <div className="flex items-center">
                                  <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full mr-3">
                                    {epic.items.length} items
                                  </span>
                                    {expandedEpic === epic.id ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </div>
                            </div>

                            {expandedEpic === epic.id && (
                                <div className="border-t border-gray-700">
                                    <div className="p-4 grid grid-cols-12 text-sm font-medium text-gray-400 border-b border-gray-700">
                                        <div className="col-span-5">Item</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-2">Priority</div>
                                        <div className="col-span-1">Est.</div>
                                        <div className="col-span-2">Assignee</div>
                                    </div>
                                    {epic.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-4 grid grid-cols-12 items-center hover:bg-gray-700 border-b border-gray-700 cursor-pointer"
                                        >
                                            <div className="col-span-5">
                                                <div className="font-medium">{item.title}</div>
                                                <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {item.tags.map((tag, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-600 px-2 py-1 rounded-full text-gray-300">
                                                          {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex items-center">
                                            <span className="flex items-center">
                                              {getStatusIcon(item.status)}
                                                <span className="ml-1">{item.status}</span>
                                            </span>
                                            </div>
                                            <div className="col-span-2">
                                            <span className={`${getPriorityColor(item.priority)} text-xs px-2 py-1 rounded-full text-white`}>
                                              {item.priority}
                                            </span>
                                            </div>
                                            <div className="col-span-1 text-center bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                                                {item.estimate}
                                            </div>
                                            <div className="col-span-2 flex items-center">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2 text-xs">
                                                    {item.assignee.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-sm truncate">{item.assignee}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-800 p-8 rounded-lg shadow-md text-center">
                        <div className="text-gray-400 mb-2">No items match your filters</div>
                        <button
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => {
                                setStatusFilter("all");
                                setPriorityFilter("all");
                                setSearchQuery("");
                            }}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-3">Backlog Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-800 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-sm text-blue-300">Total Epics</div>
                    </div>
                    <div className="bg-blue-800 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">42</div>
                        <div className="text-sm text-blue-300">Total Items</div>
                    </div>
                    <div className="bg-blue-800 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">15</div>
                        <div className="text-sm text-blue-300">Ready for Sprint</div>
                    </div>
                    <div className="bg-blue-800 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">173</div>
                        <div className="text-sm text-blue-300">Total Story Points</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
