import { useState } from "react";
import NavigationBar from "././components/Navbar.tsx";
import Backlog from "././Pages/Backlog.tsx";
import Calendar from "././Pages/Calendar.tsx";
import Dashboard from "././Pages/Dashboard.tsx";
import Board from "./pages/Board.tsx";
import "./App.css";


function App() {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div className="App min-h-screen bg-gray-900 text-white">
            <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "home" && <Dashboard />}
            {activeTab === "backlog" && <Backlog />}
            {activeTab === "calendar" && <Calendar />}
            {activeTab === "teams" && (
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold">Teams</h1>
                </div>
            )}
            {activeTab === "board" && <Board />}
        </div>
    );
}

export default App;