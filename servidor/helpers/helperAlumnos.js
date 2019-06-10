const hbs = require('hbs');
const path = require('path');
const directorioData = path.join(__dirname,'../data');
const fs = require('fs');


const iniciarFileCursos = () => {
    try {
        listaCursos = JSON.parse(fs.readFileSync(directorioData+'/cursos.json'));
    }catch (error) {
        listaCursos = [];
    }
}

const iniciarFileEstudiantes = () => {
    try {
        listaEstudiantes = JSON.parse(fs.readFileSync(directorioData+'/estudiantes.json'));
    }catch (error) {
        listaEstudiantes = [];
    }
}

hbs.registerHelper('inscribirCurso',(identidad,nombreIns,correo,celular,cursoid) => {
    
    iniciarFileCursos();
    iniciarFileEstudiantes();

    let estudiante = crearObjetoEstudiante(identidad,nombreIns,correo,celular);
    let curso = crearObjetoCurso(cursoid);
    
    console.log(estudiante);
    console.log(curso);

    guardarEstudiante(estudiante);
    
 
})

const crearObjetoEstudiante = (identidad,nombreIns,correo,celular)  => {
    let estudiante ={
        identidad: identidad,
        nombreIns: nombreIns,
        correo: correo,
        celular: celular
    }
    return estudiante;
}

const crearObjetoCurso = (id,nombre,desc,val,mod,horas,estado)  => {
    let curso =  listaCursos
                    .filter(curso => curso.id === id);
    return curso;
}

const guardarEstudiante = (estudiante) => {

    iniciarFileEstudiantes();

    let estDuplicado = listaEstudiantes.find(est => est.identidad === estudiante.identidad)
    if (!estDuplicado) {
        listaEstudiantes.push(estudiante);
        guardarArchivoEstudiantes();
    }else{
        console.log('Ya existe un estudiante con ese numero de identificacion registrado en la BD');
    }
}

const guardarArchivoEstudiantes = () => {
    let datos = JSON.stringify(listaEstudiantes);
    fs.writeFile(directorioData+'/estudiantes.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo de estudiantes credo exitosamente');
    })
}