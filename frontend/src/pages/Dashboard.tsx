import { useState } from "react"
import Sidebar from "../components/local/Sidebar"
import Home from "../components/local/Home"
import Messages from "../components/local/Messages"

function Dashboard() {
    const [activeTab, setActiveTab] = useState('home')
	const [isSidebarHidden, setIsSidebarHidden] = useState(false)

    const renderContent = () => {
        switch(activeTab) {
            case 'home':
                return <Home />
            case 'messages':
                return <Messages />
            case 'more':
                console.log("more here")
                break
            default:
                return <Home />
        }
    }   

	const toggleSidebar = () => {
		setIsSidebarHidden(prev => !prev)
	}

    return (
        <div className="min-h-screen w-screen bg-gray-50">
            <div className="flex h-screen font-mono">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> 

                <main className="flex-1 border-x border-gray-200 bg-white">
                    {renderContent()}
                </main>

				<div className="font-bold" onClick={toggleSidebar}>|||</div>
                <aside className={`w-80 p-4 space-y-6 ${isSidebarHidden ? "hidden" : ""}`}>
                    <p>Hello there</p>
                    <p>Sidebar</p>
                </aside>
            </div>
        </div>
    )
}

export default Dashboard
