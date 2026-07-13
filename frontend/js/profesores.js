const API_URL = "http://localhost:3000/api/profesores";

let profesores = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarProfesores();

    document
        .getElementById("formProfesor")
        .addEventListener("submit", guardarProfesor);

    document
        .getElementById("buscadorProfesores")
        .addEventListener("input", aplicarFiltros);

    document
        .getElementById("filtroEstado")
        .addEventListener("change", aplicarFiltros);
});

/* Cargar profesores desde el backend */
async function cargarProfesores() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No fue posible cargar los profesores.");
        }

        profesores = await respuesta.json();

        mostrarProfesores(profesores);

    } catch (error) {
        console.error(error);

        document.getElementById("tablaProfesores").innerHTML = `
            <tr>
                <td colspan="5" class="empty-message error-message">
                    No fue posible cargar los profesores.
                </td>
            </tr>
        `;
    }
}

/* Dibujar profesores en la tabla */
function mostrarProfesores(lista) {
    const tabla = document.getElementById("tablaProfesores");

    tabla.innerHTML = "";

    document.getElementById("contadorProfesores").textContent =
        `${lista.length} ${lista.length === 1 ? "profesor" : "profesores"}`;

    if (lista.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No se encontraron profesores.
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach((profesor) => {
        const fila = document.createElement("tr");

        const claseEstado =
            profesor.estado === "ACTIVO"
                ? "success"
                : "inactive";

        const iconoEstado =
            profesor.estado === "ACTIVO"
                ? "bi-person-x-fill"
                : "bi-person-check-fill";

        const tituloEstado =
            profesor.estado === "ACTIVO"
                ? "Desactivar profesor"
                : "Activar profesor";

        fila.innerHTML = `
            <td>
                <strong>${escaparHTML(profesor.nombreCompleto)}</strong>
                <small>
                    ${escaparHTML(profesor.correo || "Sin correo")}
                </small>
            </td>

            <td>${escaparHTML(profesor.numeroEconomico)}</td>

            <td>${escaparHTML(profesor.telefono || "Sin teléfono")}</td>

            <td>
                <span class="badge ${claseEstado}">
                    ${profesor.estado}
                </span>
            </td>

            <td class="actions">
                <button
                    type="button"
                    title="Ver información"
                    onclick="verProfesor(${profesor.idpersonal})"
                >
                    <i class="bi bi-eye-fill"></i>
                </button>

                <button
                    type="button"
                    title="Editar profesor"
                    onclick="editarProfesor(${profesor.idpersonal})"
                >
                    <i class="bi bi-pencil-fill"></i>
                </button>

                <button
                    type="button"
                    title="${tituloEstado}"
                    onclick="cambiarEstado(
                        ${profesor.idpersonal},
                        '${profesor.estado}'
                    )"
                >
                    <i class="bi ${iconoEstado}"></i>
                </button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

/* Buscar y filtrar */
function aplicarFiltros() {
    const texto = document
        .getElementById("buscadorProfesores")
        .value
        .trim()
        .toLowerCase();

    const estado = document.getElementById("filtroEstado").value;

    const profesoresFiltrados = profesores.filter((profesor) => {
        const coincideTexto =
            profesor.nombreCompleto.toLowerCase().includes(texto) ||
            profesor.numeroEconomico.toLowerCase().includes(texto) ||
            (profesor.correo || "").toLowerCase().includes(texto);

        const coincideEstado =
            estado === "TODOS" || profesor.estado === estado;

        return coincideTexto && coincideEstado;
    });

    mostrarProfesores(profesoresFiltrados);
}

/* Preparar modal para crear */
function abrirModal() {
    limpiarFormulario();

    document.getElementById("tituloModalProfesor").textContent =
        "Nuevo profesor";

    document.getElementById("btnGuardarProfesor").textContent =
        "Guardar profesor";

    document
        .getElementById("modalProfesor")
        .classList
        .add("show");
}

/* Cerrar modal */
function cerrarModal() {
    document
        .getElementById("modalProfesor")
        .classList
        .remove("show");

    limpiarFormulario();
}

/* Registrar o editar */
async function guardarProfesor(evento) {
    evento.preventDefault();

    const idProfesor =
        document.getElementById("idProfesor").value;

    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        apellidoP:
            document.getElementById("apellidoP").value.trim(),
        apellidoM:
            document.getElementById("apellidoM").value.trim(),
        numeroEconomico:
            document.getElementById("numeroEconomico").value.trim(),
        correo:
            document.getElementById("correo").value.trim(),
        telefono:
            document.getElementById("telefono").value.trim(),
        extension:
            document.getElementById("extension").value.trim()
    };

    try {
        const esEdicion = Boolean(idProfesor);

        const url = esEdicion
            ? `${API_URL}/${idProfesor}`
            : API_URL;

        const metodo = esEdicion ? "PUT" : "POST";

        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje ||
                "No fue posible guardar al profesor."
            );
        }

        alert(resultado.mensaje);

        cerrarModal();

        await cargarProfesores();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/* Ver información */
async function verProfesor(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        const profesor = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                profesor.mensaje ||
                "No fue posible consultar al profesor."
            );
        }

        alert(
            `Profesor: ${profesor.nombre} ${profesor.apellidoP} ${profesor.apellidoM || ""}\n` +
            `Número económico: ${profesor.numeroEconomico}\n` +
            `Correo: ${profesor.correo || "Sin correo"}\n` +
            `Teléfono: ${profesor.telefono || "Sin teléfono"}\n` +
            `Extensión: ${profesor.extension || "Sin extensión"}\n` +
            `Estado: ${profesor.estado}`
        );

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/* Abrir modal para editar */
async function editarProfesor(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        const profesor = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                profesor.mensaje ||
                "No fue posible consultar al profesor."
            );
        }

        document.getElementById("idProfesor").value =
            profesor.idpersonal;

        document.getElementById("nombre").value =
            profesor.nombre;

        document.getElementById("apellidoP").value =
            profesor.apellidoP;

        document.getElementById("apellidoM").value =
            profesor.apellidoM || "";

        document.getElementById("numeroEconomico").value =
            profesor.numeroEconomico;

        document.getElementById("correo").value =
            profesor.correo || "";

        document.getElementById("telefono").value =
            profesor.telefono || "";

        document.getElementById("extension").value =
            profesor.extension || "";

        document.getElementById("tituloModalProfesor").textContent =
            "Editar profesor";

        document.getElementById("btnGuardarProfesor").textContent =
            "Guardar cambios";

        document
            .getElementById("modalProfesor")
            .classList
            .add("show");

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/* Activar o desactivar */
async function cambiarEstado(id, estadoActual) {
    const nuevoEstado =
        estadoActual === "ACTIVO"
            ? "INACTIVO"
            : "ACTIVO";

    const accion =
        nuevoEstado === "ACTIVO"
            ? "activar"
            : "desactivar";

    const confirmar = window.confirm(
        `¿Deseas ${accion} a este profesor?`
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(
            `${API_URL}/${id}/estado`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    estado: nuevoEstado
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje ||
                "No fue posible cambiar el estado."
            );
        }

        alert(resultado.mensaje);

        await cargarProfesores();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/* Limpiar formulario */
function limpiarFormulario() {
    document.getElementById("formProfesor").reset();
    document.getElementById("idProfesor").value = "";
}

/* Evitar insertar HTML desde datos externos */
function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}