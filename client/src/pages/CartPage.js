import React, { useState,useEffect } from 'react'
import Layout from '../components/Layout'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import "../styles/CartStyle.css";

export const CartPage = () => {
  const[auth,setAuth]= useAuth();
  const[cart,setCart]= useCart();
  const[clientToken,setClientToken]= useState("");
  const[instance,setInstance] = useState("");
  const[loading,setLoading]= useState(false)
  const navigate = useNavigate();
  //total price
  const totalPrice =() =>{
    try {
         let total = 0;
         cart?.map(item =>{total = total+item.price});
         return total.toLocaleString("en-US",{
          style: "currency",
          currency:"USD"
         })
    } 
      catch (error) {
       console.log(error);
    }
  }

  // delte item
  const removeCartItem =(pid)=>{
    try {
       let myCart =[...cart];
       let index = myCart.findIndex(item => item._id === pid)
       myCart.splice(index,1)
       toast.success("item has been removed");
       setCart(myCart);
       localStorage.setItem('cart',JSON.stringify(myCart));

    } catch (error) {
        console.log(error);
    }
  };

  //get payment gateway
  const getToken =async() =>{
    try {
         const {data}= await axios.get('http://localhost:5000/api/v1/product/braintree/token');
        //  console.log("fskcm", JSON.stringify(data));
         setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);    
    }
  }
   useEffect(()=>{
    getToken();
   },[auth?.token]);

   //handle Payment
    const handlePayment =async()=>{
      try {
        setLoading(true);
        const { nonce } = await instance.requestPaymentMethod();
       
        const cart_product_id = cart.map(item => item._id);
        
        const { data } = await axios.post("http://localhost:5000/api/v1/product/braintree/payment", {
          nonce,
          // cart,
          cart_product_id
        });
        setLoading(false);
        console.log("data"+data)
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/dashboard/user/orders");
        toast.success("Payment Completed Successfully ");
      } catch (error) {
        console.log(error);
        setLoading(false);
      }


    };

  return (
    <Layout>
         <div className='container'>
             <div className='row'>
                  <div className='col-md-12'>
                      <h1 className='text-center bg-light p-2 mb-1'>
                           {`Hello  ${auth?.token && auth?.user?.name}` }
                      
                      </h1>
                      <h4 className='text-center'>
                      {cart?.length?`You Have ${cart.length} items in your cart ${
                        auth?.token ? "" :"please login to checkout"
                       }`:"Your Cart is empty"
                       }
                      </h4>
                  </div>
             </div>
             <div className='row'>
                 <div className='col-md-8'>
                    {cart?.map((p) => (
                       <div className='row mb-2 p-3 card flex-row'>
                            <div className='col-md-4 '>
                            <img 
                                src={`http://localhost:5000/api/v1/product/product-photo/${p._id}`}                               
                                className="card-img-top" 
                                alt={p.name} 
                                width="100 px"
                                height="100 px"
                             />
                            </div>
                            <div className='col-md-8'>
                            <p >{p.name}</p>
                            <p>{p.description.substring(0,30)}</p>
                            <p>Price: {p.price}</p>
                            <button className='btn btn-danger' onClick={() =>removeCartItem(p._id) }>remove</button>
                            </div>
                       </div>

                    ))} 
                 </div>
                 <div className='col-md-4 text-center'>
                 <h2>Cart Summary</h2>
                 <p>total | CheckOut | Payment</p>
                 <hr/>
                 <h4>Total :{totalPrice()}</h4>
                 {auth?.user?.address?(
                  <>
                     <div className='mb-3'>
                        <h4>Current Address</h4>
                        <h5>{auth?.user?.address}</h5>
                        <button className='btn btn-outline-warning'
                         onClick={()=>navigate('/dashboard/user/profile')}
                        >Update Address</button>
                     </div>

                     {/* console.log({cart}) */}
                  </>
                 ):(
                  <div className='mb-3'>
                    {
                      auth?.token ?(
                        <button className='btn btn-outline-warning' 
                        onClick={()=>navigate('/dashboard/user/profile')}>Update Address</button>
                      ):(
                        <button className='btn btn-outline-warning' 
                        onClick={()=>navigate('/Login',{
                          state:'/cart',
                        })}>Please Login to checkout
                        </button>
                      )
                    }
                  </div>
                 )}
                 <div className='mt-2'>
                 {
                  (clientToken && cart?.length>0) &&
                    <div>
                      <DropIn
                        options={{
                          authorization: clientToken
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />
                      <button 
                        className='btn btn-primary' onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}>
                          {loading ? "Processing ...." : "Make Payment"}
                      </button>
                    </div>
                  }

                 
                    
                 </div>
                 </div>
             </div>
         </div>
    </Layout>
  )
}
