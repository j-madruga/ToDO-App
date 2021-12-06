
// Guardo el JWT del localStorage
const JWT = localStorage.getItem('jwt');
// Si no existe (da null), redirijo a index.html;
if(!JWT) {
    location.replace('./index.html');
}

window.addEventListener('load', () => {
        // API URL
        const API_URL = 'https://ctd-todo-api.herokuapp.com/v1';
        // Index nodes
        const nameNode = document.querySelector('.user-info p');
        const taskForm = document.querySelector('form');
        const pendingTaskList = document.querySelector('.tareas-pendientes');
        const completedTaskList = document.querySelector('.tareas-terminadas');
        const newTaskInput = document.querySelector('#nuevaTarea');
        const taskDescription = document.querySelector('.tareas-pendientes .tarea .nombre');
        const taskTimestamp = document.querySelector('.tareas-pendientes .tarea .timestamp');

        /* -------------------------------------------------------------------------- */
        /*                                  LISTENERS                                 */
        /* -------------------------------------------------------------------------- */
        taskForm.addEventListener('submit', preventDefaultBehavior);
        taskForm.addEventListener('submit', addNewTask);
        taskForm.addEventListener('submit', renderUserTasks);

        /* -------------------------------------------------------------------------- */
        /*                                  FUNCIONES                                 */
        /* -------------------------------------------------------------------------- */
        // Funcion que evita el comportamiento por defecto del sumit del formulario
        function preventDefaultBehavior(event) {
            event.preventDefault();
        }

        // funcion que obtiene la información del usuario y devuelve una promesa
        function getUserData() {
            const userDataEndpoint = `${API_URL}/users/getMe`;
            const requestSettings = {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "authorization" : JWT
                }
            }
            return new Promise((resolve, reject) => {
                fetch(userDataEndpoint, requestSettings)
                .then(response => resolve(response.json()))
                .catch((err) => reject('error obteniendo los datos del usuario'));
            })
        }

        // Funcion que renderiza el nombre del usuario
        async function renderUserName() {
            try {
                const userData = await getUserData();
                nameNode.innerHTML = userData.firstName;
            } catch (err) {
                console.log(err);
            }
        }
        renderUserName();

        // Funcion que agrega una nueva tarea y actualiza la lista
        function addNewTask() {
            const newTaskEndpoint = `${API_URL}/tasks`;
            const requestSettings = {
                method: 'POST',
                headers: {
                    "authorization" : JWT,
                    "Content-type": "application/json"
                },
                body: `{"description" : "${newTaskInput.value}","completed" : false}`
            }
            fetch(newTaskEndpoint, requestSettings)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // renderUserTasks();
            })
        }

        // Funcion que trae las tareas
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
                .then((err) => reject('error obteniendo las tareas'))
            })
        }

        // Funcion que renderiza las tareas del usuario
        async function renderUserTasks() {
            try {
                const userTasks = await getUserTasks();
                const completedTasks = userTasks.filter((task) => task.completed);
                const pendingTasks = userTasks.filter((task) => !task.completed);
                pendingTaskList.innerHTML = pendingTasks.map( task =>
                    `<li class="tarea">
                        <div class="not-done change" id="${task.id}"></div>
                        <div class="descripcion">
                            <p class="nombre">${task.description}</p>
                            <p class="timestamp"><i class="far fa-calendar-alt"></i> Creada: ${task.createdAt.slice(0,10)}</p>
                        </div>
                    </li>`
                    ).join('');
                completedTaskList.innerHTML = completedTasks.map( task =>
                    `<li class="tarea">
                        <div class="done"></div>
                        <div class="descripcion">
                            <p class="nombre">${task.description}</p>
                            <p class="timestamp">Creada: ${task.createdAt.slice(0,10)}</p>
                            <div>
                                <button><i id="${tarea.id}" class="fas fa-undo-alt change"></i></button>
                                <button><i id="${tarea.id}" class="far fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </li>`
                    ).join('');
            } catch (err) {
                console.log(err);
            }
        }
        renderUserTasks();
})