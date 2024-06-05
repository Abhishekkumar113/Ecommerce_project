import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from 'fs'
import mongoose from "mongoose";
import braintree from "braintree";
import exp from "constants";
import dotenv from "dotenv";

dotenv.config();

// // payment gateway
var gateway = new braintree.BraintreeGateway({
   environment: braintree.Environment.Sandbox,
   merchantId: process.env.BRAINTREE_MERCHANT_ID,
   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
 });


export const createProductController =async(req,res)=>{
    try {
         const{name,slug,description,price,category,quantity,shipping} = req.fields;
         const{photo} = req.files;
         //validations
         switch(true)
         {
             case !name:
                 return res.status(500).send({error:'Name is Required'});
             case !description:
                return res.status(500).send({error:'description is Required'});
             case !price:
                return res.status(500).send({error:'price is Required'});
             case !category:
                return res.status(500).send({error:'category is Required'});
            case !quantity:
                 return res.status(500).send({error:'quantity is Required'});
            case photo && photo.size >100000:
                return res.status(500).send({error:'photo is Required and should be less than 1 mb'});
         }

         const products = new productModel({...req.fields,slug:slugify(name)})
         if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType=photo.type;
         } 
         await products.save(); 
         res.status(201).send({
            success:true, 
            message:"Product Created Successfully", 
            products,
         });
    } catch (error) {
         console.log(error);  
          res.status(500).send({
            success:false,
            error,
            message:'Eroor in Creating Product'
          })
    }
};

// get all productController
 export const getproductController =async(req,res)=>{
    try {
       const products = await productModel.
       find({}).
       populate('category').//populte category me v us product ka id name slug rkheaga
       select("-photo").
       limit(12).
       sort({createdAt:-1});
       res.status(200).send({
         success:true,
         totalCount:products.length,
         message:"All products",
         products,

       })
        
    } catch (error) {
      console.log(error);
      res.status(500).send({
         success: false, 
         message:"Error in getting product",
         error:error.message
      })
      
    }
 };

 // single product
 export const getSingleProductController = async(req,res)=>{
   try {
       const product = await productModel
       .findOne({slug:req.params.slug})
       .select("-photo")
       .populate("category");
       res.status(200).send({
         success:true,
         message:"Single Product Fetched",
         product
       })
   } catch (error) {
      console.log(error);
      res.status(500).send({
         status:false,
         message:"Error in getting single product",
         error
      })
      
   }

 }


 // get photo
  export const productPhotoController =async(req,res)=>{
          try {

            const { pid } = req.params;

        if (!mongoose.isValidObjectId(pid)) {
            return res.status(400).send({
                status: false,
                message: 'Invalid product ID',
            });
        }

              const product = await productModel.findById(pid).select("photo")
              if(product.photo.data){
               res.set("Content-type",product.photo.contentType);
                return res.status(200).send(product.photo.data);
              }


          } catch (error) {
            console.log(error);
            res.status(500).send({
               status:false, 
               message:'Error in getting photo',
               error,
            })
            
          }
  }

  // delete productController
  export const deleteProductController =async(req,res)=>{
   try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
         success:true,
         message:"product deleted successfully",
        })
   } catch (error) {
      console.log(error);
      res.status(500).send({
         success:false,
         message:"Error in deleting photo",
         error,
      })
      
   }
  };

  // update product controller
  export const updateProductController =async(req,res)=>{
   try {
      const{name,slug,description,price,category,quantity} = req.fields;
      const{photo} = req.files;
      //validations
      switch(true)
      {
          case !name:
              return res.status(500).send({error:'Name is Required'});
          case !description:
             return res.status(500).send({error:'description is Required'});
          case !price:
             return res.status(500).send({error:'price is Required'});
          case !category:
             return res.status(500).send({error:'category is Required'});
         case !quantity:
              return res.status(500).send({error:'quantity is Required'});
         case photo && photo.size >100000:
             return res.status(500).send({error:'photo is Required and should be less than 1 mb'});
      }

      const products = await productModel.findByIdAndUpdate(req.params.pid,
           {...req.fields,slug:slugify(name)},{new:true}
      );  
      if(photo){
         products.photo.data = fs.readFileSync(photo.path);
         products.photo.contentType=photo.type;
      } 
      await products.save(); 
      res.status(201).send({
         success:true, 
         message:"Product Update Successfully", 
         products,
      });
 } catch (error) {
      console.log(error);  
       res.status(500).send({
         success:false,
         error,
         message:'Eroor in update Product'
       })
 }
      
   }

   // product Filter controller
   export const productFilterController = async(req,res)=>{
       try {
          const{checked ,radio}= req.body;
          let args ={};
          if(checked.length >0)args.category = checked
          if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}
          const products = await productModel.find(args)
          res.status(200).send({
            success:true,
            products,
          })
       } catch (error) {
          console.log(error);
          res.status(400).send({
            success:false,
            message:"Error While Filtering Products",
            error
          })
       }
   }

   // product count controoler
   export const productCountController =async(req,res)=>{
      try {
          const total = await productModel.find({}).estimatedDocumentCount()
          res.status(200).send({
            success: true, 
            total,
          })
      } catch (error) {
           console.log(error);
           res.status(400).send({
            message:'Error in product count',
            error,
            success:false
           })
      }
   }
