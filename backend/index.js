// 1 Crear imports
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import { type } from "os";
import connectDB from "./config/db.js";

// 2 Que ande el .env
dotenv.config();

// 3 Crear el server en express y asignar el puerto en .env
const app = express();
const PORT = process.env.PORT;

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
    filename: (req,file,cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// 8 Logica para la carga de imagenes 
app.use('/images',express.static('upload/images'))

// 9 En postman http://localhost:4013/upload -> body -> form-data -> text a file -> key('product') -> Value(buscar en el disco)
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success: true,
        image_url:`http://localhost:${PORT}/images/${req.file.filename}`
    })
})

// 10 Schema para Crear producto

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image_url:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type: Number,
        requided:true,
    },
    old_price:{
        type: Number,
        required:true,
    },
    date:{
        type: Date,
        default:Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    }

})

// 10 Http para crear al producto
app.post('/addproduct', async (req,res) => {
    // 14 Generar automaticamente el id en la DB 
    let products = await Product.find({}); // 15 Obtener todos los productos de la BD en un array
    let id; // 16 Crear la variable id 
    if(products.length>0){ // 17 El producto esta en la BD
        let last_product_array = products.slice(-1); // Se agrega al array el ultimo producto
        let last_product = last_product_array[0]; // Se agrega a last_product
        id = last_product.id+1; // Se le suma 1 al id
    }else{ // 18 Si no hay ninguno ponerle el id 1
        id=1;
    }

    const product = new Product({
        id:id, // Se agrega el id de el 17
        name:req.body.name,
        image_url:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    // 11 Mostrar el producto en la consola
    console.log(product);
    // 12 Cualquier producto que hayamos creado se guarda en la BD con .save() 
    await product.save();
    console.log("Saved")
    // 13
    res.json({
        success:true,
        name:req.body.name,
    })
})

// 19 Api para borrar productos

app.delete("/removeproduct", async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id}) //20 De la BD de productos se usa la funcion findOne por ID
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
});

// 21 Api para obtener todos los productos

app.get('/allproducts', async(req,res) => {
    let products = await Product.find({}); // 22 Guardamos todos los productos de la BD en una variable
    console.log("All products Fetched");
    res.send(products); //23 Se la mandamos al front
})

//


// 6 Conexion a BD y a Puerto
connectDB().then(() => {
  app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});


