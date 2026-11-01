
/* TaskManager - Gestión de tareas */

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

// Elementos para buscar y filtrar
const buscar = document.getElementById("buscar");
const filtro = document.getElementById("filtro");
const orden = document.getElementById("orden");

// Contadores del dashboard
const total = document.getElementById("total");
const pendientes = document.getElementById("pendientes");
const completadas = document.getElementById("completadas");

// Crear o editar una tarea
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nuevoTitulo = titulo.value.trim();
    const nuevaDescripcion = descripcion.value.trim();

    if (nuevoTitulo === "" || nuevaDescripcion === "") {
        alert("Debes completar el título y la descripción.");
        return;
    }

    if (idEditando !== null) {
        const tarea = tareas.find(t => t.id === idEditando);

        if (tarea) {
            tarea.title = nuevoTitulo;
            tarea.description = nuevaDescripcion;
            tarea.priority = prioridad.value;
        }

        idEditando = null;
        botonGuardar.textContent = "Guardar tarea";

    } else {
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

// Mostrar las tareas
function mostrarTareas() {
    listaTareas.innerHTML = "";

    // Filtrar por estado
    let tareasVisibles = tareas.filter(function(tarea) {
        if (filtro.value === "pendientes") {
            return !tarea.completed;
        }

        if (filtro.value === "completadas") {
            return tarea.completed;
        }

        return true;
    });

    // Buscar por título
    const textoBuscar = buscar.value.toLowerCase().trim();

    tareasVisibles = tareasVisibles.filter(function(tarea) {
        return tarea.title.toLowerCase().includes(textoBuscar);
    });

    // Ordenar por fecha o prioridad
    if (orden.value === "prioridad") {
        const niveles = {
            alta: 1,
            media: 2,
            baja: 3
        };

        tareasVisibles.sort(function(a, b) {
            return niveles[a.priority] - niveles[b.priority];
        });

    } else {
        tareasVisibles.sort(function(a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    // Mensaje si no hay resultados
    if (tareasVisibles.length === 0) {
        listaTareas.innerHTML =
            '<p class="vacio">No se encontraron tareas.</p>';

        actualizarDashboard();
        return;
    }

    // Mostrar cada tarea
    tareasVisibles.forEach(function(tarea) {
        const elemento = document.createElement("article");
        elemento.className = "tarea";

        const encabezado = document.createElement("div");
        encabezado.className = "tarea-encabezado";

        const nombre = document.createElement("h3");
        nombre.textContent = tarea.title;

        const etiqueta = document.createElement("span");
        etiqueta.className = "prioridad prioridad-" + tarea.priority;
        etiqueta.textContent = tarea.priority.toUpperCase();

        encabezado.append(nombre, etiqueta);

        const detalle = document.createElement("p");
        detalle.textContent = tarea.description;

        const estado = document.createElement("p");
        estado.className = "estado";
        estado.textContent = tarea.completed
            ? "Estado: Completada"
            : "Estado: Pendiente";

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

    actualizarDashboard();
}

// Crear botones
function crearBoton(texto, accion) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.addEventListener("click", accion);

    return boton;
}

// Cambiar estado
function cambiarEstado(id) {
    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
        tarea.completed = !tarea.completed;
        mostrarTareas();
    }
}

// Editar tarea
function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) return;

    titulo.value = tarea.title;
    descripcion.value = tarea.description;
    prioridad.value = tarea.priority;

    idEditando = id;
    botonGuardar.textContent = "Actualizar tarea";

    titulo.focus();
    window.scrollTo(0, 0);
}

// Eliminar tarea
function eliminarTarea(id) {
    if (!confirm("¿Seguro que deseas eliminar esta tarea?")) {
        return;
    }

    tareas = tareas.filter(t => t.id !== id);

    if (idEditando === id) {
        idEditando = null;
        formulario.reset();
        botonGuardar.textContent = "Guardar tarea";
    }

    mostrarTareas();
}

// Actualizar estadísticas
function actualizarDashboard() {
    const cantidadTotal = tareas.length;

    const cantidadCompletadas = tareas.filter(function(tarea) {
        return tarea.completed;
    }).length;

    const cantidadPendientes =
        cantidadTotal - cantidadCompletadas;

    total.textContent = cantidadTotal;
    pendientes.textContent = cantidadPendientes;
    completadas.textContent = cantidadCompletadas;
}

// Eventos de búsqueda y filtros
buscar.addEventListener("input", mostrarTareas);
filtro.addEventListener("change", mostrarTareas);
orden.addEventListener("change", mostrarTareas);

// Mostrar tareas al iniciar
mostrarTareas();
