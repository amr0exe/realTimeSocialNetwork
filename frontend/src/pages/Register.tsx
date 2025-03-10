import { useState } from "react"
import axios from "axios"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { AuthResponse } from "@/types/types"

function Register() {
	const [password, setPassword] = useState("")
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")

	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const sendCred = async () => {
		try {
			setIsLoading(true)
			const response = await axios.post("http://localhost:8080/api/user/register", {email, username, password})
			const resp_data: AuthResponse = response.data

			setIsLoading(false)
			localStorage.setItem("token", resp_data.token)
			navigate("/login")
		} 
		catch(err) {
			console.log("Error while registering user!", err)
		}
	}

    return (
        <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
            <div className="w-full max-w-lg p-6 bg-white rounded shadow-md mx-4 md:mx-auto md:min-h-fit">
                <div className="w-full flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <p className="font-bold text-4xl">J</p>
                        <p className="font-bold text-xl">unction</p>
                    </div>
                    <p className="opacity-45 text-sm">"share your ideas, be more articulate!"</p>
                </div>

                <h1 className="text-center text-2xl font-medium mt-2">Register</h1>
                <p className="font-extralight text-center mb-4">
                    Already have an account?
                    <span className="text-blue-500 font-normal cursor-pointer ml-1"> 
                        <Link to="/login">login</Link>
                    </span>
                </p>

                <div className="w-full flex flex-col gap-3">
                    <label htmlFor="email">Email</label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="test@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="name">Username</label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="testcom"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="pas****d"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex mt-2 items-center justify-between">
                        <p className="text-sm text-blue-500 cursor-pointer">Forgot your password?</p>
                    </div>

                    <Button className="mt-4 mb-8" onClick={sendCred}>{isLoading ? "signingUp..." : "Submit"}</Button>
                </div>
            </div>
        </div>
    )}

export default Register
