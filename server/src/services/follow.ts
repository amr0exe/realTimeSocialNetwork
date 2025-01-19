import express, {Request, Response, Router} from 'express';
import { PrismaClient } from '@prisma/client'

const followRouter: Router = express.Router()
const prisma = new PrismaClient()

followRouter.put("/follow", async (req: Request, res: Response) => {
    const followingId = Number(req.params.followingId)
    const followerId = Number(req.userId)

    const existingFollow = await prisma.follower.findUnique({
        where: {
            followerId_followingId: { followerId, followingId }
        }
    })
    
    if (existingFollow) {
        res.status(409).json({
            status: "error",
            message: "Already following"
        })
        return
    }

    try {
        await prisma.$transaction([
            // create follower record
            prisma.follower.create({
                data: {
                    followerId,
                    followingId
                }
            }),

            // update otherOne's follower count
            prisma.user.update({
                where: { id: followingId },
                data: { followerCount: { increment: 1 } }
            }),

            // upodate your following count
            prisma.user.update({
                where: { id: followerId },
                data: { followingCount: { increment: 1 } }
            })
        ])    

        res.status(200).json({
            status: "success",
            message: "Followed successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Follow process failed"
        })
        return
    }
})

followRouter.put("/unfollow", async (req: Request, res: Response) => {
    const followingId = Number(req.params.followingId)
    const followerId = Number(req.userId)

    const existingFollow = await prisma.follower.findUnique({
        where: {
            followerId_followingId: { followerId, followingId }
        }
    })

    if (!existingFollow) {
        res.status(409).json({
            status: "error",
            message: "Not following"
        })
        return
    }

    try {
        await prisma.$transaction([
            // delete follower record
            prisma.follower.delete({
                where: {
                    followerId_followingId: { followerId, followingId }
                }
            }),

            // update otherOne's follower count
            prisma.user.update({
                where: { id: followingId },
                data: { followerCount: { decrement: 1 } }
            }),

            // upodate your following count
            prisma.user.update({
                where: { id: followerId },
                data: { followingCount: { decrement: 1 } }
            })
        ])    

        res.status(200).json({
            status: "success",
            message: "Unfollowed successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unfollow process failed"
        })
        return
    }
})


export default followRouter