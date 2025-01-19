import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./services/user.js";
import postRouter from "./services/post.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import followRouter from "./services/follow.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/post", authMiddleware, postRouter);
app.use("/api/user/:followingId", authMiddleware, followRouter);
// TODO: test-router
app.get("/test", (req, res) => {
    res.send("Wop Wop Wop!!!");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map