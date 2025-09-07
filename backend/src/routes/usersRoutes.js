import express from "express";
import { addToCart, removeFromCart, getCart, loginUser, registerUser } from "../controllers/users/usersController.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

router.post("/addtocart", fetchUser, addToCart)
router.post("/removefromcart",fetchUser, removeFromCart)
router.get("/getcart", fetchUser,getCart)
router.post("/login", loginUser)
router.post("/signup", registerUser)

export default router;
