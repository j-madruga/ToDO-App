window.addEventListener('load', () => {
    // ***** API URL
    const API_URL = 'https://ctd-todo-api.herokuapp.com/v1';
    // ***** Sign Up Nodes
    const signupForm = document.querySelector('form');
    const signUpName = document.querySelector('#name');
    const singUpLastName = document.querySelector('#lastName');
    const signUpEmail = document.querySelector('#mail');
    const signUpPassword = document.querySelector('#signupPassword');
    const repeatPassword = document.querySelector('#repeatSignupPassword');

    /* -------------------------------------------------------------------------- */
    /*                                  LISTENERS                                 */
    /* -------------------------------------------------------------------------- */
    signupForm.addEventListener('submit', preventDefaultBehavior);
    signupForm.addEventListener('submit', checkPasswordRepeat);
    signupForm.addEventListener('submit', checkEmptyFields);
    signupForm.addEventListener('submit', normalizeObject);
    signupForm.addEventListener('submit', createNewUser);

    /* -------------------------------------------------------------------------- */
    /*                                  FUNCIONES                                 */
    /* -------------------------------------------------------------------------- */

    // ***** Funcion que previene el comportamiento normal del submit
    function preventDefaultBehavior(event) {
        event.preventDefault();
    }

    // ***** Funcion que revisa en el registro que las contraseñas coincidan entre si
    function checkPasswordRepeat() {
        // creacion de mensaje de error 
        const pwrdMsjError = document.createElement('p');
        pwrdMsjError.classList.add('pwrdMsjError');
        pwrdMsjError.innerHTML = 'las contraseñas no coinciden, intente nuevamente';
        if (signUpPassword.value != repeatPassword.value) {
            if (!signupForm.querySelector('.pwrdMsjError')) {
                signupForm.appendChild(pwrdMsjError);
            }
        } else if ((signUpPassword.value === repeatPassword.value) && signupForm.querySelector('.pwrdMsjError')) {
            signupForm.querySelector('.pwrdMsjError').remove();
        }
    }

    // ***** Funcion que revisa que no haya campos vacios
    function checkEmptyFields() {
        let emptyFields = false;
        const emptyFieldMsj = document.createElement('p');
        emptyFieldMsj.classList.add('emptyFieldMsj');
        emptyFieldMsj.innerHTML = 'uno o mas campos estan vacios';
        if (signUpName.value === '' ||
            singUpLastName.value === '' ||
            signUpEmail.value === '' ||
            signUpPassword.value === '' ||
            repeatPassword.value === '') {
            emptyFields = true;
            if (!signupForm.querySelector('.emptyFielMsj')) {
                signupForm.appendChild(emptyFieldMsj);
            }
        } else {
            const emptyFieldMsj = signupForm.querySelector('.emptyFieldMsj');
            if (emptyFieldMsj) {
                emptyFieldMsj.remove();
            }
        }
        return emptyFields;
    }

    // ***** Funcion que crea objeto y lo normaliza 
    function normalizeObject() {
        objetoNormalizado = {
            firstName: signUpName.value.toLowerCase().trim(),
            singUpLastName: singUpLastName.value.toLowerCase().trim(),
            signUpEmail: signUpEmail.value.toLowerCase().trim(),
            signUpPassword: signUpPassword.value.trim()
        }
        console.log(objetoNormalizado);
        return objetoNormalizado;
    }

    // ***** Funcion que crea nuevo usuario
    function createNewUser() {
        const newUserUrl = `${API_URL}/users`;
        const requestSettings = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(normalizeObject())
        };
        console.log(requestSettings);
        fetch(newUserUrl, requestSettings)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.jwt) {
                    localStorage.setItem('jwt', data.jwt);
                    location.href = './mis-tareas.html';
                }
            })
    }
})