// product list base on page
   export const productListController =async(req,res)=>{
      try {
          const perPage =3;
          const page = req.params.page?req.params.page:1
          const products = await productModel
              .find({})
             .select({})
             .skip((page -1)* perPage)
             .limit(perPage)
             .sort({createdAt:-1});
          res.status(200).send({
            success:true,
            products,
          })
          
      } catch (error) {
         console.log(error);
         res.status(400).send({
            success:false,
            message:'Error in per page ',
            error
         })
      }
   }
  
   // search product controller
   export const searchProductController =async(req,res)=>{
      try {
          const {keyword}=req.params
          const results = await productModel.find({
            $or:[
               {name:{$regex :keyword,$options:"i"}},
               {description:{$regex : keyword,$options:"i"}}
            ]
          }).select("-photo")
          res.json(results)
      } catch (error) {
         console.log(error);
         res.status(400).send({
            success:false, 
            message:false,
            error
         })
      }
   }

   // relatedProductController
   export const relatedProductController =async(req,res)=>{
      try {
         const {pid,cid}=req.params
         const products = await productModel.find({
            category:cid,
            _id:{$ne:pid}
         }).select("-photo")
          .limit(3)
          .populate("category");
          res.status(200).send({
            success:true,
            products,
          })

      } catch (error) {
         console.log(error);
         res.status(400).send({
            success:false,
            message:'error while getting realted product'
         })
      }
   }
//get product by category
   export const productCategoryController =async(req,res)=>{
      try {
              const category = await categoryModel.findOne({slug:req.params.slug});
              const products = await productModel.find({category}).populate("category");
              res.status(200).send({
               success:true,
               category,
               products,
              })
      } catch (error) {
        console.log(error);
        res.status(400).send({
         success:'false',
         message:"Error in getting productCategor",
         error
        })
      }
   }

   //payment gateway controller
   //for token
   export const braintreeTokenController = async(req,res)=>{
      try {
            gateway.clientToken.generate({},function(err,response){
              if(err) {
               res.status(500).send(err);
              }else{
               res.send(response);
              }
            });
      } catch (error) {
         console.log(error);
      }
   };

   // for payment
   export const braintreePaymentController =async(req,res)=>{
      try {
           const {cart_product_id,nonce}= req.body
          

            
            const cart = await Promise.all(cart_product_id.map(async (id) => {
               const product = await productModel.findOne({_id: id}); 
               return product;
           }));
           
           
           

           let total =0;
           cart.map((i) =>{
            total +=i.price;
           });
           let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
               submitForSettlement:true
            }
           },
           function(error,result){
            if(result){
               const order = new orderModel({
                  products:cart ,
                  payment: result,
                  buyer :req.user._id
               }).save();
               res.json({ok:true})
            }
            else{
               res.status(500).send(error)
            }
           }
            //  function(error,result){

            //  }
           )
      } catch (error) {
         console.log(error);
         
      }
   };