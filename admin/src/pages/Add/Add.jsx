// import React, { useState } from 'react'
// import './Add.css'
// import { assets } from '../../assets/assets'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// const Add = () => {
//   const url='http://localhost:4000'
//     const [image,setImage]=useState(false);
//     const [data,setData]=useState({
//       name:'',
//       description:'',
//        price:'',
//        category:'Rice Noodles'
//      })
//      const onChangeHandler = (event) => {
//       const name = event.target.name;  
//       const value = event.target.value; 
    
//       setData((prevData) => ({ 
//         ...prevData, 
//         [name]: value 
//       }));
//     };
//     const onSubmitHandler=async(event)=>
//     {
//       event.preventDefault();
//       const formData=new FormData();
//       formData.append('name',data.name)
//       formData.append('description',data.description)
//       formData.append('price',Number(data.price))
//       formData.append('category',data.category)
//       formData.append('image',image)
//       const response =await axios.post(`${url}/api/food/add`,formData)
//       if(response.data.success){
//              setData  ({  name:'',
//                description:'',
//                price:'',
//                category:'Salad'})  
          
//               setImage(false)
//               toast.success(response.data.message)
//       }else{
//         toast.error(response.data.message)
//       }
//     }
     

//   return (
//     <div className='add'>
//       <form className='flex-col' onSubmit={onSubmitHandler}>
//         <div className="add-img-upload flex-col">
//             <p>Upload Image</p>
//             <label htmlFor="image">
//                 <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
//             </label>
//             <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
//         </div> 
//         <div className="add-product-name flex-col">
//             <p>Product name</p>
//             <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type here' />
//         </div>
//         <div className="add-product-description flex-col">
//             <p>Product description</p>
//             <textarea onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder='Write content here' required></textarea>

//         </div>
//         <div className="add-category-price">
//             <div className="add-category flex-col">
//                 <p>Product category</p>
//                 <select onChange={onChangeHandler} name="category" >
//                     <option value="Rice Noodles">Rice Noodles</option>
//                     <option value="Pho">Pho</option>
//                     <option value="Rice">Rice</option>
//                     <option value="Noodles">Noodles</option>
//                     <option value="Banh My">Banh My</option>
//                     <option value="Porridge">Porridge</option>
//                     <option value="Sticky Rice">Sticky Rice</option>
//                     <option value="Drinks">Drinks</option>
//                 </select>
//             </div>
//             <div className="add-price flex-col" >
//                 <p>Product price</p>
//                 <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder='$20' />
//             </div>
//         </div>
//         <button type='Submit' className='add-btn' >ADD</button>
//       </form>
//     </div>
//   )
// }

// export default Add


// import React, { useState } from 'react';
// import './Add.css';
// import { assets } from '../../assets/assets';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Add = () => {
//   const url = 'http://localhost:4000';
//   const [image, setImage] = useState(false);
//   const [data, setData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: 'Rice Noodles',
//   });

//   // Xử lý thay đổi input
//   const onChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Xử lý gửi form
//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append('name', data.name);
//       formData.append('description', data.description);
//       formData.append('price', Number(data.price));
//       formData.append('category', data.category);
//       formData.append('image', image);

//       const response = await axios.post(`${url}/api/food/add`, formData);

//       if (response.data.success) {
//         setData({
//           name: '',
//           description: '',
//           price: '',
//           category: 'Rice Noodles',
//         });
//         setImage(false);
//         toast.success(response.data.message, { containerId: 'add-toast' });
//       } else {
//         toast.error(response.data.message, { containerId: 'add-toast' });
//       }
//     } catch (error) {
//       toast.error('Error adding food item', { containerId: 'add-toast' });
//     }
//   };

