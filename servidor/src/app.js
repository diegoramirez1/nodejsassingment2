const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./funciones');

const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
const directoriohelpers = path.join(__dirname,'../helpers');

require(directoriohelpers+'/helperCursos');
require(directoriohelpers+'/helperAlumnos');

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);


app.set('view engine', 'hbs');

//pagina de inicio sin colocar index en la url
app.get('/',(req,res) => {
    res.redirect('index');
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

//pagina para visualizar las inscripciones
app.get('/inscritos',(req,res) => {
    res.render('inscritos')
});

//pagina para eliminar una inscripcion
app.post('/eliminandoInscripcion',(req,res) => {

    res.render('eliminandoInscripcion', {
        id: req.body.id,
        curso: req.body.curso
    })

    res.redirect('inscritos');
});


//estudiantes
app.get('/inscribir',(req,res) => {
    res.render('inscribir')
});

//secion principal de un estudiante activo
app.get('/micuenta',(req,res) => {
    res.render('micuenta')
});

app.post('/inscribiendoCurso',(req,res) => {

    res.render('inscribiendoCurso',{
        cursoid: req.body.cursoid,
        identidad: req.body.identidad,
        nombreIns: req.body.nombreIns,
        correo: req.body.correo,
        celular: req.body.celular
    })

    res.redirect('inscribir');
});


//pagina para logearse
app.get('/login',(req,res) => {
    res.render('login',{
            user: req.body.user,
            pass: req.body.pass
        })
    let auxUser = funciones.getUser();
    let auxPass = funciones.getPass();
    let auxRol = funciones.getRol();
    if(req.query.user === auxUser && req.query.pass === auxPass && auxRol === "Aspirante"){
        res.redirect('inscribir');
    }else if(req.query.user === auxUser && req.query.pass === auxPass && auxRol === "Coordinador"){
        res.redirect('crearcurso');
    }
});

//pagina para realizar un registro
app.get('/register',(req,res) =>{
    funciones.crear(req.query.id, req.query.name, req.query.email, req.query.tel, req.query.user, req.query.pass, req.query.rol);
    res.render('register',{
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        tel: req.body.tel,
        user: req.body.user,
        pass: req.body.pass
    })
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