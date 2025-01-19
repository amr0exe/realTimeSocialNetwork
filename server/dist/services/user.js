import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userRouter = express.Router();
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined");
}
const SALT_ROUNDS = 10;
userRouter.post("/register", async (req, res) => {
    const { email, username, password } = await req.body;
    if (!email || !username || !password) {
        res.status(400).json({
            status: "error",
            message: "All fields are required"
        });
        return;
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingUser) {
            res.status(409).json({
                status: "error",
                message: "User already exists"
            });
            return;
        }
        // hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user_stat = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true
            }
        });
        const token = jwt.sign({
            id: user_stat.id,
            username: user_stat.username
        }, secret, { expiresIn: "1h" });
        res.status(200).json({
            status: "success",
            message: "Registration successfull",
            token: token
        });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: "Registration failed!"
        });
    }
});
userRouter.post("/login", async (req, res) => {
    const { username, password } = await req.body;
    if (!username || !password) {
        res.status(400).json({
            status: "error",
            message: "All fields are required"
        });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                password: true
            }
        });
        if (!user) {
            res.status(404).json({
                status: "failed",
                message: "Login failed!, User does not exist"
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid Credentials",
            });
            return;
        }
        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, secret, { expiresIn: "1h" });
        res.status(200).json({
            status: "success",
            message: "Login success",
            token: token
        });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: "login failed!"
        });
    }
});
export default userRouter;
//# sourceMappingURL=user.js.map