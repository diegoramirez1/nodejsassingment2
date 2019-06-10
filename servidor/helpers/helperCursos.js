const hbs = require('hbs');
const path = require('path');
const directorioData = path.join(__dirname,'../data');
const fs = require('fs');

hbs.registerHelper('listarCursos',() => {
    
    iniciarFile();

    let texto = ' <table border="1"> \
                  <thead> \
                  <th> ID </th> \
                  <th> Nombre </th> \
                  <th> Descripción </th> \
                  <th> Valor </th> \
                  </thead> \
                  <tbody> ';
    
        listaCursos
        .filter(curso => curso.estado === 'Disponible')
        .forEach(curso => {
        texto =  texto + '<tr><td><a href="detallecurso?id='+curso.id+'">' + curso.id + '</a></td>' +
                         '<td>' + curso.nombre + '</td>' +
                         '<td>'  + curso.descripcion + '</td>' +
                         '<td>' + curso.inversion + '</td></tr>'
    });

    texto = texto +' </tbody> </table> ';

    return texto;
})

hbs.registerHelper('listarCursosInscribir',() => {
    
    iniciarFile();

    let texto = ' <table border="1"> \
                  <thead> \
                  <th> ID </th> \
                  <th> Nombre </th> \
                  <th> Descripción </th> \
                  <th> Valor </th> \
                  </thead> \
                  <tbody> ';
    
        listaCursos
        .filter(curso => curso.estado === 'Disponible')
        .forEach(curso => {
        texto =  texto + '<tr><td> <input type="radio" name="cursoid" value="'+curso.id+'" required></td>' +
                         '<td>' + curso.nombre + '</td>' +
                         '<td>'  + curso.descripcion + '</td>' +
                         '<td>' + curso.inversion + '</td></tr>'
    });

    texto = texto +' </tbody> </table> ';

    return texto;
})

hbs.registerHelper('detalleCursos',(id) => {

    iniciarFile();
    
    let texto = ' <table border="1"> \
                  <thead> \
                  <th> ID </th> \
                  <th> Nombre </th> \
                  <th> Descripción </th> \
                  <th> Valor </th> \
                  <th> Modalidad </th> \
                  <th> Intensidad horaria </th> \
                  </thead> \
                  <tbody>';
    
        listaCursos
        .filter(curso => curso.id === id)
        .forEach(curso => {
        texto =  texto + '<tr><td>' + curso.id + '</td>' +
                         '<td>' + curso.nombre + '</td>' +
                         '<td>'  + curso.descripcion + '</td>' +
                         '<td>' + curso.inversion + '</td>' +
                         '<td>' + curso.modalidad + '</td>' +
                         '<td>' + curso.intensidadHoraria + '</td></tr>'
    });

    texto = texto +' </tbody> </table> ';

    return texto;
})

hbs.registerHelper('gestionarCursos',() => {

    iniciarFile();
    
    
    let texto = ' <table border="1"> \
                  <thead> \
                  <th> ID </th> \
                  <th> Nombre </th> \
                  <th> Descripción </th> \
                  <th> Valor </th> \
                  <th> Modalidad </th> \
                  <th> Intensidad horaria </th> \
                  <th> Estado </th> \
                  <th> Estudiantes </th> \
                  <th> Accion </th> \
                  </thead> \
                  <tbody>';
    
        listaCursos
        .forEach(curso => {
        texto = texto + '<form id="'+curso.nombre+'" action="/cerrandoCurso" method="POST">';
        texto =  texto + '<tr><td>' + curso.id + '</td>' +
                         '<td>' + curso.nombre + '</td>' +
                         '<td>'  + curso.descripcion + '</td>' +
                         '<td>' + curso.inversion + '</td>' +
                         '<td>' + curso.modalidad + '</td>' +
                         '<td>' + curso.intensidadHoraria + '</td>' +
                         '<td>' + '<button>' + curso.estado + '</button></td>' + 
                         '<td>' + '<a href="#">Estudiantes</a>' + '</td>' +
                         '<td>' + '<a href="eliminandoCurso?id='+curso.id+'">Eliminar</a>' + '</td></tr>';

        
        texto = texto + '<input type="hidden" name="id" value="'+ curso.id +'"></input>';
        texto = texto + '<input type="hidden" name="estado" value="'+ devolverEstado(curso.estado) +'"></input>';
        texto = texto + '</form>';
    });

    texto = texto +' </tbody> </table> ';


    return texto;
})

const devolverEstado = (estado)  => {
    return estado === 'Disponible' ? 'Cerrado' : 'Disponible';
}

hbs.registerHelper('guardarCurso',(id,nombre,desc,val,mod,horas,estado) => {

    iniciarFile();
    let curso = crearObjeto(id,nombre,desc,val,mod,horas,estado);

    let duplicado = listaCursos.find(curso => curso.id === id)
    if (!duplicado) {
        listaCursos.push(curso);
        guardar();
    }else{
        console.log('Ya existe un curso con ese id');
    }

})


hbs.registerHelper('eliminarCurso',(id) => {

    iniciarFile();
    let existe = listaCursos.find(curso => curso.id === id)

    if (existe){
        listaCursos = listaCursos.filter(curso => curso.id !== id);
        console.log('Curso eliminado exitosamente');
        guardar();
    }else{
        console.log('El id ingresado no pertenece a ningun curso');
    }

})

hbs.registerHelper('cerrarCurso',(id,estado) => {

    iniciarFile();
    let existe = listaCursos.find(curso => curso.id === id)

    if (existe){
        //guardando todos menos el que se va a modificar
        listaCursos = listaCursos.filter(curso => curso.id !== id);
        //modificando
        let arr = [existe];                
        let arr2 = arr.map( curso => ({ ...curso, estado:estado }));
        //guardando de nuevo el modificado
        listaCursos.push(arr2[0]);
        console.log('Curso cerrado exitosamente');
        guardar();
    }else{
        console.log('El id ingresado no pertenece a ningun curso');
    }

})

const crearObjeto = (id,nombre,desc,val,mod,horas,estado)  => {
    let curso ={
        id: id,
        nombre: nombre,
        descripcion: desc,
        inversion: val,
        modalidad: mod,
        intensidadHoraria: horas,
        estado: estado
    }
    return curso;
}

const guardar = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile(directorioData+'/cursos.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo credo con exito');
    })
}

const iniciarFile = () => {
    try {
        listaCursos = JSON.parse(fs.readFileSync(directorioData+'/cursos.json'));
    }catch (error) {
        listaCursos = [];
    }
}