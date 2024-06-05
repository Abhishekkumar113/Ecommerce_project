import React,{useState} from 'react'
import Layout from '../../components/Layout'
// import {toast} from 'react-toastify'
import axios from 'axios'
import {  useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import '../../styles/Authstyle.css';

export const ForgotPassword = () => {
        const[email,setEmail]=useState("");
        const[newPassword,setNewPassword]=useState("");
        const[answer,setAnswer] = useState("");
        const navigate=useNavigate();
        //form function
        const handlesubmit =async(e)=>{
            e.preventDefault();
            try {
              
               const res=await axios.post(`http://localhost:5000/api/v1/auth/forgot-password`,
                                          {email,newPassword,answer});
               console.log("respoense",res)
               if(res.status===200){
                toast.success(res.data.message);
                
                //for saving in local storage
                localStorage.setItem('auth',JSON.stringify(res.data));
                navigate( '/Login');
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
   <Layout title={'Forgot Password - Ecommerce App'}>
 <div className='form-container'>
        <form onSubmit={handlesubmit}>
          <h4>RESET PASSWORD</h4>
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
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputAnswer"
              aria-describedby="emailHelp"
              placeholder="Enter Your Favorite Sport Name "
              required
            />
           
          </div>
          <div className="mb-3">
           
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder=" Enter Your New Password"
              required
            />
          </div>
        
          
         
          <button type="submit" className="btn btn-primary">
            RESET
          </button>
        </form>
         </div>

   </Layout>
  )
}
