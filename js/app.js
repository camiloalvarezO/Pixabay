const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion')


const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = ()=>{
    formulario.addEventListener('submit',validarFormulario)
}

function validarFormulario(e){
    e.preventDefault();
    const terminobusqueda = document.querySelector('#termino').value;

    if(terminobusqueda === ''){

        mostrarMensaje('El termino de busqueda es obligatorio');
        return;
    }

    consultarAPI()
}

function consultarAPI(){
    termino = document.querySelector('#termino').value.trim();
    
    const key= `42176790-94a31972cc4876d364355eee9`;
    const url= `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    console.log(termino);
    console.log(url);
    fetch(url)
        .then(resultado => resultado.json())
        .then(respuesta => {
            totalPaginas = calcularPaginas(respuesta.totalHits)
            console.log(totalPaginas);
            mostrarRespuesta(respuesta.hits)
        })

}

function mostrarRespuesta(imagenes){

    while (resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    };
    console.log(imagenes);
    
    imagenes.forEach(imagen =>{
        const {previewURL,likes,views,largeImageURL} = imagen;

        resultado.innerHTML +=`
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">

                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
                    <p class="font-bold">${views} <span class="font-light"> veces vista </span></p>
                    <a 
                    href="${largeImageURL}" 
                    class="block text-white text-center hover:bg-blue-400 bg-blue-700 uppercase font-bold p-1 mt-3 rounded" target="_blank" ref="noopener noreferrer"
                    >Ver Imagen</a> 
                </div>
            </div>
        </div>
        `;

        })
        while(paginacionDiv.firstChild){
            paginacionDiv.removeChild(paginacionDiv.firstChild);
        }
        
        imprimirPaginador();
}
function mostrarMensaje(mensaje){
    const existealerta = document.querySelector('.bg-red-100')
    if(!existealerta){

        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded',
        'max-w-lg','mx-auto','mt-6','text-center');
        alerta.innerHTML = `
        <strong class= "font bold">Error!</strong>
        <span class"block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);
        setTimeout(() => {
        alerta.remove();
        }, 3000);
    }

}

function *crearPaginador(total){

    for (let i = 1; i <= total; i++) {
        yield i; // registra la pagina en el generador
        
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registrosPorPagina))
}

function imprimirPaginador(){
    
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value,done} = iterador.next();

        if(done) return; // si el iterador terminó, no siga generando más botones

        const boton = document.createElement('a');
        boton.textContent = value;
        boton.dataset.pagina = value;
        boton.href = '#';
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-2','mr-2','font-bold','rounded');

        boton.onclick = ()=> {
            paginaActual = value;
            
            consultarAPI();
        };
        paginacionDiv.appendChild(boton);
    }
}