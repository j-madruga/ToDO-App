// ***** Guardo el JWT del localStorage
const JWT = localStorage.getItem('jwt');
// ***** Si no existe (da null), redirijo a index.html;
if (!JWT)
    location.replace('./index.html');

window.addEventListener('load', () => {
    // ***** API URL
    const API_URL = 'https://ctd-todo-api.herokuapp.com/v1';
    // ***** Index nodes
    const nameNode = document.querySelector('.user-info p');
    const taskForm = document.querySelector('form');
    const pendingTaskList = document.querySelector('.tareas-pendientes');
    const completedTaskList = document.querySelector('.tareas-terminadas');
    const newTaskInput = document.querySelector('#nuevaTarea');
    const btnLogout = document.querySelector('#closeApp');

    /* -------------------------------------------------------------------------- */
    /*                                  LISTENERS                                 */
    /* -------------------------------------------------------------------------- */
    renderUserName();
    renderUserTasks();
    taskForm.addEventListener('submit', preventDefaultBehavior);
    taskForm.addEventListener('submit', addNewTask);
    taskForm.addEventListener('submit', renderUserTasks);
    btnLogout.addEventListener('click', logout);

    /* -------------------------------------------------------------------------- */
    /*                                  FUNCIONES                                 */
    /* -------------------------------------------------------------------------- */
    // ***** Funcion que evita el comportamiento por defecto del sumit del formulario
    function preventDefaultBehavior(event) {
        event.preventDefault();
    }

    // ***** Funcion que obtiene la información del usuario y devuelve una promesa
    function getUserData() {
        const userDataEndpoint = `${API_URL}/users/getMe`;
        const requestSettings = {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "authorization": JWT
            }
        }
        return new Promise((resolve, reject) => {
            fetch(userDataEndpoint, requestSettings)
                .then(response => resolve(response.json()))
                .catch((err) => reject('error obteniendo los datos del usuario'));
        })
    }

    // ***** Funcion que renderiza el nombre del usuario
    async function renderUserName() {
        try {
            const userData = await getUserData();
            nameNode.innerHTML = userData.firstName;
        } catch (err) {
            console.log(err);
        }
    }

    // ***** Funcion que agrega una nueva tarea
    function addNewTask() {
        const newTaskEndpoint = `${API_URL}/tasks`;
        const requestSettings = {
            method: 'POST',
            headers: {
                "authorization": JWT,
                "Content-type": "application/json"
            },
            body: `{"description" : "${newTaskInput.value}","completed" : false}`
        }
        fetch(newTaskEndpoint, requestSettings)
            .then(response => response.json())
            .then(renderUserTasks()) // aca podemos agregar una alerta de exito
    }

    // ***** Funcion que trae las tareas
    function getUserTasks() {
        const getTasksEndpoint = `${API_URL}/tasks`;
        const requestSettings = {
            method: 'GET',
            headers: {
                "authorization": JWT,
                "Content-type": "application/json"
            }
        }
        return new Promise((resolve, reject) => {
            fetch(getTasksEndpoint, requestSettings)
                .then(response => resolve(response.json()))
                .catch((err) => reject('error obteniendo las tareas'))
        })
    }

    // ***** Funcion que renderiza las tareas del usuario
    async function renderUserTasks() {
        try {
            const userTasks = await getUserTasks();
            const completedTasks = userTasks.filter((task) => task.completed);
            const pendingTasks = userTasks.filter((task) => !task.completed);
            pendingTaskList.innerHTML = pendingTasks.map(task =>
                `<li class="tarea">
                <div class="not-done change" id="${task.id}"></div>
                <div class="descripcion">
                            <p class="nombre">${task.description}</p>
                            <p class="timestamp"><i class="far fa-calendar-alt"></i> Creada: ${task.createdAt.slice(0,10)}</p>
                        </div>
                    </li>`
            ).join('');
            completedTaskList.innerHTML = completedTasks.map((task) =>
                `<li class="tarea">
                        <div class="done"></div>
                        <div class="descripcion">
                            <p class="nombre">${task.description}</p>
                            <p class="timestamp">Creada: ${task.createdAt.slice(0,10)}</p>
                            <div>
                                <button><i id="${task.id}" class="fas fa-undo-alt change"></i></button>
                                <button><i id="delete-${task.id}" class="delete far fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </li>`
            ).join('');
            taskForm.reset();
            changeTaskState();
            deleteTask();
        } catch (err) {
            console.log(err);
        }
    }

    // ***** Funcion que hace el logout y borra el JWT del localStorage
    function logout() {
        Swal.fire({
            title: '¿Desea cerrar sesion?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
          localStorage.clear();
          location.replace('./index.html');
            } // cierra el if
        })
    }

    // ***** Funcion que cambia el estado de la tarea
    async function changeTaskState() {
        try {
            const tasks = await getUserTasks();
            const nodes = Array.from(document.querySelectorAll('.tarea .change'));
            nodes.forEach((node) => node.addEventListener('click', () => {
                const task = tasks.find((task) => task.id == node.id);
                const updateTaskEndpoint = `${API_URL}/tasks/${node.id}`;
                const requestSettings = {
                    method: 'PUT',
                    headers: {
                        "authorization": JWT,
                        "Content-type": "application/json"
                    },
                    body: `{"description": "${task.description}", "completed": ${!task.completed}}`
                }
                fetch(updateTaskEndpoint, requestSettings)
                    .then((response) => response.json())
                    .then((data) => renderUserTasks())
                    .catch((err) => console.log(err))
            }))
        } catch (err) {
            console.log(err);
        }
    }

    // ***** Funcion que borra una tarea
    function deleteTask() {
        const nodes = document.querySelectorAll('.delete');
        nodes.forEach((node) => node.addEventListener('click', () => {
            const updateTaskEndpoint = `${API_URL}/tasks/${node.id.slice(7)}`;
            console.log(`estas borrando click en ${node.id.slice(7)}`);
            const requestSettings = {
                method: 'DELETE',
                headers: {
                    "authorization": JWT,
                    "Content-type": "application/json"
                }
            }
            Swal.fire({
                title: '¿Desea borrar esta tarea?',
                text: "No será posible revertir esta acción.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si!',
                cancelButtonText: 'Cancelar',
                customClass : {
                    confirmButton: '#00FF00'
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Tarea eliminada!',
                    'La tarea ha sido correctamente eliminada.',
                    'success'
                  );
                  fetch(updateTaskEndpoint, requestSettings)
                      .then((response) => response.json())
                      .then(renderUserTasks())
                      .catch((err) => console.log(err))
                }
              })
        }));
    }
})