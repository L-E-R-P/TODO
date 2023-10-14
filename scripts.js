const $inputText = document.querySelector(".input-text");
const $contenedorTareas = document.querySelector(".contenedor-tareas");
const $numeroTareas = document.querySelector(".num-p");
const $reloj = document.querySelector("header p");
const $ventanaModal = document.querySelector(".ventana-modal");
const $categorias = document.querySelector(".categorias");
const $categoria = document.querySelector(".todas");
let categoriaActual = localStorage.key(0);

//crea un templete html y lo inserta en el contenedor de las tareas, el parametro contendido hace referencia el texto que se va insertar
function agregarTarea(contenido, clase, checked, contexto, categoria) {
  if (contexto) {
    let cadenaFormateada = contenido.replace(/,/g, "~");

    const tarea = JSON.parse(localStorage.getItem(categoria));
    tarea["activas"].push(cadenaFormateada);

    localStorage.setItem(
      categoria,
      JSON.stringify({ activas: tarea["activas"], listas: [] })
    );
  } else {
    contenido = contenido.replace(/~/g, ",");
  }
  const $templete = `
  <div class="tarea-Completa">
    <div class="p-check ${clase}">
      <input class='hecha' type="checkbox" ${checked} />
      <p>${contenido}</p>
    </div>
    <button class="boton">
    <img  class="eliminar-tarea " width="16" height="16" src="https://img.icons8.com/material/24/7950F2/delete--v1.png" alt="delete--v1"/>
      
    </button>
  </div>
`;
  $contenedorTareas.insertAdjacentHTML("beforeend", $templete);
  //se agregan los datos al localStorage cuando se esta haciendo clik en el contexto correcto
}

function eleminarTarea(tarea, categoria) {
  let p = tarea.querySelector("p").innerText;
  let $tareaDiv = tarea.querySelector("div");
  //buscamos en donde se encuentra la tarea para poder eliminarla

  if ($tareaDiv.classList.contains("check")) {
    //obtengo las dos listas de las tareas para no formatearla cuando agrege una sola
    let tareas = JSON.parse(localStorage.getItem(categoria));
    let posicion = tareas["listas"].indexOf(p);

    tareas["listas"].splice(posicion, 1);
    localStorage.setItem(
      categoria,
      JSON.stringify({
        activas: tareas["activas"],
        listas: tareas["listas"],
      })
    );
  } else {
    let tareas = JSON.parse(localStorage.getItem(categoria));
    let posicion = tareas["activas"].indexOf(p);
    tareas["activas"].splice(posicion, 1);
    localStorage.setItem(
      categoria,
      JSON.stringify({
        activas: tareas["activas"],
        listas: tareas["listas"],
      })
    );
  }
  tarea.remove();
}

function tareaHecha(tarea, categoria) {
  let p = tarea.querySelector("p").innerText;
  let tareas = JSON.parse(localStorage.getItem(categoria));

  //buscamos en donde se encuentra la tarea para poder moverla de lugar
  if (tarea.classList.contains("check")) {
    let posicion = tareas["listas"].indexOf(p);

    tareas["listas"].splice(posicion, 1);
    tareas["activas"].push(p);
  } else {
    let posicion = tareas["activas"].indexOf(p);
    tareas["activas"].splice(posicion, 1);
    tareas["listas"].push(p);
  }
  localStorage.setItem(
    categoria,
    JSON.stringify({
      activas: tareas["activas"],
      listas: tareas["listas"],
    })
  );

  tarea.classList.toggle("check");
}

function numeroTareas() {
  //ajustar la funcion para que no cuente los espacios vacios
  const tareas = JSON.parse(localStorage.getItem(categoriaActual));
  const tareasActivas = tareas ? tareas["activas"] : [];
  const tareasLista = tareas ? tareas["listas"] : [];

  const tareasActivasSinEspacios = tareasActivas.filter(
    (elemento) => elemento.trim() !== ""
  );
  const tareasListaSinEspacios = tareasLista.filter(
    (elemento) => elemento.trim() !== ""
  );

  const totalTareas =
    tareasActivasSinEspacios.length + tareasListaSinEspacios.length;
  $numeroTareas.innerText = `Tareas ${totalTareas}`;
}

