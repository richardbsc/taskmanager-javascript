
# TaskManager

Proyecto de gestión de tareas desarrollado con HTML, CSS y JavaScript Vanilla ES6+.

## Descripción

TaskManager es una aplicación web que permite organizar tareas personales. El usuario puede agregar actividades, modificarlas, eliminarlas y marcar las que ya terminó.

La aplicación también permite buscar tareas, filtrarlas por estado y ordenarlas según su prioridad o fecha de creación.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- API REST JSONPlaceholder
- localStorage

## Funcionalidades

- Crear nuevas tareas.
- Editar tareas registradas.
- Eliminar tareas.
- Marcar tareas como completadas o pendientes.
- Buscar tareas por título.
- Filtrar tareas por estado.
- Ordenar por fecha y prioridad.
- Consultar tareas de una API externa.
- Guardar información en el navegador.
- Mostrar estadísticas de tareas.

## Funcionamiento

Al iniciar la aplicación se revisa si existen tareas guardadas en localStorage.

Si existen, se cargan directamente. Si no existen, se realiza una consulta a la API JSONPlaceholder para importar tareas de ejemplo.

Los cambios realizados por el usuario se guardan en el navegador, por lo que las tareas pueden consultarse nuevamente sin conexión a internet.

Para actualizar las estadísticas se utiliza CustomEvent, que permite notificar los cambios realizados en las tareas.

## Cómo ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta en Visual Studio Code.
3. Abrir index.html utilizando Live Server.
4. Crear una tarea desde el formulario.
5. Utilizar los botones para editar, completar o eliminar.

## Estructura del proyecto

- index.html: estructura de la aplicación.
- styles.css: estilos de la interfaz.
- script.js: funcionalidades de JavaScript.
- AI_DECLARATION.md: declaración de uso de IA.
- INFORME_TaskManager.pdf: informe final.

## Repositorio

https://github.com/richardbsc/taskmanager-javascript

## Autor

Richard Vaca

ECOTEC - 2026
