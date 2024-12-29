import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import voucherRoutes from './routes/VoucherRoutes.js';

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Kết nối DB
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
app.use('/images', express.static('uploads'));
app.use('/uploads', express.static('uploads')); // new
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRoute);
app.use("/reviews", reviewRouter);
app.use('/', voucherRoutes);


// Định tuyến mặc định
app.get("/", (req, res) => {
    res.send("API is running");
});

// Lắng nghe trên cổng (port)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});