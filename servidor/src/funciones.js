const fs = require('fs');
var listaEstudiantes = [];
const path = require('path');
const directorioData = path.join(__dirname,'../data');

let crear = (u,p,r) => {
	listar();
	let est = {
		user: u,
		pass: p,
		rol: r
	};
	listaEstudiantes.push(est)
	console.log(listaEstudiantes);
	guardar();	
}

const listar = () => {
	try{
	listaEstudiantes = require(directorioData+'/registro.json');
	} catch(error){
		listaEstudiantes = [];
	}
}

const guardar = () => {
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFile(directorioData+'/registro.json', datos, (err)=>{
		if (err) throw (err);
		console.log('Archivo creado con éxito');
	})
}

const iniciarFileRegistrados = () => {
    try {
        listaRegistrados = JSON.parse(fs.readFileSync(directorioData+'/registro.json'));
    }catch (error) {
        listaRegistrados = [];
    }
}

const getUser = () => {
    
    iniciarFileRegistrados();

    let texto;

    listaRegistrados.forEach(aux => {

            texto =  aux.user ;
        });

        texto = texto+'';
     
    return texto;    
}


const getPass = () => {
    
    iniciarFileRegistrados();

    let texto;

    listaRegistrados.forEach(aux => {

            texto =  aux.pass ;
        });

        texto = texto+'';
     
    return texto;    
}

const getRol = () => {
    
    iniciarFileRegistrados();

    let texto;

    listaRegistrados.forEach(aux => {

            texto =  aux.rol ;
        });

        texto = texto+'';
     
    return texto;    
}


module.exports = {
	crear,
	getUser,
	getPass,
	getRol
}