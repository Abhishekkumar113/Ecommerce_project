import  express  from "express";
import { requireSignIn,isAdmin } from "../middlewares/authMiddleware.js";
import { braintreePaymentController, braintreeTokenController, createProductController, 
         deleteProductController, 
         getSingleProductController, 
         getproductController, 
         productCategoryController, 
         productCountController, 
         productFilterController, 
         productListController, 
         productPhotoController, 
         relatedProductController, 
         searchProductController, 
         updateProductController } from "../controller/productController.js";
 import formidable from 'express-formidable'
const router = express.Router()

// ROUTES
router.post('/create-product',requireSignIn,isAdmin,formidable(), createProductController);
// get product
router.get("/get-product",getproductController);
// single produc
router.get('/get-product/:slug',getSingleProductController);

//get photo
router.get('/product-photo/:pid',productPhotoController)

// delte product
router.delete('/delete-product/:pid',deleteProductController)
//update product
router.put('/update-product/:pid',
              requireSignIn,
               isAdmin,formidable(), 
               updateProductController);

// filter product
router.post('/product-filters',productFilterController);

// product count
router.get('/product-count',productCountController);

// product per page
router.get('/product-list/:page',productListController);
// search product
 router.get('/search/:keyword',searchProductController);

 // similar products
 router.get('/related-product/:pid/:cid',relatedProductController);
 // category wise product
 router.get("/product-category/:slug",productCategoryController);

 // payments routes
 //token
 router.get('/braintree/token',braintreeTokenController)

 //payments
 router.post('/braintree/payment', requireSignIn, braintreePaymentController)
export default router;