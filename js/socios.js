import { db }
from "./firebase-config.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   TABLA
   ========================================= */

const tabla =
document.getElementById(
    "tablaSocios"
);


/* =========================================
   CARGAR SOCIOS
   ========================================= */

async function cargarSocios() {

    tabla.innerHTML = "";

    try {

        const querySnapshot =
        await getDocs(
            collection(
                db,
                "Socios"
            )
        );


        /* =====================================
           SI NO HAY SOCIOS
           ===================================== */

        if (querySnapshot.empty) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="4">
                        <i class="fa-solid fa-users-slash"></i>
                        No hay socios registrados
                    </td>
                </tr>
            `;

            return;
        }


        /* =====================================
           MOSTRAR SOCIOS
           ===================================== */

        querySnapshot.forEach(
            (documento) => {

                const socio =
                documento.data();


                tabla.innerHTML += `

                    <tr>

                        <td>
                            ${socio["Nombre Completo"] || ""}
                        </td>

                        <td>
                            ${socio["Celular"] || ""}
                        </td>

                        <td>
                            ${socio["FechaNacimiento"] || ""}
                        </td>


                        <!-- ACCIONES -->

                        <td>

                            <div class="acciones">

                                <!-- EDITAR -->

                                <button
                                    type="button"
                                    class="btnEditar"
                                    onclick="editarSocio('${documento.id}')"
                                    aria-label="Editar socio">

                                    <i class="fa-solid fa-pen"></i>

                                </button>


                                <!-- ELIMINAR -->

                                <button
                                    type="button"
                                    class="btnEliminar"
                                    onclick="eliminarSocio('${documento.id}')"
                                    aria-label="Eliminar socio">

                                    <i class="fa-solid fa-trash"></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Error al cargar socios:",
            error
        );

        tabla.innerHTML = `
            <tr>
                <td colspan="4">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    Error al cargar los socios

                </td>
            </tr>
        `;

    }

}


/* =========================================
   EDITAR SOCIO
   ========================================= */

window.editarSocio =
function(id) {

    window.location.href =
        `editar-socio.html?id=${id}`;

};


/* =========================================
   ELIMINAR SOCIO
   ========================================= */

window.eliminarSocio =
async function(id) {

    const confirmar =
    confirm(
        "¿Desea eliminar este socio?"
    );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "Socios",
                id
            )
        );


        alert(
            "Socio eliminado correctamente"
        );


        cargarSocios();

    }
    catch (error) {

        console.error(
            "Error al eliminar:",
            error
        );


        alert(
            "Error al eliminar el socio"
        );

    }

};


/* =========================================
   INICIAR
   ========================================= */

cargarSocios();