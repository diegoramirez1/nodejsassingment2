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
    
    //guardando estudiante
    guardarEstudiante(estudiante);
    //guardando inscripcion
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
    let salon;         
    if (ins.length > 0) {
        salon = ins[0].estudiantes;
    }

    //validar que no hay una cedula ingresada no esta vinculada a el curso seleccionado
    let arrSalon = [salon];
    let incDuplicada =   arrSalon.find(ced => estudiante.identidad === ced)   

    if (!incDuplicada) {
        
        if (ins.length > 0) {
            //agregando cedula nueva a la lista de estudiantes
            salon.push(estudiante.identidad);
        } else {
            //formo el objeto de inscripcion
            let newIns = crearObjetoInscripcion(estudiante,curso);
            listaInscripciones.push(newIns);
        }

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

hbs.registerHelper('listarInscripciones',() => {
    
    iniciarFileinscripciones();
    iniciarFileCursos();
    iniciarFileEstudiantes();

    console.log(listaInscripciones);

    let texto = ' <table border="1"> \
        <thead> \
        <th> Curso </th> \
        <th> Estudiantes </th> \
        </thead> \
        <tbody>';

    listaInscripciones
        .forEach(inscripcion => {

            texto =  texto +'<tr><td>' + inscripcion.curso + '</td>' +
                            '<td>' + inscripcion.estudiantes + '</td>'+'</td></tr>';
        });

        texto = texto +' </tbody> </table> ';
     
    return texto;    
})