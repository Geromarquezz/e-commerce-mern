import Product from "../../models/Product.js";

export async function addProduct (req, res) {
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
}

export async function removeProduct (req, res){
    await Product.findOneAndDelete({ id: req.body.id }) //20 De la BD de productos se usa la funcion findOne por ID
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
};

export async function getAllProducts(req,res) {
    let products = await Product.find({}); // 22 Guardamos todos los productos de la BD en una variable
    console.log("All products Fetched");
    res.send(products); //23 Se la mandamos al front
};

export async function getNewCollection(req,res) {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
}

export async function getPopularInWomen(req, res) {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
}



export default { addProduct, removeProduct, getAllProducts, getNewCollection, getPopularInWomen } ;



