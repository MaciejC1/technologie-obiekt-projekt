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
    Clock,
    Plus,
    MoreVertical,
} from "lucide-react";

export default function Backlog() {
    const [expandedSection, setExpandedSection] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);
    const [backlogItems, setBacklogItems] = useState([
        {
            id: 401,
            title: "Unassigned Task 1",
            description: "Task waiting for sprint assignment",
            priority: "Medium",
            status: "To Do",
            assignees: ["Alex Turner", "Sarah Brown"],
        },
        {
            id: 402,
            title: "Unassigned Task 2",
            description: "Another task waiting for sprint",
            priority: "Low",
            status: "To Do",
            assignees: ["David Kim"],
        },
    ]);
    const [sprints, setSprints] = useState([
        {
            id: 1,
            name: "Sprint 68 - blablabla",
            description: "od kiedy do kiedy (28 issues)",
            items: [
                {
                    id: 101,
                    title: "Task 1",
                    description: "Tekst co tam trzeba zrobić w ramach tasku ...",
                    priority: "High",
                    status: "In Progress",
                    assignees: ["John Doe", "Jane Smith", "Mike Johnson"],
                },
            ],
        },
        {
            id: 2,
            name: "Sprint 68 - blablabla",
            description: "od kiedy do kiedy (28 issues)",
            items: [
                {
                    id: 102,
                    title: "Task 1",
                    description: "Tekst co tam trzeba zrobić w ramach tasku ...",
                    priority: "Medium",
                    status: "In Progress",
                    assignees: ["Emily Davis", "Lisa Wang", "Alex Turner"],
                },
            ],
        },
    ]);

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
        setMenuOpen(null);
    };

    const toggleMenu = (menuId, e) => {
        if (e) {
            e.stopPropagation();
        }
        setMenuOpen(menuOpen === menuId ? null : menuId);
    };

    const closeMenus = () => {
        setMenuOpen(null);
    };

    useState(() => {
        document.addEventListener("mousedown", closeMenus);
        return () => {
            document.removeEventListener("mousedown", closeMenus);
        };
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "bg-red-500";
            case "Medium": return "bg-yellow-500";
            case "Low": return "bg-green-500";
            default: return "bg-blue-500";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Done": return <CheckCircle size={16} className="text-green-400" />;
            case "In Progress": return <Clock size={16} className="text-yellow-400" />;
            case "To Do": return <Circle size={16} className="text-gray-400" />;
            case "Blocked": return <AlertCircle size={16} className="text-red-400" />;
            default: return <Circle size={16} />;
        }
    };

    const filteredItems = (items) => {
        return items.filter(item => {
            if (statusFilter !== "all" && item.status !== statusFilter) return false;
            if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
            if (
                searchQuery &&
                !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !item.description.toLowerCase().includes(searchQuery.toLowerCase())
            ) return false;
            return true;
        });
    };

    const moveTask = (sectionId, taskId, direction) => {
        let updatedSprints = [...sprints];
        let updatedBacklogItems = [...backlogItems];

        if (sectionId === "backlog") {
            const taskIndex = updatedBacklogItems.findIndex(item => item.id === taskId);
            if (direction === "up" && taskIndex > 0) {
                [updatedBacklogItems[taskIndex], updatedBacklogItems[taskIndex - 1]] =
                    [updatedBacklogItems[taskIndex - 1], updatedBacklogItems[taskIndex]];
            } else if (direction === "down" && taskIndex < updatedBacklogItems.length - 1) {
                [updatedBacklogItems[taskIndex], updatedBacklogItems[taskIndex + 1]] =
                    [updatedBacklogItems[taskIndex + 1], updatedBacklogItems[taskIndex]];
            }
            setBacklogItems(updatedBacklogItems);
        } else {
            const sprintIndex = updatedSprints.findIndex(sprint => sprint.id === sectionId);
            const taskIndex = updatedSprints[sprintIndex].items.findIndex(item => item.id === taskId);
            if (direction === "up" && taskIndex > 0) {
                [updatedSprints[sprintIndex].items[taskIndex], updatedSprints[sprintIndex].items[taskIndex - 1]] =
                    [updatedSprints[sprintIndex].items[taskIndex - 1], updatedSprints[sprintIndex].items[taskIndex]];
            } else if (direction === "down" && taskIndex < updatedSprints[sprintIndex].items.length - 1) {
                [updatedSprints[sprintIndex].items[taskIndex], updatedSprints[sprintIndex].items[taskIndex + 1]] =
                    [updatedSprints[sprintIndex].items[taskIndex + 1], updatedSprints[sprintIndex].items[taskIndex]];
            }
            setSprints(updatedSprints);
        }
        setMenuOpen(null);
    };

    const filteredSprints = sprints.map(sprint => ({
        ...sprint,
        items: filteredItems(sprint.items),
    })).filter(sprint => sprint.items.length > 0);

    const filteredBacklogItems = filteredItems(backlogItems);

    const ContextMenu = ({ menuId, children, handleMenuClick }) => {
        return (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <div
                    className="p-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={(e) => toggleMenu(menuId, e)}
                >
                    <MoreVertical size={20} className="text-gray-300" />
                </div>

                {menuOpen === menuId && (
                    <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg border border-gray-700 overflow-hidden z-20">
                        <div className="py-1">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const MenuItem = ({ onClick, children, disabled = false }) => {
        return (
            <button
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200 hover:bg-gray-700'}`}
                onClick={disabled ? undefined : onClick}
                disabled={disabled}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <ListPlus className="mr-2 text-indigo-400" /> Backlog
                </h1>
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
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden">
                    <div
                        className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-700 transition-colors"
                        onClick={() => toggleSection("backlog")}
                    >
                        <div>
                            <h3 className="font-medium text-lg flex items-center">
                                Backlog (Unassigned Tasks)
                            </h3>
                            <p className="text-sm text-gray-400">Tasks not assigned to any sprint</p>
                        </div>
                        <div className="flex items-center">
                            <ContextMenu menuId="backlog-menu">
                                <MenuItem onClick={() => console.log("Edit Backlog")}>
                                    Edit Backlog
                                </MenuItem>
                                <MenuItem onClick={() => console.log("Delete Backlog")}>
                                    Delete Backlog
                                </MenuItem>
                            </ContextMenu>
                            <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full mr-3">
                                {filteredBacklogItems.length} items
                            </span>
                            {expandedSection === "backlog" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>

                    {expandedSection === "backlog" && filteredBacklogItems.length > 0 && (
                        <div className="border-t border-gray-700">
                            <div className="p-4 grid grid-cols-12 text-sm font-medium text-gray-400 border-b border-gray-700">
                                <div className="col-span-5">Item</div>
                                <div className="col-span-3">Status</div>
                                <div className="col-span-2">Priority</div>
                                <div className="col-span-2">Assignees</div>
                            </div>
                            {filteredBacklogItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="p-4 grid grid-cols-12 items-center hover:bg-gray-700 border-b border-gray-700 cursor-pointer"
                                >
                                    <div className="col-span-5">
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                                    </div>
                                    <div className="col-span-3 flex items-center">
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
                                    <div className="col-span-2 flex items-center justify-between">
                                        <span className="text-sm truncate">
                                            {item.assignees.length} people assigned
                                        </span>
                                        <ContextMenu menuId={`task-backlog-${item.id}`}>
                                            <MenuItem onClick={() => console.log("Edit Task")}>
                                                Edit Task
                                            </MenuItem>
                                            <MenuItem onClick={() => console.log("Delete Task")}>
                                                Delete Task
                                            </MenuItem>
                                            <MenuItem onClick={() => console.log("Assign People")}>
                                                Assign People
                                            </MenuItem>
                                            <div className="my-1 border-t border-gray-700"></div>
                                            <MenuItem
                                                onClick={() => moveTask("backlog", item.id, "up")}
                                                disabled={index === 0}
                                            >
                                                Move Up
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => moveTask("backlog", item.id, "down")}
                                                disabled={index === filteredBacklogItems.length - 1}
                                            >
                                                Move Down
                                            </MenuItem>
                                        </ContextMenu>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 border-t border-gray-700">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center mx-auto">
                                    <Plus size={18} className="mr-1" /> Create Issue
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {filteredSprints.length > 0 ? (
                    filteredSprints.map((sprint) => (
                        <div
                            key={sprint.id}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden"
                        >
                            <div
                                className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-700 transition-colors"
                                onClick={() => toggleSection(sprint.id)}
                            >
                                <div>
                                    <h3 className="font-medium text-lg flex items-center">
                                        {sprint.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">{sprint.description}</p>
                                </div>
                                <div className="flex items-center">
                                    <ContextMenu menuId={`sprint-${sprint.id}`}>
                                        <MenuItem onClick={() => console.log("Edit Sprint")}>
                                            Edit Sprint
                                        </MenuItem>
                                        <MenuItem onClick={() => console.log("Delete Sprint")}>
                                            Delete Sprint
                                        </MenuItem>
                                    </ContextMenu>
                                    <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full mr-3">
                                        {sprint.items.length} items
                                    </span>
                                    {expandedSection === sprint.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {expandedSection === sprint.id && (
                                <div className="border-t border-gray-700">
                                    <div className="p-4 grid grid-cols-12 text-sm font-medium text-gray-400 border-b border-gray-700">
                                        <div className="col-span-5">Item</div>
                                        <div className="col-span-3">Status</div>
                                        <div className="col-span-2">Priority</div>
                                        <div className="col-span-2">Assignees</div>
                                    </div>
                                    {sprint.items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="p-4 grid grid-cols-12 items-center hover:bg-gray-700 border-b border-gray-700 cursor-pointer"
                                        >
                                            <div className="col-span-5">
                                                <div className="font-medium">{item.title}</div>
                                                <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                                            </div>
                                            <div className="col-span-3 flex items-center">
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
                                            <div className="col-span-2 flex items-center justify-between">
                                                <span className="text-sm truncate">
                                                    {item.assignees.length} people assigned
                                                </span>
                                                <ContextMenu menuId={`task-sprint-${sprint.id}-${item.id}`}>
                                                    <MenuItem onClick={() => console.log("Edit Task")}>
                                                        Edit Task
                                                    </MenuItem>
                                                    <MenuItem onClick={() => console.log("Delete Task")}>
                                                        Delete Task
                                                    </MenuItem>
                                                    <MenuItem onClick={() => console.log("Assign People")}>
                                                        Assign People
                                                    </MenuItem>
                                                    <div className="my-1 border-t border-gray-700"></div>
                                                    <MenuItem
                                                        onClick={() => moveTask(sprint.id, item.id, "up")}
                                                        disabled={index === 0}
                                                    >
                                                        Move Up
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => moveTask(sprint.id, item.id, "down")}
                                                        disabled={index === sprint.items.length - 1}
                                                    >
                                                        Move Down
                                                    </MenuItem>
                                                </ContextMenu>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-4 border-t border-gray-700">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center mx-auto">
                                            <Plus size={18} className="mr-1" /> Create Issue
                                        </button>
                                    </div>
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

            <div className="mt-6 text-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center mx-auto">
                    <ListPlus size={18} className="mr-1" /> Create Sprint
                </button>
            </div>
        </div>
    );
}