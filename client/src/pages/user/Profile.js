import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout'
import { UserMenu } from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

export const Profile = () => {
  //context
  const[auth,setAuth]= useAuth();
  //state
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[phone,setPhone]=useState("");
  const[address,setAddress]=useState("");

   //get user data
   useEffect(()=>{
    const {email,name,phone,address}= auth?.user
    setName(name)
    setPhone(phone)
    setEmail(email)
    setAddress(address)
  },[auth?.user])

  //form functin
  const handlesubmit =async(e)=>{
    e.preventDefault();
    try {
       const {data}=await axios.put(`http://localhost:5000/api/v1/auth/profile`,
       {name,email,password,phone,address});
      if(data?.error){
        toast.error(data?.error)
      }
      else{
        setAuth({...auth, user:data?.updatedUser});
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem('auth',JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
       
    } catch (error) {
      console.log('error');
      toast.error('something went wrong');
      
    }
  };
  return (

    <Layout title={"Your Profile"}>
    <div className='container-fluid p-3 m-3'>
         <div className='row'>
          <div className='col-md-3'>
           <UserMenu />
          </div>
          <div className='col-md-9'>
          <div className='form-container'>
    <form onSubmit={handlesubmit}>
      <h4 className='text-center'>USER PROFILE</h4>
      <div className="mb-3">
       
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          id="exampleInputname"
          aria-describedby="emailHelp"
          placeholder="Enter Your Name"
          
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
          disabled
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
     
      
        
      <button type="submit" className="btn btn-primary">
        UPDATE
      </button>
    </form>
     </div>
          </div>
         </div> 
    </div>
</Layout>
  )
}
