import { useState, useEffect } from "react"
import axios from "axios"

import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { PostsResponse, PostArray } from "@/types/types"

function Home() {
    const [messages, setMessages] = useState<PostArray>([])
    const [content, setContent] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/login")
                return
            }

            try {
                const response = await GetPost(token)
                setMessages(response)
            } catch (err) {
                console.log("Error fetching posts")
            }
        }

        fetchPosts()
    }, [navigate])

    const GetPost = async (token: string) => {
        const response = await axios.get<PostsResponse>("http://localhost:8080/api/post/all", { headers: { Authorization: `Bearer ${token}` } })
        return response.data.data.posts
    }

    const handlePost = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }

        try {
            await axios.post("http://localhost:8080/api/post", { content }, { headers: { Authorization: `Bearer ${token}` } })

            const fetchedMessages = await GetPost(token)
            setMessages(fetchedMessages)
            setContent('')
        } catch (err) {
            console.log("Error while creating post!", err)
        }
    }

    return (
        <div className="p-4 space-y-2">
            <h1 className="text-2xl font-bold">Home</h1>
            <p className="text-gray-600">Welcome to the home page.</p>

            <div className="border-b border-slate-400 pb-5 flex flex-col items-end">
                <Textarea onChange={(e) => setContent(e.target.value)} placeholder="enter your thoughts here!" />
                <Button className="mt-4" onClick={handlePost}>Post</Button>
            </div>

            <div className="p-2 border-b border-slate-400 flex">
                <div className="w-12 h-12 rounded-full bg-slate-400 flex justify-center items-center flex-shrink-0">a</div>
                <div className="pl-3">
                    <div className="font-light text-xs">@zlice_al</div>
                    <p>content_here everything from the box!</p>
                </div>
            </div>

            {/* Render posts */}
            <div>
                {messages.length === 0 ? ( <p>No posts available.</p>) :
					(messages.map((post) => (
                        <div className="p-2 border-b border-slate-400 flex" key={post.id}> {/* key placed here */}
                            <div className="w-12 h-12 rounded-full bg-slate-400 flex justify-center items-center flex-shrink-0">a</div>
                            <div className="pl-3">
                                <div className="font-light text-xs">@{post.author.username}</div>
                                <p>{post.content}</p>
                            </div>
                        </div>
						)
					)
                )}
            </div>
        </div>
    )
}

export default Home
