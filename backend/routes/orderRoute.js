import express from "express"
import authMiddleware from "../middleware/auth.js"
import {placeOrder, userOrders, verifyorder,listOrders, updateStatus,} from "../controllers/orderController.js"

const orderRoute=express.Router();
orderRoute.post("/place",authMiddleware,placeOrder);
orderRoute.post("/verify",verifyorder);
orderRoute.post("/userorders",authMiddleware,userOrders);
orderRoute.get("/list",listOrders);
orderRoute.post("/status",updateStatus);
export default orderRoute;