//esta funcion l  a llamo cada vez que hago una accion ya sea para marcar eliminar o agregar
function pintarTodas() {
  //para tener el numero wxacto de las tareas
  numeroTareas();
  const tareas = JSON.parse(localStorage.getItem(categoriaActual));
  $contenedorTareas.innerHTML = "";
  if (tareas !== null) {
    for (let i of tareas["activas"]) {
      if (i !== "") {
        agregarTarea(i, "", "", false, null);
      }
    }
    for (let i of tareas["listas"]) {
      if (i !== "") {
        agregarTarea(i, "check", "checked", false, null);
      }
    }
  }
}

//valida el borrado de las tareas
function validacion() {
  $ventanaModal.style.visibility = "visible";
  const $templete = `
  <div class="ventana-confirmacion">
  <p>Esta acción eliminará todas las tareas de manera definitiva.</p>
  <!--botones de confirmacion-->
  <div class="botones">
    <button class="confirmar">
      Confirmar
    </button>
    <button class="cancelar">
      Cancelar
    </button>
  </div>
`;
  $ventanaModal.innerHTML = $templete;
  $ventanaModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("confirmar")) {
      console.log(categoriaActual, categoriaActual);
      let $ventana = e.target.parentNode.parentNode;
      $contenedorTareas.innerHTML = "";
      localStorage.setItem(
        categoriaActual,
        JSON.stringify({ activas: [], listas: [] })
      );
      $ventana.remove();
      $ventanaModal.style.visibility = "hidden";
      numeroTareas();
    }

    if (e.target.classList.contains("cancelar")) {
      let $ventana = e.target.parentNode;
      $ventana.remove();
      $ventanaModal.style.visibility = "hidden";
    }
  });
}
function ventanaVerCategorias() {
  $ventanaModal.style.visibility = "visible";
  $ventanaModal.innerHTML = `
  <div class="contenedor">
    <div class="categorias"></div>
    <div class="btn">
      <button class="agregar">agregar</button>
      <button class="atras">Regresar</button>
    </div>
  </div>
  `;
  const $categoria = document.querySelector(".categorias");
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) === "") {
      localStorage.removeItem(localStorage.key(i));
    } else {
      const $templete = `
      <div class="contenedor-categorias">
        <p class="categoria">${localStorage.key(i)}</p>
        <button class="boton">
          <img  class="eliminar-key "src="https://img.icons8.com/material/24/7950F2/delete--v1.png" alt="delete--v1"/>
        </button>
      </div>
      `;
      $categoria.insertAdjacentHTML("afterbegin", $templete);
    }
  }
  $ventanaModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("atras")) {
      $ventanaModal.style.visibility = "hidden";
      $categoria.remove();
    }
    if (e.target.classList.contains("agregar")) {
      modalCategorias();
    }
  });
}

function modalCategorias() {
  $ventanaModal.style.visibility = "visible";
  const $templete = `
  <div class="ventana-categoria">
  <p>Incluir nuevas categorias</p>  
  <input class="respuesta" type="text" placeholder="categoria">
  <!--botones de confirmacion-->
  <div class="botones">
    <button class="confirmar-categoria">
      Confirmar
    </button>
    <button class="cancelar">
      Cancelar
    </button>
  </div>
`;
  $ventanaModal.innerHTML = $templete;

  $ventanaModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("confirmar-categoria")) {
      //asegura de que no tenga la clase del modal activa
      let $ventana = e.target.parentNode.parentNode;
      let respuesta = $ventana.querySelector(".respuesta").value;
      //corto la respuesta para evitar que agrege un nombre muy largo
      if (respuesta.length > 15) {
        respuesta = respuesta.slice(0, 15);
      }
      //creo una copia identica pero un una palabra clave para almacenar las tareas listas
      if (respuesta.length > 0) {
        localStorage.setItem(
          respuesta,
          JSON.stringify({ activas: [], listas: [] })
        );
      }
      //actualizar la ventana de la categoria y la variable
      categoriaActual = respuesta;
      //remover la venta
      $ventana.remove();
      $ventanaModal.style.visibility = "hidden";
      ventanaVerCategorias();
    }

    if (e.target.classList.contains("cancelar")) {
      let $ventana = e.target.parentNode;
      $ventana.remove();
      $ventanaModal.style.visibility = "hidden";
    }
  });
}

