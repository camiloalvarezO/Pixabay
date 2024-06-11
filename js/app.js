const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;
window.onload= () => {
    document.addEventListener('submit',validarFormulario)
}


function validarFormulario(e){
    e.preventDefault();

    const terminobusqueda = document.querySelector('#termino').value;
    
    if(terminobusqueda === ''){
        mostrarAlerta('Agrega un termino de busqueda');
        return;
 
    }

    buscarImagenes(terminobusqueda)
}

function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){

        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100','border-red-100','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto',
        'mt-6','text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold" > Error! </strong>
            <span class="block sm:inline"> ${mensaje} </span> 
            `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes(){

    const termino = document.querySelector('#termino').value;
    const key = '42176790-94a31972cc4876d364355eee9';
    
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
        console.log(resultado);
        totalPaginas = calcularPaginas(resultado.totalHits); // tomaremos en cuenta los registros totales y los dividiremos
        // entre los registos maximos por pagina que le quiera asignar
        console.log(totalPaginas);
        mostrarImagenes(resultado.hits)    
    })
}
function mostrarImagenes(imagenes){
    console.log(imagenes);
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach(imagen => {
        const {previewURL,likes,views,largeImageURL} = imagen;
        // el w-full no va a tomar efecto en el enlace porque es inline, toca ponerle  block para que salga display block  
                // importantisimo el += !!!!!!!!!!!!!!!!!!!!!!!!!!!!
        resultado.innerHTML += `
            <div class="w:1/2 md:1/3 lg:w-1/4 p-3 mb-4" >
                <div class="bg-white">
                <img class= "w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class= "font-light">Me gusta</span> </p>
                    <p class="font-bold"> ${views} <span class= "font-light">Veces Vista</span> </p>
                    
                    <a
                        class = "w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5   "
                        href=${largeImageURL} target="_blank" rel="noopener noreferrer"
                     >
                    Ver imagen
                    </a>
                </div>
                </div>
            </div>
        `;
    });//target="_blank" rel="noopener noreferrer" se le pone porque _blank tiene vulnerabilidades
    
    //limpiar el paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    //generamos el html
    imprimirPaginador();
    
}

function imprimirPaginador(){ //  el codigo html que registra las paginas, si por ejemplo en café registra 17 paginas, 
    // esto es lo que hace este codigo, va a ver cuantos elementos hay registrados en el generador y va a crear esa cantidad 
    // de paginas, si la siguiente vez sólo hay una pagina, elimina el paginador anterior y crea una pagina 
    iterador = crearPaginador(totalPaginas);
    // el generador y el iterador sólamente nos va a mostrar la cant de elementos que haya registrados en el !generador!
    // console.log(iterador.next().done); // nos dice si terminó en boolean
    // console.log(iterador.next().value); // nos dice la iteración o valor registrado que viene en yield  
    while(true){ //se va a ejecutar este codigo hasta que dentro del codigo hagamos una ruptura o return
        const {value, done} = iterador.next(); // iterador.next(); es la forma en la que se va a despertar el generador
        if(done) return; // si terminó el generador deja de funcionar

        //caso contrario,se crean botones por cada elemento del generador 
        const boton = document.createElement('a');
        boton.href = '#'; // no va a ir a ningún lado, sólo nos llevará de una pagina a otra 
        boton.dataset.pagina = value; //data-pagina será el 1,2,3,4 depende de las paginas
        boton.textContent = value; 
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-3','uppercase','rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes()
        }
        paginacionDiv.appendChild(boton);
    }
}
// con un generador registramos cuantas paginas va a haber, va a permitir iterar sobre todos los registros y te va a decir cuando
// llega al final
// funcion generador de paginas dependiendo del total
function *crearPaginador(total){ // según dice con la explicación de mierda: si tien 17 paginas el generador va a registrar 
    // 17  paginas, si tiene una pagina registra una sola pagina, porque de yield es que se toman los valores
    console.log(total);
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    // convierte el total de registros entre lo que queramos mostrar por pagina al entero más alto en el dado caso 
    return parseInt(Math.ceil(total / registroPorPagina));
}

