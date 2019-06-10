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

const iniciarFileinscripciones = () => {
    try {
        listaInscripciones = JSON.parse(fs.readFileSync(directorioData+'/inscripciones.json'));
    }catch (error) {
        listaInscripciones = [];
    }
}

hbs.registerHelper('inscribirCurso',(identidad,nombreIns,correo,celular,cursoid) => {
    
    let estudiante = crearObjetoEstudiante(identidad,nombreIns,correo,celular);
    let curso = crearObjetoCurso(cursoid);
    
    guardarEstudiante(estudiante);

    guardarInscripcionCurso(estudiante,curso);

 
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

const crearObjetoCurso = (id)  => {
    let curso =  listaCursos
                    .filter(curso => curso.id === id);
    return curso[0];
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

const guardarInscripcionCurso = (estudiante,curso) => {

    iniciarFileinscripciones();
    iniciarFileCursos();

    let ins =  listaInscripciones
                .filter(ins => ins.curso === curso.id);
    let salon = ins[0].estudiantes;

    let incDuplicada = salon.find(estudiante.identidad)
    if (!incDuplicada) {

        listaInscripciones.push( crearObjetoInscripcion(estudiante,curso) );
        guardarArchivoInscripciones();
        
    }else{
        console.log('Ya existe un estudiante con ese numero de identificacion registrado en el curso solicitado');
    }
}

const guardarArchivoInscripciones = () => {
    let datos = JSON.stringify(listaInscripciones);
    fs.writeFile(directorioData+'/inscripciones.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo de inscripciones credo exitosamente');
    })
}

const crearObjetoInscripcion = (estudiante,curso)  => {

    let inscripcion ={
        curso: curso.id,
        estudiantes: [estudiante.identidad]
    }
    return inscripcion;
}