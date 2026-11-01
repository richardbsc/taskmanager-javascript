
/* TaskManager - Gestión de tareas */

// Variables principales
let tareas = [];
let siguienteId = 1;
let idEditando = null;

const CLAVE = "taskmanager_tareas";

// Elementos del HTML
const formulario = document.getElementById("formTarea");
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const prioridad = document.getElementById("prioridad");
const listaTareas = document.getElementById("listaTareas");
const botonGuardar = formulario.querySelector('button[type="submit"]');

// Buscador y filtros
const buscar = document.getElementById("buscar");
const filtro = document.getElementById("filtro");
const orden = document.getElementById("orden");

// Contadores
const total = document.getElementById("total");
const pendientes = document.getElementById("pendientes");
const completadas = document.getElementById("completadas");

// Guardar tareas en localStorage
function guardarTareas() {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(tareas));
    } catch (error) {
        mostrarMensaje("No se pudieron guardar las tareas.");
    }
}

// Mostrar notificaciones en pantalla
function mostrarMensaje(texto) {
    const aviso = document.createElement("div");

    aviso.textContent = texto;
    aviso.style.backgroundColor = "#fff3cd";
    aviso.style.color = "#664d03";
    aviso.style.padding = "12px";
    aviso.style.marginBottom = "15px";
    aviso.style.borderRadius = "5px";
    aviso.style.border = "1px solid #ffecb5";

    listaTareas.before(aviso);

    aviso.addEventListener("click", function() {
        aviso.remove();
    });
}

// Cargar tareas guardadas o importar desde la API
async function cargarTareas() {
    let guardadas = null;

    try {
        guardadas = localStorage.getItem(CLAVE);
    } catch (error) {
        mostrarMensaje("No se pudo acceder al almacenamiento local.");
    }

    if (guardadas !== null) {
        try {
            const datos = JSON.parse(guardadas);

            if (!Array.isArray(datos)) {
                throw new Error("Formato de datos incorrecto");
            }

            tareas = datos;

            siguienteId = Math.max(
                0,
                ...tareas.map(t => Number(t.id) || 0)
            ) + 1;

            mostrarTareas();
            return;

        } catch (error) {
            mostrarMensaje("Los datos guardados no son válidos.");
            mostrarTareas();
            return;
        }
    }

    // Si no existen datos, consultar JSONPlaceholder
    try {
        const respuesta = await fetch(
            "https://jsonplaceholder.typicode.com/todos?_limit=10"
        );

        if (!respuesta.ok) {
            throw new Error("Error al consultar la API");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error("Respuesta incorrecta de la API");
        }

        // Adaptar las tareas recibidas
        const importadas = datos.map(function(tarea) {
            return {
                id: tarea.id,
                title: tarea.title,
                description: "Tarea importada desde JSONPlaceholder",
                priority: "media",
                completed: tarea.completed,
                createdAt: new Date().toISOString()
            };
        });

        // Revisar si se guardaron tareas durante la consulta
        if (localStorage.getItem(CLAVE) !== null) {
            await cargarTareas();
            return;
        }

        tareas = importadas;

        siguienteId = Math.max(
            0,
            ...tareas.map(t => Number(t.id) || 0)
        ) + 1;

        guardarTareas();
        mostrarTareas();

        mostrarMensaje("Se importaron tareas desde JSONPlaceholder.");

    } catch (error) {
        console.error("Error al cargar tareas:", error);

        mostrarMensaje(
            "No se pudo conectar con la API. Puedes crear tareas manualmente."
        );

        mostrarTareas();
    }
}

// Crear o editar tareas
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
    guardarTareas();
    mostrarTareas();
});

// Mostrar lista de tareas
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

    // Mostrar mensaje si no hay tareas
    if (tareasVisibles.length === 0) {
        listaTareas.innerHTML =
            '<p class="vacio">No se encontraron tareas.</p>';

        actualizarDashboard();
        return;
    }

    // Crear tarjetas de tareas
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

// Completar o dejar pendiente una tarea
function cambiarEstado(id) {
    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
        tarea.completed = !tarea.completed;
        guardarTareas();
        mostrarTareas();
    }
}

// Editar tarea
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

    guardarTareas();
    mostrarTareas();
}

// Actualizar los contadores
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

// Iniciar la aplicación
cargarTareas();
