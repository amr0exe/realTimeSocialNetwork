import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import Login from "./pages/Login"

function app() {

    return (
		<div>


			<BrowserRouter>
				<Routes>
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Dashboard />} />
				</Routes>
			</BrowserRouter>

		</div>
    )
}

export default app
