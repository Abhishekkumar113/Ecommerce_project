import { useState,useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner";
export default function AdminRoute()
{
    const [ok,setOk]=useState(false);
    const [auth,setAuth]= useAuth();
    useEffect(()=> {
        const authCheck= async ()=>{
            const res=await axios.get("http://localhost:5000/api/v1/auth/admin-auth");
            if(res.data.ok) 
            {
                setOk(true);
            }
            else{
                setOk(false);
            }
        };
        if(auth?.token) authCheck();
    },[auth?.token]);

    return ok ? <Outlet/>:<Spinner path =""/>
}

// //new one
// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/auth";
// import { Outlet } from "react-router-dom";
// import axios from "axios";
// import { Spinner } from "./Spinner";

// export default function PrivateRoute() {
//   const [loading, setLoading] = useState(true);
//   const [ok, setOk] = useState(false);
//   const [auth, setAuth] = useAuth();

//   useEffect(() => {
//     const authCheck = async () => {
//       try {
//         const res = await axios.get("/api/v1/auth/user-auth");  // Assuming a relative URL
//         if (res.data.ok) {
//           setOk(true);
//         } else {
//           setOk(false);
//         }
//       } catch (error) {
//         console.error("Error checking authentication:", error);
//         setOk(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (auth?.token) {
//       authCheck();
//     } else {
//       setOk(false);
//       setLoading(false);
//     }
//   }, [auth?.token]);

// //   if (loading) {
// //     return <Spinner />;
// //   }

//   return ok ? <Outlet /> : <Spinner/>;
// }
