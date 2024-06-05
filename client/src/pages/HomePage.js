import React,{useEffect, useState}from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import { Checkbox,Radio } from 'antd';
import { Prices } from '../components/Price';
import {  useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import { set } from 'mongoose';
import "../styles/HomePage.css"


export const HomePage = () => {
  const navigate = useNavigate();
  const [cart,setCart] = useCart();
  const [products,setProducts] = useState([]);
  const[categories,setCategories]= useState([]);
  const[checked,setChecked] = useState([]);
  const[radio,setRadio] = useState([]);
  const[total,setTotal]= useState(0);
  const[page,setPage ]= useState(1);
  const[loading,setLoading] = useState(false);

 


  // get all cat
  const getAllCategory = async()=>{
    try {
      const { data } = await axios.get('http://localhost:5000/api/v1/category/get-category');
      if(data?.success){
            setCategories(data.category);
          }
    } catch (error) {
       console.log(error);
    }
   };

   useEffect(() => {
      getAllCategory();
      getTotal();
   } ,[])
  

  //get products
   const getAllProducts = async () =>{
     try{
       setLoading(true);
      const {data}= await  axios.get(`http://localhost:5000/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
     }
     catch(error){
      setLoading(false);
      console.log("Error", error);
     }

   }
  
    // get total count
    const getTotal =async()=>{
      try {
       const { data } = await axios.get('http://localhost:5000/api/v1/product/product-count');
         setTotal(data?.total);
   
      } catch (error) {
          console.log(error);
      }
       }

        useEffect(() =>{
          if(page ===1)return;
          LoadMore();
        },[page])
       // load more
       const LoadMore =async() =>{
             try {
                 setLoading(true)
                 const {data}= await  axios.get(`http://localhost:5000/api/v1/product/product-list/${page}`);
                 setLoading(false)
                 setProducts([...products, ...data?.products])
             } catch (error) {
               console.log(error);
               setLoading(false);
             }
       }

   // filter by cat
   const handleFilter =(value,id) =>{
    console.log("value,id")
     let all = [...checked] // jo v value checked hui hogi uski vlaue all me assign ho jaeyga
      if(value){
        all.push(id);
      }
      else{
        all=all.filter((c) =>c!==id);
      }
      setChecked(all);
    };
    useEffect (() =>{
      if(!checked.length || !radio.length  )getAllProducts();
      //eslint-disable-next-line

    },[checked.length,radio.length]);

    useEffect (() =>{
      if(checked.length || radio.length  ) filterProduct();

    },[checked,radio]);

    // get filtered product
    const filterProduct = async()=>{
      try {
         const {data}= await axios.post('http://localhost:5000/api/v1/product/product-filters',{checked,radio})
         setProducts(data?.products)
      } catch (error) {
         console.log(error)
      }
    }


  return (
    <Layout title={'Best-Offers'} description={'mern stack project'}>
     
      {/* banner image */}
       <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
        <div className='container-fluid row mt-3 home-page'>
            <div className='col-md-3 filters'>
               <h4 className='text-center'>Filter By Category </h4>  
              <div className='d-flex flex-column'>
              {categories?.map((c) =>(
                   <Checkbox 
                      key={c._id} 
                      onChange={(e)=> handleFilter(e.target.checked,c._id)}>
                    {c.name}
                   </Checkbox>
               ))} 
              </div>  
              {/* price filte */}
               <h4 className='text-center mt-4'>Filter By Price </h4>  
              <div className='d-flex flex-column '>
                 <Radio.Group onChange={e => setRadio(e.target.value)}>
                    {Prices?.map(p => (
                      <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>    
                      </div>
                    ))}
                 </Radio.Group>
              </div>  
              <div className='d-flex flex-column'>
                <button className='btn btn-danger'
                 onClick={()=> window.location.reload()}>RESET FILTERS</button>
              </div> 
            </div>
            <div className='col-md-9'>
               <h1 className='text-center'>All Products</h1>
               <div className='d-flex flex-wrap'>
               {products?.map((p) =>(
                        <div className="card m-2" style={{ width: '18rem' }} key={p._id} >
                          <img 
                          src={`http://localhost:5000/api/v1/product/product-photo/${p._id}`}                               
                          className="card-img-top" 
                          alt={p.name} 
                          />
                          <div className="card-body">
                            <h5 className="card-title">{p.name}</h5>
                            <h5 className="card-title card-price">
                               {p.price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </h5>
                            <p className="card-text">{p.description.substring(0,30)}...</p>
                            <button class="btn btn-primary ms-1" 
                            onClick={()=> navigate(`/product/${p.slug}`)}>More Details</button>
                            <button class="btn btn-secondary ms-1" 
                            onClick={()=>{
                              setCart([...cart,p]);
                              // for stroing cart into local storage bcz after refrsh all cart will removed
                              localStorage.setItem('cart',JSON.stringify([...cart,p]))
                              toast.success("Item is added in cart")
                            }}
                            >ADD TO CART</button>
                            </div>
                          </div>
                  
          ))}
               </div>
                    <div>
                        <div className='m-2 p-3'>
                            {products && products.length < total &&(
                              <button className='btn btn-warning'
                                 onClick={(e) =>{
                                  e.preventDefault();
                                  setPage(page+1);
                                 }}>
                                 {loading? "Loading ...":"Loadmore"}
                              </button>
                            )}
                        </div>
                    </div>
               </div>   
            </div>
    </Layout>
  )
}
