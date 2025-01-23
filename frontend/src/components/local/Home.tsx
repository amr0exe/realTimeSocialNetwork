import { useState } from "react"

function Home() {

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Home</h1>
            <p className="text-gray-600">Welcome to the home page.</p>

            <div className="p-2 border-b border-slate-400 flex">
                <div className="w-12 h-12 rounded-full bg-slate-400 flex justify-center items-center">a</div>
                <div className="pl-3">
                    <div className="font-light text-xs">@zlice_al</div>
                    <div className="text-sm text-gray-600">Hello there</div>
                
                    <p>hdf</p>
                </div>
            </div>

        </div>
    )
}


export default Home