// 1 Crear imports
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";
import { type } from "os";
import { defaultMaxListeners } from "events";

// 2 Que ande el .env
dotenv.config({ path: "../.env" });

// 3 Crear el server en express y asignar el puerto en .env
const app = express();
const PORT = process.env.BACKPORT;

// 4 Cors y express.json para que tome la web y no haya conflicto
app.use(express.json());
app.use(cors());


// 5 Api de prueba

// app.get("/", (req,res) => {
//     res.send("Hello world")
// } )

// 7 Motor de guardado de imagenes
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

// 8 Logica para la carga de imagenes 
app.use('/images', express.static('upload/images'))

// 9 En postman http://localhost:4013/upload -> body -> form-data -> text a file -> key('product') -> Value(buscar en el disco)
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: true,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})

// 10 Schema para Crear producto

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        requided: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }

})

// 24 Schema para el user model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// 25 Crear el endpoint para registrar el usuario
app.post('/signup', async (req, res) => {
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

})

// 32 Endpoint para el userlogin

app.post("/login", async (req, res) => {
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
})

// 10 Http para crear al producto
app.post('/addproduct', async (req, res) => {
    // 14 Generar automaticamente el id en la DB 
    let products = await Product.find({}); // 15 Obtener todos los productos de la BD en un array
    let id; // 16 Crear la variable id 
    if (products.length > 0) { // 17 El producto esta en la BD
        let last_product_array = products.slice(-1); // Se agrega al array el ultimo producto
        let last_product = last_product_array[0]; // Se agrega a last_product
        id = last_product.id + 1; // Se le suma 1 al id
    } else { // 18 Si no hay ninguno ponerle el id 1
        id = 1;
    }

    const product = new Product({
        id: id, // Se agrega el id de el 27
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    // 11 Mostrar el producto en la consola
    console.log(product);
    // 12 Cualquier producto que hayamos creado se guarda en la BD con .save() 
    await product.save();
    console.log("Saved")
    // 13
    res.json({
        success: true,
        name: req.body.name,
    })
})

// 19 Api para borrar productos

app.delete("/removeproduct", async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id }) //20 De la BD de productos se usa la funcion findOne por ID
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
});

// 21 Api para obtener todos los productos

app.get('/allproducts', async (req, res) => {
    let products = await Product.find({}); // 22 Guardamos todos los productos de la BD en una variable
    console.log("All products Fetched");
    res.send(products); //23 Se la mandamos al front
})

// 34 Api para news collection con el admin
app.get("/newcollections", async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// 35 Api para popular in women

app.get("/popularinwomen", async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

// 37 Middleware para fetch user

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using a valid token" })
        }
    }
}

// 36 Api pkara agregar productos al carrito

app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id })
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added")
})

// 37 Remove desde el carrito

app.post("/removefromcart", fetchUser, async (req, res) => {
    console.log("Removed", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id })
    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed")
})

// 38 Obtener el carrito de cada user

app.get("/getcart",fetchUser, async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


// 6 Conexion a BD y a Puerto
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


