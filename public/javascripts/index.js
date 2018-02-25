function eliminarInmueble(url) {
    Http.ajax("DELETE", url)
        .then(event => {
            if (event.ok) {
                window.location.href = "/";
            } else {
                mostrarError(
                    "padre_contenedor_errores_borrar",
                    "contenedor_errores_borrar",
                    event.mensajeError
                );
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function cambiarFiltroPercio() {
    let link = document.getElementById("filtros_inmuebles").href;
    let partesLink = link.split("/");
    let precio = document.getElementById("precio").value;

    let nuevoEnlace =
        "/" +
        partesLink[3] +
        "/" +
        precio +
        "/" +
        partesLink[5] +
        "/" +
        partesLink[6];

    document.getElementById("filtros_inmuebles").href = nuevoEnlace;
}

function cambiarSuperficie() {
    let link = document.getElementById("filtros_inmuebles").href;
    let partesLink = link.split("/");
    let superficie = document.getElementById("superficie").value;

    let nuevoEnlace =
        "/" +
        partesLink[3] +
        "/" +
        partesLink[4] +
        "/" +
        superficie +
        "/" +
        partesLink[6];

    document.getElementById("filtros_inmuebles").href = nuevoEnlace;
}

function cambiarHabitaciones() {
    let link = document.getElementById("filtros_inmuebles").href;
    let partesLink = link.split("/");
    let habitaciones = document.getElementById("habitaciones").value;

    let nuevoEnlace =
        "/" +
        partesLink[3] +
        "/" +
        partesLink[4] +
        "/" +
        partesLink[5] +
        "/" +
        habitaciones;

    document.getElementById("filtros_inmuebles").href = nuevoEnlace;
}

function mostrarError(idContenedorPadre, idContenedorTexto, mensajeError) {
    document.getElementById(idContenedorPadre).classList.remove("invisible");
    document.getElementById(idContenedorTexto).textContent = mensajeError;
}

function comprobarUsuario(form) {
    var formData = new FormData(form);
    $.ajax({
        url: form.attributes.action.value,
        type: form.attributes.method.value,
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: xhr => {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("token")
            );
        },
        success: data => {
            console.log("Resultado servidor");
            console.log(data);
            if (!data.ok) {
                window.location = data.newLocation;
            } else {
                localStorage.setItem("token", data.token);
                window.location = data.newLocation;
            }
        }
    });
    return false;
}

function borrarInmueble(e) {
    console.log(e);
    $.ajax({
        url: "/inmuebles/"+e.id,
        type: "DELETE",
        beforeSend: xhr => {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("token")
            );
        },
        success: function(result) {
            result = JSON.parse(result);
            console.log(result);
            if (result.ok) {
                location.href = "/";
            } else {
                alert(result.mensajeError);
            }
        }
    });
}
