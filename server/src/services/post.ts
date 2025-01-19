import express, {Request, Response, Router} from 'express';
import { PrismaClient } from '@prisma/client'

const postRouter: Router = express.Router()
const prisma = new PrismaClient()

postRouter.get("/", (req: Request, res: Response) => { 
    console.log("reached here")
    res.json({
        Msg: "Post router is working"
    })
    return
 })

// create-post
postRouter.post("/", async (req: Request, res: Response) => {
    const { content } = req.body
    const authorId = Number(req.userId)

    if (!content) {
        res.status(400).json({
            status: "error",
            message: "Content is required"
        })
        return
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                content,
                authorId
            },
            select: {
                id: true,
                content: true,
            }
        })

        res.status(201).json({
            status: "success",
            data: {
                post: newPost.id
            }
        })
    } catch(err) {
        res.status(500).json({
            status: "error",
            message: "Post creation failed!"
        })
        return
    }
})

// GetAllPost
// FIXME: create better posts fetching endpoint
postRouter.get("/all", async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                content: true,
                authorId: true,
                likeCount: true,
                dislikeCount: true,
                comments: {
                    select: {
                        id: true,
                        content: true,
                        authorId: true
                    }
                }
            }
        })

        res.json({
            status: "success",
            data: {
                posts
            }
        })
    } catch(err) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch posts"
        })
        return
    }
})

// create-comment
postRouter.post("/:postId/comment", async (req: Request, res: Response) => {
    const { content } = req.body
    const authorId = Number(req.userId)
    const postId = Number(req.params.postId)

    if (!content) {
        res.status(400).json({
            status: "error",
            message: "Content is required"
        })
        return
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                authorId,
                postId
            }, select: {
                id: true,
                content: true
            }
        })

        res.status(201).json({
            status: "success",
            data: {
                comment: newComment.id
            }
        })
    } catch(err) {
        res.status(500).json({
            status: "error",
            message: "Comment creation failed!"
        })
        return
    }
})

// Like_Dislike
postRouter.put("/:postId/like", async (req: Request, res: Response) => {
    const postId = Number(req.params.postId)
    const userId = Number(req.userId)

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                authorId_postId: { authorId: userId, postId }
            }
        })

        if (existingLike) {
            // Unlike the post
            await prisma.$transaction([
                prisma.like.delete({
                    where: {
                        authorId_postId: { authorId: userId, postId }
                    }
                }),
                prisma.post.update({
                    where: { id: postId }, 
                    data: { likeCount: { decrement: 1 } }
                })
            ])
            res.json({ msg: "Post unliked" })
            return
        }

        // Like the post
        await prisma.$transaction([
            prisma.like.create({
                data: {
                    authorId: userId, postId
                }
            }),
            prisma.post.update({
                where: { id: postId },
                data: { likeCount: { increment: 1 }}
            })
        ])
        res.json({ msg: "Post liked" })

    } catch(err) {
        res.status(500).json({
            status: "error",
            message: "Like process failed"
        })
        return
    }
})

postRouter.put("/:postId/dislike", async (req: Request, res: Response) => {
    const postId = Number(req.params.postId)
    const userId = Number(req.userId)

    try {
        const existingDislike = await prisma.dislike.findUnique({
            where: {
                authorId_postId: { authorId: userId, postId }
            }
        })

        if (existingDislike) {
            // Remove dislike from the post
            await prisma.$transaction([
                prisma.dislike.delete({
                    where: {
                        authorId_postId: { authorId: userId, postId }
                    }
                }),
                prisma.post.update({
                    where: { id: postId }, 
                    data: { dislikeCount: { decrement: 1 } }
                })
            ])
            res.json({ msg: "Post undisliked" })
            return
        }

        // Dislike the post
        await prisma.$transaction([
            prisma.dislike.create({
                data: {
                    authorId: userId, postId
                }
            }),
            prisma.post.update({
                where: { id: postId },
                data: { dislikeCount: { increment: 1 }}
            })
        ])
        res.json({ msg: "Post disliked" })

    } catch(err) {
        res.status(500).json({
            status: "error",
            message: "Dislike process failed"
        })
        return
    }
})

//TODO: 
// create endpoint for fetching follower users post
// endpoint for fetching public/forYou side

export default postRouter