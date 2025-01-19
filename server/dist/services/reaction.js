import express from 'express';
import { PrismaClient } from '@prisma/client';
const reactionRouter = express.Router();
const prisma = new PrismaClient();
reactionRouter.put("/:postId/like", async (req, res) => {
    const postId = Number(req.params.postId);
    const userId = Number(req.userId);
    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                authorId_postId: { authorId: userId, postId }
            }
        });
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
            ]);
            res.json({ msg: "Post unliked" });
            return;
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
                data: { likeCount: { increment: 1 } }
            })
        ]);
        res.json({ msg: "Post liked" });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: "Like process failed"
        });
        return;
    }
});
//# sourceMappingURL=reaction.js.map