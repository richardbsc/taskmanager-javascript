
/* TaskManager - Gestión de tareas */

// Arreglo para guardar las tareas
let tareas = [];
let siguienteId = 1;
let idEditando = null;

// Elementos del HTML
const formulario = document.getElementById("formTarea");
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const prioridad = document.getElementById("prioridad");
const listaTareas = document.getElementById("listaTareas");
const botonGuardar = formulario.querySelector('button[type="submit"]');

// Crear o actualizar una tarea
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nuevoTitulo = titulo.value.trim();
    const nuevaDescripcion = descripcion.value.trim();

    // Validar que los campos no estén vacíos
    if (nuevoTitulo === "" || nuevaDescripcion === "") {
        alert("Debes completar el título y la descripción.");
        return;
    }

    if (idEditando !== null) {
        // Actualizar tarea existente
        const tarea = tareas.find(t => t.id === idEditando);

        if (tarea) {
            tarea.title = nuevoTitulo;
            tarea.description = nuevaDescripcion;
            tarea.priority = prioridad.value;
        }

        idEditando = null;
        botonGuardar.textContent = "Guardar tarea";

    } else {
        // Crear una nueva tarea
        const nuevaTarea = {
            id: siguienteId++,
            title: nuevoTitulo,
            description: nuevaDescripcion,
            priority: prioridad.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tareas.push(nuevaTarea);
    }

    formulario.reset();
    mostrarTareas();
});

// Mostrar las tareas en pantalla
function mostrarTareas() {
    listaTareas.innerHTML = "";

    if (tareas.length === 0) {
        listaTareas.innerHTML =
            '<p class="vacio">No hay tareas registradas.</p>';
        return;
    }

    tareas.forEach(function(tarea) {

        const elemento = document.createElement("article");
        elemento.className = "tarea";

        // Encabezado de la tarea
        const encabezado = document.createElement("div");
        encabezado.className = "tarea-encabezado";

        const nombre = document.createElement("h3");
        nombre.textContent = tarea.title;

        const etiqueta = document.createElement("span");
        etiqueta.className = "prioridad prioridad-" + tarea.priority;
        etiqueta.textContent = tarea.priority.toUpperCase();

        encabezado.append(nombre, etiqueta);

        // Descripción
        const detalle = document.createElement("p");
        detalle.textContent = tarea.description;

        // Estado
        const estado = document.createElement("p");
        estado.className = "estado";
        estado.textContent = tarea.completed
            ? "Estado: Completada"
            : "Estado: Pendiente";

        // Botones
        const acciones = document.createElement("div");
        acciones.className = "acciones";

        const btnEstado = crearBoton(
            tarea.completed ? "Pendiente" : "Completar",
            function() {
                cambiarEstado(tarea.id);
            }
        );

        const btnEditar = crearBoton("Editar", function() {
            editarTarea(tarea.id);
        });

        const btnEliminar = crearBoton("Eliminar", function() {
            eliminarTarea(tarea.id);
        });

        btnEliminar.classList.add("eliminar");

        acciones.append(btnEstado, btnEditar, btnEliminar);

        elemento.append(encabezado, detalle, estado, acciones);

        listaTareas.appendChild(elemento);
    });
}

// Función para crear botones
function crearBoton(texto, accion) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.addEventListener("click", accion);

    return boton;
}

// Cambiar estado de una tarea
function cambiarEstado(id) {
    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
        tarea.completed = !tarea.completed;
        mostrarTareas();
    }
}

// Editar una tarea
function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        return;
    }

    titulo.value = tarea.title;
    descripcion.value = tarea.description;
    prioridad.value = tarea.priority;

    idEditando = id;
    botonGuardar.textContent = "Actualizar tarea";

    titulo.focus();
    window.scrollTo(0, 0);
}

// Eliminar una tarea
function eliminarTarea(id) {
    const confirmar = confirm(
        "¿Seguro que deseas eliminar esta tarea?"
    );

    if (!confirmar) {
        return;
    }

    tareas = tareas.filter(t => t.id !== id);

    // Si se estaba editando, limpiar formulario
    if (idEditando === id) {
        idEditando = null;
        formulario.reset();
        botonGuardar.textContent = "Guardar tarea";
    }

    mostrarTareas();
}

// Cargar la lista inicial
mostrarTareas();
