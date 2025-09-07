import express from "express";
import { addProduct, removeProduct, getAllProducts, getNewCollection, getPopularInWomen } from "../controllers/products/productsController.js";

const router = express.Router();

router.post("/addproduct/", addProduct);
router.delete("/removeproduct/", removeProduct);
router.get("/allproducts", getAllProducts)
router.get("/newcollection", getNewCollection)
router.get("/popularinwomen", getPopularInWomen)


export default router;
