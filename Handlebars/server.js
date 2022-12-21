//Clase para trabajar con productos
const fs = require('fs');

//Creo contenedor de archivo.txt
class Contenedor{
    constructor (nombre){
        this.nombre = nombre;
        this.articulos = []; 
    }

//Metodo para agregar un objeto al contenedor
    async save(obj){

        //Asigno id a cada producto
        const art = this.articulos;
        let newId= 1;
        if (art.length !== 0){
            newId = art.length + 1;
        }
        else{
            newId;
        }
        const newObject = {id: newId, ...obj};
        art.push (newObject);

        console.log(`El ID asignado es: ${newId}`);
        

        //creo archivo y guardo el contenido
        try {
            const products = JSON.stringify(art,null,2);
            await fs.promises.writeFile(this.nombre,products)
            console.log(`Contenido agregado con exito: ${products}`);
            

        } catch (error) {
            console.log(`Error: ${error}`);
        }

        
    }

//Metodo para buscar un producto por ID    
      getById(id){
        const products = this.articulos;
        //filtro el producto por su id y lo muestro en consola
        const idProduct = products.filter( (prod) =>  prod.id == id)
        return console.log(idProduct);
    }

//Metodo que muestra la lista de productos
    async getAll(){
        try {
            const allproducts = await fs.promises.readFile(this.nombre,"utf-8")
            return console.log(`Funcion getAll: ${allproducts}`);
        } catch (error) {
            console.log(`Error: ${error}`);
        } 
    }

//Metodo que elimina un producto por su numero de id y actualiza el listado de articulos    
    async deleteById(id){
        const products = this.articulos;
        //filtro producto por su id
        const idProduct = products.filter( (prod) =>  prod.id == id)
        //obtengo el indice del producto dentro del array
        const indexProduct = products.indexOf(idProduct);
        //elimino producto
        products.splice(indexProduct,1);

        //actualizo archivo
        try {
            const newProducts = JSON.stringify(products,null,2);
            await fs.promises.writeFile(this.nombre,newProducts)
            console.log(`Contenido modificado: ${newProducts}`);
            

        } catch (error) {
            console.log(`Error: ${error}`);
        }



    }

//Metodo que borra el archivo products.txt
   deleteAll(){
    
        fs.unlink(this.nombre,error =>{
            if (error){
                console.log("error, no se pudo eliminar el archivo");
            }
            else{
                console.log("archivo eliminado con exito")
            }
        })
       
    
   }
}
const products = new Contenedor("products.txt");
products.save(
    {
        title:"Escritorio", 
        price: 15000, 
        thumbnail: "https://cdn2.iconfinder.com/data/icons/household-things/64/house_desk-256.png"
    },
); 
products.save(
    {
        title:"Rack Tv", 
        price: 20000, 
        thumbnail:"https://cdn4.iconfinder.com/data/icons/furniture-2033/32/tv__table-256.png"
    },
); 
products.save(
    {
        title:"Mesa Ratona", 
        price: 10000, 
        thumbnail:"https://cdn1.iconfinder.com/data/icons/furniture-422/64/desk_furniture_interior_table_decoration_12-256.png"
    },
); 

//SERVIDOR
const express = require ('express');
const app = express();

//Cargo el modulo handlebars
const { engine } = require('express-handlebars')

//Rutas
const routeApiProductos = express.Router()

routeApiProductos.use(express.json())
routeApiProductos.use(express.urlencoded({ extended: true }))

app.use('/api/productos', routeApiProductos)

//Configuracion handlebars

app.engine('hbs', engine({
    extname: 'hbs',
})
);

app.set('view engine', 'hbs');
app.set('views','./views');


//Muestra formulario para cargar productos
routeApiProductos.get('/', (req, res) => {
    const {articulos} = products
    res.render('formulario', {articulos})   
    
})


//Muestra todos los productos
routeApiProductos.get('/listado', (req, res) => {
    const {articulos} = products
    res.render('tabla', {list: articulos, listExist:true,})   
    
})

//Recibe y agrega un producto
routeApiProductos.post('/', (req, res) => {
    products.save(req.body)
    res.redirect('/api/productos')
})


const PORT = 8080; 
const server = app.listen(PORT, ()=> {
    console.log(`Servidor http corriendo en el puerto: ${server.address().port}`)
})

server.on('error', error => console.log(`Error en servidor ${error}`))