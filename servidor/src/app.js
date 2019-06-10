const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
const directoriohelpers = path.join(__dirname,'../helpers');

require(directoriohelpers+'/helperCursos')

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);


app.set('view engine', 'hbs');

//pagina de inicio sin colocar index en la url
app.get('/',(req,res) => {
    res.render('index')
});

//pagina de inicio url index
app.get('/index',(req,res) => {
    res.render('index')
});

//pagina principal de ver cursos
app.get('/vercursos',(req,res) => {
    res.render('vercursos')
});

//pagina detalle de un curso
app.get('/detallecurso',(req,res) => {
    res.render('detallecurso', {
        id: req.query.id
    })
});

//pagina para el coordinador listar todos los cursos y crear
app.get('/crearcurso',(req,res) => {
    res.render('crearcurso')
});

//pagina para agregar un curso
app.post('/creandoCurso',(req,res) => {

    res.render('creandoCurso', {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        modalidad: req.body.modalidad,
        intensidad: parseInt(req.body.intensidad),
        estado: req.body.estado,
    })

    res.redirect('crearcurso');
});

//pagina para eliminar un curso
app.get('/eliminandoCurso',(req,res) => {

    console.log(req.query);

    res.render('eliminandoCurso', {
        id: req.query.id
    })

    res.redirect('crearcurso');
});

//pagina para cerrar un curso
app.post('/cerrandoCurso',(req,res) => {
    
    res.render('cerrandoCurso', {
        id: req.body.id,
        estado: req.body.estado
    })

    res.redirect('crearcurso');
});




//para manejar error en cualquier pagina no especificada
app.get('*',(req,res) => {
    res.render('error', {
        estudiante: 'Error'
    })
});

//inciar la aplicacion
app.listen(3000, () => {
    console.log('Escuchando por el puerto 3000');
});