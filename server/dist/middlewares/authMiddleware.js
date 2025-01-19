import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // if not token or not starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized"
        });
        return;
    }
    // separate the token from the Bearer
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        if (err.name == "TokenExpiredError") {
            res.status(401).json({
                status: "error",
                message: "Token expired"
            });
            return;
        }
        res.status(401).json({
            status: "error",
            message: "Unauthorized! Invalid token!"
        });
        return;
    }
};
export default authMiddleware;
//# sourceMappingURL=authMiddleware.js.map