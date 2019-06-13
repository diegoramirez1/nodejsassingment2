const fs = require('fs');
var listaEstudiantes = [];
const path = require('path');
const directorioData = path.join(__dirname,'../data');

let crear = (i,n,e,t,u,p,r) => {
	listar();
	let est = {
		id: i,
		name: n,
		email: e,
		tel: t,
		user: u,
		pass: p,
		rol: r
	};
	let duplicado = listaEstudiantes.find(cedula => cedula.id === i);
	if (!duplicado){
		listaEstudiantes.push(est)
		console.log(listaEstudiantes);
		guardar();
	}
	else{
        console.log('Ya existe un aspirante con ese id');
    }
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

            texto =  aux.user + '';
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

const getUserr = (user) => {
   iniciarFileRegistrados();
   let texto = '' ;
        listaRegistrados.filter(aux_user => aux_user.user === user).forEach(aux => {
        texto =  texto + aux.user
    });

    texto = texto +' </tbody> </table> ';

    return texto;
};

/*
const getUserr = () => {
   iniciarFileRegistrados();
   let texto;
        listaRegistrados
        .forEach(aux => {
        texto =  texto + 
        "user:" + aux.user +
        "pass:" +aux.pass });

    texto = texto +' </tbody> </table> ';

    return texto;
};
*/


module.exports = {
	crear,
	getUser,
	getPass,
	getRol,
	getUserr
}