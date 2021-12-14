window.addEventListener('load', () => {
    // ***** API URL
    const API_URL = 'https://ctd-todo-api.herokuapp.com/v1';
    // ***** Index nodes
    const indexForm = document.querySelector('form');
    const indexEmail = document.querySelector('#inputEmail');
    const indexPassword = document.querySelector('#inputPassword');

    /* -------------------------------------------------------------------------- */
    /*                                  LISTENERS                                 */
    /* -------------------------------------------------------------------------- */
    indexForm.addEventListener('submit', login);
    indexForm.addEventListener('submit', preventDefaultBehavior);

    /* -------------------------------------------------------------------------- */
    /*                                  FUNCIONES                                 */
    /* -------------------------------------------------------------------------- */
    // ***** Funcion que previene el comportamiento por defecto del submit
    function preventDefaultBehavior(event) {
        event.preventDefault();
    }
    
    // ***** Funcion que ejecuta el login y guarda el JWT en localStorage
    function login() {
        setTimeout(spinner.showSpinner(), 1000);
        const loginEndPoint = `${API_URL}/users/login`;
        const requestSettings = {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body:`{"email" : "${indexEmail.value}","password" : "${indexPassword.value}"}`
        }
        fetch(loginEndPoint, requestSettings)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            if(data.jwt) {
                localStorage.setItem('jwt', data.jwt);
                location.href = './mis-tareas.html';
            } else {
                console.log('datos no validos');
                spinner.removeSpinner();
            }
        })
    }
})