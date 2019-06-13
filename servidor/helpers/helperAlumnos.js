const hbs = require('hbs');
const path = require('path');
const directorioData = path.join(__dirname,'../data');
const fs = require('fs');
listaRegistrados = []


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

const iniciarFileRegistrados = () => {
    try {
        listaRegistrados = JSON.parse(fs.readFileSync(directorioData+'/registro.json'));
    }catch (error) {
        listaRegistrados = [];
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

const guardarRegistro=()=>{
    let datos = JSON.stringify(listaRegistrados);
    fs.writeFile(directorioData+'/registro.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo de registros credo exitosamente');
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
    let arrSalon = salon;
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

hbs.registerHelper('eliminarInscripcion',(id,curso) => {
    
    iniciarFileinscripciones();

    //guardar los otros curson que no van a ser afectados
    let listIns = listaInscripciones
                    .filter(ins => ins.curso !== curso);

    //tomar el curso al que se le va a quitar el estudiante
    let ins =  listaInscripciones
        .filter(ins => ins.curso === curso);

    //eliminar el estudiante de la lista de inscritos    
    let salon = ins[0].estudiantes.filter(identificacion => identificacion !== id);    
    
    nuevoCurso = crearObjetoCursoInscripcion(curso,salon);

    listaInscripciones = listIns;
    listaInscripciones.push(nuevoCurso);    

    guardarArchivoInscripciones();

})

const crearObjetoCursoInscripcion = (curso,salon)  => {

    let nuevoCursoConEstudiantes ={
        curso: curso,
        estudiantes: salon
    }
    return nuevoCursoConEstudiantes;
}

hbs.registerHelper('listarRolEstudiante',() => {
    
    iniciarFileRegistrados();

    let texto = ' <table border="1"> \
        <thead> \
        <th> Cedula: </th> \
        <th> Nombre: </th> \
        <th> Rol: </th> \
        </thead> \
        <tbody>';

    listaRegistrados.forEach(aux => {

            texto =  texto +'<tr><td>' + aux.id + '</td>' +
                           '<td>' + aux.name + '</td>' +
                            '<td>' + aux.rol + '</td>'+'</td></tr>';
        });

        texto = texto +' </tbody> </table> ';
     
    return texto;    
})



hbs.registerHelper('modificar',()=>{
    iniciarFileRegistrados()
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> Id </th> \
        <th> User </th> \
        <th> Nombre </th> \
        <th> Mail </th> \
        <th> Numero </th> \
        <th> Rol </th> \
        </thead> \
        <tbody>';

    listaRegistrados.forEach(aux => {
            texto =  texto +'<tr><td> '+aux.id+'</td>' +
                           '<td>' + aux.user + '</td>' +
                           '<td>' + aux.name + '</td>' +
                           '<td>' + aux.mail + '</td>' +
                           '<td>' + aux.numero + '</td>' +
                            '<td>' + aux.rol + '</td>'+'</td></tr>';
        });

        texto = texto +' </tbody> </table> ';
     
    return texto; 
})

hbs.registerHelper('cambiarParams',(id,user, nombre, mail,numero,rol)=>{
    iniciarFileRegistrados()
    let usuario = listaRegistrados.find(registrado=> registrado.id == id);
    if(!usuario){
        console.log('El usuario no existe')
    }else{
            usuario['user']=user
            usuario['name']= nombre
            usuario['mail']= mail
            usuario['numero']= numero
            usuario['rol']= rol
        guardarRegistro()
    }
   
})