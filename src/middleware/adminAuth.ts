import { RequestHandler } from "express";

export const adminAuth: RequestHandler = (req, res, next) => {
    const token = req.headers['x-admin-token'];

    if(token === process.env.ADMIN_TOKEN) {
        next();
    } else{
        res.status(401).json({ message: "Unauthorized"});
    }
};