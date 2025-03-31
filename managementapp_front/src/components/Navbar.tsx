import { Bell, Settings, User } from "lucide-react";

export default function NavigationBar({ activeTab, setActiveTab }) {
    const tabs = ["projects", "tasks", "teams", "sprints", "calendar", "board", "backlog"];

    return (
        <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="w-8"></div>

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
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
