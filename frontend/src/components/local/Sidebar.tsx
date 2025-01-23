
interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function Sidebar({activeTab, setActiveTab}: SidebarProps) {
    const sidebarItems = [
        { id: 'home', label: 'Home' },
        { id: 'messages', label: 'Messages' },
        { id: 'more', label: '...More' },
    ]

    return (
        <aside className="w-64 p-4 space-y-2">
            <div className="px-4 py-3 text-xl font-bold">Dashboard</div>

            <nav className="space-y-1">
                {
                    sidebarItems.map((item) => {
                        return (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${ 
                                    activeTab === item.id 
                                    ? 'bg-blue-100'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <span className="font-medium">{item.label}</span>
                            </button>
                        )
                    })
                }
            </nav>
        </aside>
    )
}

export default Sidebar
