import express from "express"
import { addFood ,listFood,removeFood} from "../controllers/foodControllers.js"
import multer from "multer"
 const foodRouter =express.Router(); // dang bai ...
const storage =multer.diskStorage({ //dis.. tai file len diskStorage()luu tr va dat ten
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`) // ko baoloi-
    }
})
const upload=multer({storage:storage})

 foodRouter.post("/add",upload.single("image"),addFood) //xu ly tai anh len
 foodRouter.get('/list',listFood)
 foodRouter.post("/remove",removeFood)


 export default foodRouter;