const spinner = {
    showSpinner: function () {
        // Seleccionamos el body. Esto nos servirá para incorporar nuestro spinner
        // dentro de nuestro HTML.
        const body = document.querySelector("body");

        // Seleccionamos los div del index para poder ocultarlos durante la carga
        const divLeft = document.querySelector('.left');
        const divRight = document.querySelector('.right');

        // Creamos nuestro spinner
        const spinnerContainer = document.createElement("div");
        const spinner = document.createElement("div");

        // Asignamos los IDs a cada nuevo elemento, para poder manipular
        // sus estilos
        spinnerContainer.setAttribute("id", "contenedor-carga");
        spinner.setAttribute("id", "carga");

        // Ocultamos el formulario de registro
        divLeft.classList.add("hidden");
        divRight.classList.add("hidden");


        // Agregamos el Spinner a nuestro HTML.
        spinnerContainer.appendChild(spinner);
        body.appendChild(spinnerContainer);

        return;
    },
    removeSpinner: function () {
        // Seleccionamos el body para poder remover el spinner del HTML.
        const body = document.querySelector("body");

        // Seleccionamos el formulario de registro para poder mostrarlo nuevamente
        const divLeft = document.querySelector('.left');
        const divRight = document.querySelector('.right');

        // Seleccionamos el spinner
        const spinnerContainer = document.querySelector("#contenedor-carga");

        // Removemos el spinner del HTML
        body.removeChild(spinnerContainer);

        // Quitamos la clase que oculta el formulario
        divLeft.classList.remove("hidden");
        divRight.classList.remove("hidden");
        return;
    }
};
