import Users from "../../models/User.js";
import jwt from 'jsonwebtoken';

export async function addToCart(req, res) {
    console.log("Added", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id })
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added")
}

export async function removeFromCart(req, res) {
    console.log("Removed", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id })
    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed")
}

export async function getCart(req,res) {
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
}

export async function loginUser(req, res) {
    // 33 Checkea si el login es correcto
    let user = await Users.findOne({ email: req.body.email })
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    }
    else {
        res.json({ success: false, errors: "Wrong Email" })
    }
}

export async function registerUser(req, res) {
    // 26 Checkear si el email no esta en uso
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email" })
    }
    // 27 se crea un carrito vacio
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    // 28 Crear el usuario
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    // 29 Se guarda el user en la BD
    await user.save();

    // 30 JWT
    const data = {
        user: {
            id: user.id
        }
    }

    // 31 Crear el token
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })
    
}

export default { addToCart, removeFromCart, getCart, loginUser, registerUser };