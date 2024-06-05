import React ,{useState,useEffect} from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { json, useParams } from 'react-router-dom';
import "../styles/ProductDetailsStyles.css";
export const ProductDetails = () => {
  const navigate = useNavigate();
    const params = useParams();
    const [product,setProduct]= useState({})
    const [relatedProducts,setRelatedProducts] = useState([])
    //initial details
    useEffect(() =>{
           if(params?.slug)getProduct()
    },[params?.slug])

    // getProduct
    const getProduct = async()=>{
        try {
             const {data}= await axios.get(`http://localhost:5000/api/v1/product/get-product/${params.slug}`)
             setProduct(data?.product)
             getSimilarProduct(data?.product._id,data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    }

    //get similar product
    const getSimilarProduct = async(pid,cid) =>{
         try {
              const {data} = await axios.get(
                `http://localhost:5000/api/v1/product/related-product/${pid}/${cid}`)
                setRelatedProducts(data?.products)
              
         } catch (error) {
            console.log(error);
            
         }
    }
    return(
      <Layout>
        <div className='row container mt-2' >
          <div className='col-md-6'>
          <img src={`http://localhost:5000/api/v1/product/product-photo/${product._id}`}
                className="card-img-top" 
                alt={product.name} 
                height="300"
                width="350"
                />
          </div>
          <div className='col-md-6 '>
          <h1 className='text-center'>Product Details</h1>
          <h6>Name:{product.name}</h6>
          <h6>Description:{product.description}</h6>
          <h6>Price:{product.price}</h6>
          <h6>Category:{product?.category?.name}</h6>
          <button class="btn btn-secondary ms-1">ADD TO CART</button>


          </div>
        </div>
        <div className='row container'>
           <h6>Similar Products</h6>
           {relatedProducts.length <1 && (<p className='text-center'>No similar product found</p>)}
           <div className='d-flex flex-wrap'>
               {relatedProducts?.map((p) =>(
                        <div className="card m-2" style={{ width: '18rem' }} >
                          <img src={`http://localhost:5000/api/v1/product/product-photo/${p?._id}`}
                                className="card-img-top" alt={p.name} />
                          <div className="card-body">
                            <h5 className="card-title">{p.name}</h5>
                            <p className="card-text">{p.description.substring(0,30)}...</p>
                            <p className="card-text">$ {p.price}</p>
                            <button class="btn btn-primary ms-1" 
                            onClick={()=> navigate(`/product/${p.slug}`)}>More Details</button>
                            <button class="btn btn-secondary ms-1">ADD TO CART</button>
                            </div>
                          </div>
                  
          ))}
               </div>
        </div>
    </Layout>
  )
}
