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
    signupForm.addEventListener('submit', validateData);
    signupForm.addEventListener('submit', checkPasswordRepeat);
    signupForm.addEventListener('submit', checkEmptyFields);
    // signupForm.addEventListener('submit', normalizeObject);
    // signupForm.addEventListener('submit', createNewUser);


    /* -------------------------------------------------------------------------- */
    /*                                  FUNCIONES                                 */
    /* -------------------------------------------------------------------------- */

    // ***** Funcion que previene el comportamiento normal del submit
    function preventDefaultBehavior(event) {
        event.preventDefault();
    }

    // ***** Funcion que revisa en el registro que las contraseñas coincidan entre si
    function checkPasswordRepeat() {
        let validated = false;
        const pwrdMsjError = document.createElement('p');
        pwrdMsjError.classList.add('pwrdMsjError');
        pwrdMsjError.innerHTML = 'las contraseñas no coinciden, intente nuevamente';
        if (signUpPassword.value != repeatPassword.value) {
            if (!signupForm.querySelector('.pwrdMsjError')) {
                signupForm.appendChild(pwrdMsjError);
            }
        } else if ((signUpPassword.value === repeatPassword.value) && signupForm.querySelector('.pwrdMsjError')) {
            signupForm.querySelector('.pwrdMsjError').remove();
            validated = true;
        } else {
            validated = true;
        }
        return validated;
    }

    // ***** Funcion que revisa que no haya campos vacios
    function checkEmptyFields() {
        let emptyFields = false;
        const emptyFieldMsj = document.createElement('p');
        emptyFieldMsj.classList.add('emptyFieldMsj');
        emptyFieldMsj.innerHTML = 'uno o mas campos estan vacios';
        if ((signUpName.value === '' || singUpLastName.value === '' || signUpEmail.value === '' || signUpPassword.value === '' || repeatPassword.value === '') && !signupForm.querySelector('.emptyFieldMsj')) {
            emptyFields = true;
            signupForm.appendChild(emptyFieldMsj);
        } else if ((signUpName.value === '' || singUpLastName.value === '' || signUpEmail.value === '' || signUpPassword.value === '' || repeatPassword.value === '') && signupForm.querySelector('.emptyFieldMsj')) {
            emptyFields = true;
        } else {
            signupForm.querySelector('.emptyFieldMsj').remove()
        }
        return emptyFields;
    }

    // ***** Funcion que valida la información del formulario
    function validateData() {
        if (checkPasswordRepeat && !checkEmptyFields)
            createNewUser;
    }
    // ***** Funcion que crea objeto y lo normaliza 
    function normalizeObject() {
        objetoNormalizado = {
            firstName: signUpName.value.toLowerCase().trim(),
            lastName: singUpLastName.value.toLowerCase().trim(),
            email: signUpEmail.value.toLowerCase().trim(),
            password: signUpPassword.value.trim()
        }
        console.log(objetoNormalizado);
        return objetoNormalizado;
    }

    // ***** Funcion que crea nuevo usuario
    function createNewUser() {
        setTimeout(spinner.showSpinner(), 1000);
        const newUserUrl = `${API_URL}/users`;
        const requestSettings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(normalizeObject())
        };
        console.log(requestSettings);
        fetch(newUserUrl, requestSettings)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.jwt) {
                    localStorage.setItem('jwt', data.jwt);
                    location.href = './mis-tareas.html';
                } else {
                    console.log('algo salio mal');
                    spinner.removeSpinner();
                }
            })
            .catch((err) => console.log(err))
    }
})