//   return (
//     <div className="add">
//       <form className="flex-col" onSubmit={onSubmitHandler}>
//         <div className="add-img-upload flex-col">
//           <p>Upload Image</p>
//           <label htmlFor="image">
//             <img
//               src={image ? URL.createObjectURL(image) : assets.upload_area}
//               alt="Upload preview"
//             />
//           </label>
//           <input
//             onChange={(e) => setImage(e.target.files[0])}
//             type="file"
//             id="image"
//             hidden
//             required
//           />
//         </div>
//         <div className="add-product-name flex-col">
//           <p>Product name</p>
//           <input
//             onChange={onChangeHandler}
//             value={data.name}
//             type="text"
//             name="name"
//             placeholder="Type here"
//             required
//           />
//         </div>
//         <div className="add-product-description flex-col">
//           <p>Product description</p>
//           <textarea
//             onChange={onChangeHandler}
//             value={data.description}
//             name="description"
//             rows="6"
//             placeholder="Write content here"
//             required
//           ></textarea>
//         </div>
//         <div className="add-category-price">
//           <div className="add-category flex-col">
//             <p>Product category</p>
//             <select onChange={onChangeHandler} name="category" value={data.category}>
//               <option value="Rice Noodles">Rice Noodles</option>
//               <option value="Pho">Pho</option>
//               <option value="Rice">Rice</option>
//               <option value="Noodles">Noodles</option>
//               <option value="Banh My">Banh My</option>
//               <option value="Porridge">Porridge</option>
//               <option value="Sticky Rice">Sticky Rice</option>
//               <option value="Drinks">Drinks</option>
//             </select>
//           </div>
//           <div className="add-price flex-col">
//             <p>Product price</p>
//             <input
//               onChange={onChangeHandler}
//               value={data.price}
//               type="Number"
//               name="price"
//               placeholder="$20"
//               required
//             />
//           </div>
//         </div>
//         <button type="Submit" className="add-btn">
//           ADD
//         </button>
//       </form>

//       {/* ToastContainer riêng cho Add */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         containerId="add-toast"
//       />
//     </div>
//   );
// };

// export default Add;


import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {
  const url = 'http://localhost:4000';
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Rice Noodles',
  });

  // Danh sách từ khóa cấm (có thể mở rộng thêm)
  const bannedWords = ["violence", "hate", "kill", "abuse", "rape", "war", "fight", "bully"];

  // Kiểm tra nếu nội dung có chứa từ cấm
  const containsBannedWords = (text) => {
    return bannedWords.some(word => text.toLowerCase().includes(word));
  };

  // Xử lý thay đổi input
  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    // Kiểm tra nếu là product name và độ dài vượt quá 100 ký tự
    if (name === 'name' && value.length > 100) {
      toast.error('Product name must be under 100 characters', { containerId: 'add-toast' });
      return;
    }

    // Kiểm tra nếu nội dung có từ cấm
    if ((name === 'name' || name === 'description') && containsBannedWords(value)) {
      toast.error('Your input contains inappropriate language. Please remove it.', { containerId: 'add-toast' });
      return;
    }

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý gửi form
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Kiểm tra giá trị price
    if (Number(data.price) < 1) {
      toast.error('Price must be greater than $1', { containerId: 'add-toast' });
      return;
    }

    // Kiểm tra nếu có từ cấm trong product name hoặc description
    if (containsBannedWords(data.name) || containsBannedWords(data.description)) {
      toast.error('Your input contains inappropriate language. Please remove it.', { containerId: 'add-toast' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', Number(data.price));
      formData.append('category', data.category);
      formData.append('image', image);

      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Rice Noodles',
        });
        setImage(false);
        toast.success(response.data.message, { containerId: 'add-toast' });
      } else {
        toast.error(response.data.message, { containerId: 'add-toast' });
      }
    } catch (error) {
      toast.error('Error adding food item', { containerId: 'add-toast' });
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Rice Noodles">Rice Noodles</option>
              <option value="Pho">Pho</option>
              <option value="Rice">Rice</option>
              <option value="Noodles">Noodles</option>
              <option value="Banh My">Banh My</option>
              <option value="Porridge">Porridge</option>
              <option value="Sticky Rice">Sticky Rice</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="$20"
              required
            />
          </div>
        </div>
        <button type="Submit" className="add-btn">
          ADD
        </button>
      </form>

      {/* ToastContainer riêng cho Add */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        containerId="add-toast"
      />
    </div>
  );
};

export default Add;
