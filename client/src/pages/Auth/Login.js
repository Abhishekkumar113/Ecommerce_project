import React,{useState} from 'react'
import Layout from '../../components/Layout'
// import {toast} from 'react-toastify'
import axios from 'axios'
import {  useNavigate ,useLocation} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import '../../styles/Authstyle.css';
import { useAuth } from '../../context/auth';
   
   export const Login = () => {
        const[email,setEmail]=useState("");
        const[password,setPassword]=useState("");
        const[auth,setAuth]=useAuth();
        const navigate=useNavigate();
        const location =useLocation();
        //form function
        const handlesubmit =async(e)=>{
            e.preventDefault();
            try {
              
               const res=await axios.post(`http://localhost:5000/api/v1/auth/login`,
                                          {email,password});
               if(res.status===200){
                toast.success(res.data.message);
                setAuth({ 
                  ...auth,
                  user:res.data.user,
                  token:res.data.token,
                });
                //for saving in local storage
                localStorage.setItem('auth',JSON.stringify(res.data));
                navigate(location.state || '/');
               }
               else{
                toast.error(res.data.message)
                
               }
            } catch (error) {
              console.log('error');
              toast.error('something went wrong');
              
            }
          };
     return (
        
        <Layout   title={'Register here'}   >
        <div className='form-container'>
        <form onSubmit={handlesubmit}>
          <h4>LOGIN FORM</h4>
          <div className="mb-3">
           
            
           
          </div>
          <div className="mb-3">
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail"
              aria-describedby="emailHelp"
              placeholder="Enter Email Address"
              required
            />
           
          </div>
          <div className="mb-3">
           
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder=" Enter Your Password"
              required
            />
          </div>
        
          
          <div className='mb-3'>
          <button type="button" className="btn btn-primary" onClick={()=>navigate('/forgotPassword')}>
            FORGOT PASSWORD 
          </button>
          </div>
          <button type="submit" className="btn btn-primary">
            LOGIN NOW
          </button>
        </form>
         </div>
             
        </Layout>
     )
   }
   

