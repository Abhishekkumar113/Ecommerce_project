import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout'
// import {toast} from 'react-toastify'
import axios from 'axios'
import {  useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

import '../../styles/Authstyle.css';




export const Register = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[phone,setPhone]=useState("");
  const[address,setAddress]=useState("");
  const[answer,setAnswer]=useState("");
  const navigate=useNavigate();

 

  const handlesubmit =async(e)=>{
    e.preventDefault();
    try {
       const res=await axios.post(`http://localhost:5000/api/v1/auth/register`,
       {name,email,password,phone,address,answer});
       console.log("response",res)
       console.log(" m here")
       if(res.status===201){
       
        toast.success(res.data.message);
        navigate('/Login');
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
      <h4 className='text-center'>REGISTER FORM</h4>
      <div className="mb-3">
       
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          id="exampleInputname"
          aria-describedby="emailHelp"
          placeholder="Enter Your Name"
          required
        />
       
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
      <div className="mb-3">
       
        <input
          type="text"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          className="form-control"
          id="exampleInputPhone"
          aria-describedby="emailHelp"
          placeholder="Enter Your Phone "
          required
        />
       
      </div>
      <div className="mb-3">
        
        <input
          type="text"
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
          className="form-control"
          id="exampleInputAddress"
          aria-describedby="emailHelp"
          placeholder="Enter your Address"
          required
        />
       
      </div>
      <div className="mb-3">
        
        <input
          type="text"
          value={answer}
          onChange={(e)=>setAnswer(e.target.value)}
          className="form-control"
          id="exampleInputAnswer"
          aria-describedby="emailHelp"
          placeholder="Enter your favorite sports"
          required
        />
       
      </div>
      
        
      <button type="submit" className="btn btn-primary">
        REGISTER
      </button>
    </form>
     </div>
         
    </Layout>
  )
}
