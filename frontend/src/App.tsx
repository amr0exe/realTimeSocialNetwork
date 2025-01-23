import { useState } from "react"
import Sidebar from "./components/local/Sidebar"
import Home from "./components/local/Home"
import Messages from "./components/local/Messages"

function App() {
    const [activeTab, setActiveTab] = useState('home')

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen font-mono">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> 

                <main className="flex-1 border-x border-gray-200 bg-white">
                    {renderContent()}
                </main>

                <aside className="w-80 p-4 space-y-6">
                    <p>Hello there</p>
                    <p>Sidebar</p>
                </aside>
            </div>
        </div>
    )
}

export default App
