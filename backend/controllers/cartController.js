import userModel from "../models/userModel.js"

const addTocart=async(req,res)=>{
      try {
        let userData=await userModel.findOne({_id:req.body.userId})
        let cartData=await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId]=1
        }
        else
        {
            cartData[req.body.itemId] +=1
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"added to cart"});
      } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"});

        
      }
}

//remove item from 
const removeFromCart =async(req,res)=>
{
    try {
        let userData=await userModel.findOne({_id:req.body.userId})
        let cartData=await userData.cartData;
        if(cartData[req.body.itemId]>0)
        {
            cartData[req.body.itemId] -= 1
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"Remove from Cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}
//
//fecth user cart data
const getCart=async(req,res)=>{
    try {
        let userData=await userModel.findOne({_id:req.body.userId})
        let cartData=await userData.cartData;
        res.json({success:true,cartData});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export {addTocart,removeFromCart,getCart}