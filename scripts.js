const $inputText = document.querySelector(".input-text");
const $contenedorTareas = document.querySelector(".contenedor-tareas");
const $numeroTareas = document.querySelector(".num-p");
const $reloj = document.querySelector("header p");

//crea un templete html y lo inserta en el contenedor de las tareas, el parametro contendido hace referencia el texto que se va insertar
function agregarTarea(contenido, clase, checked, contexto) {
  const $templete = `
  <div class="tarea-Completa">
    <div class="p-check ${clase}">
      <input class='hecha' type="checkbox" ${checked} />
      <p>${contenido}</p>
    </div>
    <button class="eliminar-tarea">✖️</button>
  </div>
`;
  $contenedorTareas.insertAdjacentHTML("beforeend", $templete);
  //se agregan los datos al localStorage cuando se esta haciendo clik en el contexto correcto
  if (contexto) {
    let tareasActivas = localStorage.getItem("activas").split(",");
    tareasActivas.push(contenido);
    localStorage.setItem("activas", tareasActivas);
  }
}

function eleminarTarea(tarea) {
  let p = tarea.querySelector("p").innerText;
  let $tareaDiv = tarea.querySelector("div");
  //buscamos en donde se encuentra la tarea para poder eliminarla
  if ($tareaDiv.classList.contains("check")) {
    let tareasLista = localStorage.getItem("listas").split(",");
    let posicion = tareasLista.indexOf(p);
    tareasLista.splice(posicion, 1);
    localStorage.setItem("listas", tareasLista);
  } else {
    let tareasActivas = localStorage.getItem("activas").split(",");
    let posicion = tareasActivas.indexOf(p);
    tareasActivas.splice(posicion, 1);
    localStorage.setItem("activas", tareasActivas);
  }
  tarea.remove();
}

function tareaHecha(tarea) {
  let p = tarea.querySelector("p").innerText;
  let tareasLista = localStorage.getItem("listas").split(",");
  let tareasActivas = localStorage.getItem("activas").split(",");
  //buscamos en donde se encuentra la tarea para poder moverla de lugar
  if (tarea.classList.contains("check")) {
    let posicion = tareasLista.indexOf(p);
    tareasLista.splice(posicion, 1);
    tareasActivas.push(p);
  } else {
    let posicion = tareasActivas.indexOf(p);
    tareasActivas.splice(posicion, 1);
    tareasLista.push(p);
  }
  localStorage.setItem("listas", tareasLista);
  localStorage.setItem("activas", tareasActivas);
  tarea.classList.toggle("check");
}
function numeroTareas() {
  //ajustar la funcion para que no cuente los espacios vacios
  const tareasActivas = localStorage.getItem("activas").split(",");
  const arraySinElementosVacios = tareasActivas.filter(
    (elemento) => elemento !== ""
  );
  let longitud = arraySinElementosVacios.length;
  $numeroTareas.innerText = `Tareas pendientes ${longitud}`;
}
//esta funcion la llamo cada vez que hago una accion ya sea para marcar eliminar o agregar
function pintarTodas() {
  const tareasActivas = localStorage.getItem("activas");
  const tareasLista = localStorage.getItem("listas");

  for (let i of tareasActivas.split(",")) {
    if (i !== "") {
      agregarTarea(i, "", "", false);
    }
  }
  for (let i of tareasLista.split(",")) {
    if (i !== "") {
      agregarTarea(i, "check", "checked", false);
    }
  }
}

//delegacion de eventos para asignar la logica
document.addEventListener("click", (e) => {
  // acorto el evento
  const evento = e.target.classList;
  //para asignar las funciones uso el evento contains para saber si estoy apuntando correctamente
  if (evento.contains("boton-agregar")) {
    agregarTarea($inputText.value, "", "", true);
    numeroTareas();
  }

  if (evento.contains("eliminar-tarea")) {
    let tarea = e.target.parentNode;
    eleminarTarea(tarea);
    numeroTareas();
  }
  if (evento.contains("hecha")) {
    let tarea = e.target.parentNode;
    tareaHecha(tarea);
    numeroTareas();
  }
  if (evento.contains("todas")) {
    $contenedorTareas.innerHTML = "";
    pintarTodas();
  }
  if (evento.contains("completas")) {
    $contenedorTareas.innerHTML = "";
    const tareasLista = localStorage.getItem("listas");
    for (let i of tareasLista.split(",")) {
      if (i !== "") {
        agregarTarea(i, "check", "checked", false);
      }
    }
  }
  if (evento.contains("lista-hechas")) {
    $contenedorTareas.innerHTML = "";
    const tareasActivas = localStorage.getItem("activas");
    for (let i of tareasActivas.split(",")) {
      if (i !== "") {
        agregarTarea(i, "", "", false);
      }
    }
  }
  if (evento.contains("Eliminar-todas")) {
    $contenedorTareas.innerHTML = "";
    localStorage.setItem("activas", "");
    localStorage.setItem("listas", "");
    numeroTareas();
  }
});
//reloj
let tiempo = 0;
setInterval(() => {
  //Datos de la hora actual
  const horaActual = new Date();
  const hora = horaActual.getHours();
  const minuto = horaActual.getMinutes();

  //resto a 60 los segundos que faltan para q acabe el minuto y obtener los segundos exactos
  const segundos = 60 - horaActual.getSeconds();

  //reasignamos los segundos fuera del setInterval para poder usarlo y lo multiplicamos para tener el tiempo en milisegundos
  tiempo = segundos * 1000;

  //ajusta el horario
  const horario = hora >= 12 ? "PM" : "AM";

  //convierto la hora de un formato de 24 a 12 hr
  const hora12 = hora % 12 || 12;

  //inserta el HTML
  $reloj.innerHTML = `${hora12} ${minuto} ${horario}`;
}, tiempo);

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("activas") === null) {
    localStorage.setItem("activas", "");
  }
  if (localStorage.getItem("listas") === null) {
    localStorage.setItem("listas", "");
  }
  pintarTodas();
  numeroTareas();
});
