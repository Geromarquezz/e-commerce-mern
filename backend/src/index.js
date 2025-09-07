// 1 Crear imports
import express from "express";
import dotenv from "dotenv";
import multer from "multer"; //imagenes
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";

//Importaciones de Routes
import productsRoutes from './routes/productsRoutes.js'
import usersRoutes from './routes/usersRoutes.js'

// 2 Que ande el .env
dotenv.config({ path: "../../.env" });

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

// 9 En postman http://localhost:port/upload -> body -> form-data -> text a file -> key('product') -> Value(buscar en el disco)
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: true,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})

// 10 Schema para Crear producto

// 24 Schema para el user model

// 25 Crear el endpoint para registrar el usuario

// 32 Endpoint para el userlogin

// 10 Http para crear al producto

app.use('/', productsRoutes);

// 19 Api para borrar productos

// 21 Api para obtener todos los productos

// 34 Api para news collection con el admin

// 35 Api para popular in women

// 37 Middleware para fetch user

app.use("/", usersRoutes);

// 36 Api para agregar productos al carrito

// 37 Remove desde el carrito

// 38 Obtener el carrito de cada user

// 6 Conexion a BD y a Puerto
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


