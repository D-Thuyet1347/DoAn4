import mongoose from "mongoose";
export const connectDB=async()=> {
    await mongoose.connect('mongodb+srv://vantiz:khongbiet123@cluster0.fdcom.mongodb.net/food-del').then(()=>console.log("DB connected"));
}