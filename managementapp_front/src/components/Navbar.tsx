import { useState } from "react";
import { Bell, Settings, User, ChevronDown, Plus, Home } from "lucide-react";

export default function NavigationBar({ activeTab, setActiveTab }) {
    const tabs = ["home", "teams", "calendar", "board", "backlog"];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState("Select project");
    const projectList = [
        "Project Alpha",
        "Super Mega Long Project Name",
        "Project Gamma",
    ];
    const [showFullName, setShowFullName] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const handleSelect = (project) => {
        setSelectedProject(project);
        setDropdownOpen(false);
    };

    return (
        <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700 z-50 relative">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center w-56">
                    <span className="text-white mr-2 text-sm font-medium flex-shrink-0">
            Project:
          </span>
                    <div className="relative flex-1">
                        <button
                            onClick={toggleDropdown}
                            className="text-white font-semibold text-sm flex items-center w-full hover:bg-gray-700 px-3 py-2 rounded-md"
                            onMouseEnter={() => setShowFullName(true)}
                            onMouseLeave={() => setShowFullName(false)}
                        >
                            <span className="truncate flex-1">{selectedProject}</span>
                            <ChevronDown className="h-4 w-4 ml-1 shrink-0" />
                        </button>

                        {showFullName && selectedProject.length > 15 && (
                            <div className="absolute left-0 top-full mt-1 bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-50">
                                {selectedProject}
                            </div>
                        )}

                        {dropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-sm text-white shadow-lg rounded-md z-50 border border-gray-700">
                                {projectList.map((proj) => (
                                    <div
                                        key={proj}
                                        onClick={() => handleSelect(proj)}
                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer truncate relative group"
                                    >
                                        <span className="truncate block">{proj}</span>
                                        {proj.length > 18 && (
                                            <div className="hidden group-hover:block absolute left-full ml-2 top-0 bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                                {proj}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="border-t border-gray-600 my-1" />
                                <div
                                    onClick={() => alert("Add Project clicked")}
                                    className="px-4 py-2 text-blue-400 hover:bg-gray-700 cursor-pointer flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Project
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex space-x-4 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === tab
                                    ? "bg-blue-600 text-white font-medium shadow-md"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                            } transition-colors text-sm font-medium tracking-wide`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "home" ? (
                                <span className="flex items-center gap-1">
                  <Home size={16} />
                  Home
                </span>
                            ) : (
                                tab.charAt(0).toUpperCase() + tab.slice(1)
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <button className="text-gray-300 hover:text-white">
                        <Bell size={20} />
                    </button>
                    <button className="text-gray-300 hover:text-white">
                        <Settings size={20} />
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                        <span className="text-sm mr-2 hidden sm:inline">John Doe</span>
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <User size={18} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}