function eleminarKey(e) {
  const padre = e.target.parentNode.parentNode;
  const keyToRemove = padre.querySelector("p").innerText;
  localStorage.removeItem(keyToRemove);
  padre.remove();
  if (localStorage.length === 0) {
    localStorage.setItem(
      "diarias",
      JSON.stringify({ activas: [], listas: [] })
    );
    categoriaActual = "diarias";
  } else {
    const keys = Object.keys(localStorage);
    categoriaActual = keys[0];
  }
}

function moverDeCategoria(textoCategoria) {
  if (textoCategoria.length > 10) {
    $categoria.innerText = textoCategoria.slice(0, 10);
  } else $categoria.innerText = textoCategoria;
}

//delegacion de eventos para asignar la logica
document.addEventListener("click", (e) => {
  // acorto el evento
  const evento = e.target.classList;
  //para asignar las funciones uso el evento contains para saber si estoy apuntando correctamente
  if (evento.contains("boton-agregar")) {
    agregarTarea($inputText.value, "", "", true, categoriaActual);
    numeroTareas();
  }

  if (evento.contains("eliminar-tarea")) {
    let tarea = e.target.parentNode.parentNode;
    eleminarTarea(tarea, categoriaActual);
    numeroTareas();
  }
  if (evento.contains("hecha", categoriaActual)) {
    let tarea = e.target.parentNode;
    tareaHecha(tarea, categoriaActual);
    numeroTareas();
  }
  if (evento.contains("completas")) {
    ventanaVerCategorias();
  }
  if (evento.contains("lista-hechas")) {
    modalCategorias();
  }
  if (evento.contains("Eliminar-todas")) {
    validacion();
  }
  if (evento.contains("eliminar-key")) {
    eleminarKey(e);
    moverDeCategoria(categoriaActual);
    pintarTodas();
  }
  if (evento.contains("categoria")) {
    const categoriaElegida =
      e.target.parentNode.querySelector(".categoria").innerText;

    moverDeCategoria(categoriaElegida);

    categoriaActual = categoriaElegida;
    $ventanaModal.style.visibility = "hidden";
    pintarTodas();
  }
});
//reloj
let tiempo = 0;
setInterval(() => {
  //Datos de la hora actual
  const horaActual = new Date();
  const hora = horaActual.getHours();
  const minuto = horaActual.getMinutes();
  const minuto12 = minuto < 10 ? `0${minuto}` : minuto;

  //resto a 60 los segundos que faltan para q acabe el minuto y obtener los segundos exactos
  const segundos = 60 - horaActual.getSeconds();

  //reasignamos los segundos fuera del setInterval para poder usarlo y lo multiplicamos para tener el tiempo en milisegundos
  tiempo = segundos * 1000;

  //ajusta el horario
  const horario = hora >= 12 ? "p.m" : "a.m";

  //convierto la hora de un formato de 24 a 12 hr
  const hora12 = hora % 12 || 12;

  //inserta el HTML
  $reloj.innerHTML = `${hora12}:${minuto12} ${horario}`;
}, tiempo);

document.addEventListener("DOMContentLoaded", () => {
  //comprobar que las categorias nunca esten vacias
  if (localStorage.length === 0) {
    localStorage.setItem(
      "diarias",
      JSON.stringify({ activas: [], listas: [] })
    );
    categoriaActual = "diarias";
  }
  pintarTodas();
  moverDeCategoria(categoriaActual);
});
