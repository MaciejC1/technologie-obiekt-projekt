import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Clock,
    X,
} from "lucide-react";

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth()));
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [assigneeFilter, setAssigneeFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalEvents, setModalEvents] = useState([]);
    const [modalDay, setModalDay] = useState(null);
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [eventDetailsOpen, setEventDetailsOpen] = useState(null);

    const [events, setEvents] = useState([
        {
            id: 1,
            title: "SCRUM-2 Rozpoczynanie testów",
            type: "Task",
            status: "To Do",
            assignees: ["John Doe"],
            startDate: new Date(2025, 3, 1),
            endDate: new Date(2025, 3, 11),
        },
        {
            id: 2,
            title: "Tablica Sprint 1",
            type: "Sprint",
            status: "In Progress",
            assignees: ["Jane Smith"],
            startDate: new Date(2025, 3, 14),
            endDate: new Date(2025, 3, 22),
        },
        {
            id: 3,
            title: "Event 3",
            type: "Task",
            status: "To Do",
            assignees: ["Alex Turner"],
            startDate: new Date(2025, 3, 1),
            endDate: new Date(2025, 3, 3),
        },
        {
            id: 4,
            title: "Event 4",
            type: "Sprint",
            status: "In Progress",
            assignees: ["Sarah Brown"],
            startDate: new Date(2025, 3, 1),
            endDate: new Date(2025, 3, 4),
        },
        {
            id: 5,
            title: "Cross-Month Event",
            type: "Task",
            status: "To Do",
            assignees: ["Mike Johnson"],
            startDate: new Date(2025, 3, 1),
            endDate: new Date(2025, 4, 5),
        },
    ]);

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();
    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from(
        { length: (firstDayOfMonth + 6) % 7 },
        () => null
    );

    const toggleMenu = (menuId, e) => {
        if (e) e.stopPropagation();
        setMenuOpen(menuOpen === menuId ? null : menuId);
    };

    const closeMenus = () => {
        setMenuOpen(null);
        setEventDetailsOpen(null);
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeMenus);
        return () => document.removeEventListener("mousedown", closeMenus);
    }, []);

    const getEventColor = (type) => {
        switch (type) {
            case "Task":
                return "bg-purple-500";
            case "Sprint":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "In Progress":
                return <Clock size={12} className="text-yellow-400" />;
            default:
                return <div className="w-3 h-3 rounded-full bg-gray-400" />;
        }
    };

    const getEventDuration = (startDate, endDate) => {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const filteredEvents = events.filter((event) => {
        const monthStart = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        );
        const monthEnd = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
        );
        if (event.endDate < monthStart || event.startDate > monthEnd) return false;

        if (typeFilter !== "all" && event.type !== typeFilter) return false;
        if (statusFilter !== "all" && event.status !== statusFilter) return false;
        if (
            assigneeFilter !== "all" &&
            !event.assignees.includes(assigneeFilter)
        ) return false;
        if (
            searchQuery &&
            !event.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) return false;
        return true;
    });

    const assigneesList = [...new Set(events.flatMap((event) => event.assignees))];

    const ContextMenu = ({ menuId, children }) => (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div
                className="p-1 rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={(e) => toggleMenu(menuId, e)}
            >
                <MoreVertical size={16} className="text-gray-300" />
            </div>
            {menuOpen === menuId && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg border border-gray-700 overflow-hidden z-20">
                    <div className="py-1">{children}</div>
                </div>
            )}
        </div>
    );

    const MenuItem = ({ onClick, children }) => (
        <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            onClick={onClick}
        >
            {children}
        </button>
    );

    const EventDetailsMenu = ({ event, position }) => {
        return (
            <div
                className="absolute bg-gray-800 rounded-md shadow-lg border border-gray-700 p-4 w-64 z-20"
                style={{
                    top: position.top,
                    left: position.left,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-white truncate">{event.title}</h3>
                    <ContextMenu menuId={`details-${event.id}`}>
                        <MenuItem onClick={() => console.log(`Go to Sprint Details for ${event.id}`)}>
                            Go to Sprint Details
                        </MenuItem>
                    </ContextMenu>
                </div>
                <div className="text-xs text-gray-200">
                    <p><span className="font-medium">Status:</span> {event.status}</p>
                    <p><span className="font-medium">Start:</span> {event.startDate.toLocaleDateString()}</p>
                    <p><span className="font-medium">Duration:</span> {getEventDuration(event.startDate, event.endDate)} days</p>
                </div>
            </div>
        );
    };

    const getEventSpan = (event) => {
        const monthStart = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        );
        const monthEnd = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
        );
        const start = new Date(Math.max(event.startDate, monthStart));
        const end = new Date(Math.min(event.endDate, monthEnd));
        const span = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return { start: start.getDate(), span: Math.max(1, span), end: end.getDate(), actualEndDate: event.endDate };
    };

    const assignRows = (events) => {
        const rows = [];
        const sortedEvents = [...events].sort(
            (a, b) => a.startDate - b.startDate || b.endDate - a.endDate
        );

        sortedEvents.forEach((event) => {
            const { start, span } = getEventSpan(event);
            let placed = false;

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const lastEventInRow = row[row.length - 1];
                const lastEndDay = lastEventInRow
                    ? getEventSpan(lastEventInRow).start +
                    getEventSpan(lastEventInRow).span -
                    1
                    : 0;

                if (start > lastEndDay) {
                    row.push(event);
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                rows.push([event]);
            }
        });

        return rows;
    };

    const eventRows = assignRows(filteredEvents);
    const maxVisibleRows = 3;

    const openModal = (dayEvents, day) => {
        setModalEvents(dayEvents);
        setModalDay(day);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalEvents([]);
        setModalDay(null);
    };

    const getRowBoundaries = (day) => {
        const weekNumber = Math.floor((day - 1 + ((firstDayOfMonth + 6) % 7)) / 7);
        const rowStartDay = weekNumber * 7 - ((firstDayOfMonth + 6) % 7) + 1;
        const rowEndDay = Math.min(rowStartDay + 6, daysInMonth);
        return { rowStartDay: Math.max(1, rowStartDay), rowEndDay };
    };

    const handleEventClick = (event, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const position = {
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
        };
        setEventDetailsOpen({ event, position });
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">
                                Events on {modalDay}/{currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {modalEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={`p-2 rounded text-white ${getEventColor(event.type)}`}
                                >
                                    <div className="flex items-center">
                                        {getStatusIcon(event.status)}
                                        <span className="ml-2 font-medium">{event.title}</span>
                                    </div>
                                    <div className="text-xs text-gray-200 mt-1">
                                        Start: {event.startDate.toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-200">
                                        End: {event.endDate.toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {eventDetailsOpen && (
                <EventDetailsMenu
                    event={eventDetailsOpen.event}
                    position={eventDetailsOpen.position}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Calendar</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-white">
                        {currentMonth.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <button
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600"
                        onClick={() =>
                            setCurrentMonth(
                                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                            )
                        }
                    >
                        <ChevronLeft size={20} className="text-gray-300"/>
                    </button>
                    <button
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600"
                        onClick={() =>
                            setCurrentMonth(
                                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                            )
                        }
                    >
                        <ChevronRight size={20} className="text-gray-300"/>
                    </button>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                            placeholder="Search issues..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center bg-gray-700 rounded-md">
                        <Filter size={18} className="text-gray-400 ml-3" />
                        <select
                            className="block w-full py-2 px-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">Type</option>
                            <option value="Task">Task</option>
                            <option value="Sprint">Sprint</option>
                        </select>
                    </div>
                    <div className="flex items-center bg-gray-700 rounded-md">
                        <Filter size={18} className="text-gray-400 ml-3" />
                        <select
                            className="block w-full py-2 px-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                    </div>
                    <div className="flex items-center bg-gray-700 rounded-md">
                        <Filter size={18} className="text-gray-400 ml-3" />
                        <select
                            className="block w-full py-2 px-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                            value={assigneeFilter}
                            onChange={(e) => setAssigneeFilter(e.target.value)}
                        >
                            <option value="all">Assignee</option>
                            {assigneesList.map((assignee) => (
                                <option key={assignee} value={assignee}>
                                    {assignee}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden">
                <style>
                    {`
                        .event-bar {
                            transition: filter 0.5s ease;
                        }
                        .event-hovered {
                            filter: brightness(1.5);
                        }
                    `}
                </style>
                <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-400 border-b border-gray-700">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="p-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {emptyDays.map((_, index) => (
                        <div key={`empty-${index}`} className="h-40 border border-gray-700" />
                    ))}
                    {daysArray.map((day) => {
                        const currentDay = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            day
                        );
                        const dayEvents = eventRows
                            .flat()
                            .filter(
                                (event) =>
                                    currentDay >= event.startDate && currentDay <= event.endDate
                            );

                        const visibleRows = eventRows
                            .slice(0, maxVisibleRows)
                            .filter((row) =>
                                row.some(
                                    (event) =>
                                        currentDay >= event.startDate && currentDay <= event.endDate
                                )
                            );
                        const hiddenDayEventsCount = dayEvents.length - visibleRows.length;

                        const { rowStartDay, rowEndDay } = getRowBoundaries(day);

                        return (
                            <div
                                key={day}
                                className="h-40 border border-gray-700 p-2 relative"
                            >
                                <span className="text-sm text-gray-300 absolute top-1 left-1">
                                    {day}
                                </span>
                                {eventRows.slice(0, maxVisibleRows).map((row, rowIndex) =>
                                    row.map((event) => {
                                        const { start, span, end, actualEndDate } = getEventSpan(event);
                                        const isStart = day === start;
                                        const isEnd = day === end;
                                        const isSingleDay = event.startDate.getTime() === event.endDate.getTime();

                                        if (day < start || day > end) return null;

                                        const effectiveStart = Math.max(start, rowStartDay);
                                        let effectiveEnd = Math.min(end, rowEndDay);
                                        let effectiveSpan = Math.min(effectiveEnd - effectiveStart + 1, end - day + 1);

                                        if (effectiveStart + effectiveSpan - 1 > daysInMonth) {
                                            effectiveSpan = daysInMonth - effectiveStart + 1;
                                        }

                                        if (day === daysInMonth) {
                                            effectiveSpan = Math.min(effectiveSpan, daysInMonth - effectiveStart + 1);
                                        }

                                        if (day + effectiveSpan - 1 > end) {
                                            effectiveSpan = end - day + 1;
                                        }

                                        let calculatedWidth =
                                            isSingleDay || day === effectiveEnd || day === daysInMonth || day === end
                                                ? "calc(100% - 0.5rem)"
                                                : `calc(${(effectiveSpan * 100)}% - 0.5rem)`;

                                        if (day + effectiveSpan - 1 > daysInMonth) {
                                            effectiveSpan = daysInMonth - day + 1;
                                            calculatedWidth = "calc(100% - 0.5rem)";
                                        }

                                        const trulyEndsThisMonth = actualEndDate.getMonth() === currentMonth.getMonth() && day === end;

                                        return (
                                            <div
                                                key={`${event.id}-${day}`}
                                                className={`absolute left-0 p-1 rounded text-xs text-white flex items-center ${getEventColor(
                                                    event.type
                                                )} truncate event-bar ${hoveredEvent === event.id ? "event-hovered" : ""}`}
                                                onMouseEnter={() => setHoveredEvent(event.id)}
                                                onMouseLeave={() => setHoveredEvent(null)}
                                                onClick={(e) => handleEventClick(event, e)}
                                                style={{
                                                    top: `${2.5 + rowIndex * 1.2}rem`,
                                                    width: calculatedWidth,
                                                    height: "1rem",
                                                    background: getEventColor(event.type).includes("purple")
                                                        ? "linear-gradient(to right, #8b5cf6, #8b5cf6 100%)"
                                                        : "linear-gradient(to right, #3b82f6, #3b82f6 100%)",
                                                    marginLeft:
                                                        day === start ? "0.25rem" : "-0.25rem",
                                                    marginRight:
                                                        day === end || day === effectiveEnd || day === daysInMonth
                                                            ? "0.25rem"
                                                            : "-0.25rem",
                                                    borderTopLeftRadius: isStart || isSingleDay ? "0.25rem" : "0",
                                                    borderBottomLeftRadius: isStart || isSingleDay ? "0.25rem" : "0",
                                                    borderTopRightRadius:
                                                        (isEnd && trulyEndsThisMonth) || isSingleDay || (day === daysInMonth && trulyEndsThisMonth)
                                                            ? "0.25rem"
                                                            : "0",
                                                    borderBottomRightRadius:
                                                        (isEnd && trulyEndsThisMonth) || isSingleDay || (day === daysInMonth && trulyEndsThisMonth)
                                                            ? "0.25rem"
                                                            : "0",
                                                }}
                                            >
                                                {isStart && (
                                                    <>
                                                        {getStatusIcon(event.status)}
                                                        <span className="ml-1 truncate">{event.title}</span>
                                                        <ContextMenu menuId={`event-${event.id}-${day}`}>
                                                            <MenuItem onClick={() => console.log("Edit Event")}>
                                                                Edit Event
                                                            </MenuItem>
                                                            <MenuItem onClick={() => console.log("Delete Event")}>
                                                                Delete Event
                                                            </MenuItem>
                                                        </ContextMenu>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                {hiddenDayEventsCount > 0 && (
                                    <button
                                        className="absolute bottom-2 left-2 text-xs text-blue-400 hover:text-blue-300"
                                        onClick={() => openModal(dayEvents, day)}
                                    >
                                        +{hiddenDayEventsCount} more
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}