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
    "tablaSimpatizantes"
);


/* =========================================
   CARGAR SIMPATIZANTES
   ========================================= */

async function cargarSimpatizantes() {

    tabla.innerHTML = "";

    try {

        const querySnapshot =
        await getDocs(
            collection(
                db,
                "Simpatizante"
            )
        );


        /* =====================================
           SI NO HAY SIMPATIZANTES
           ===================================== */

        if (querySnapshot.empty) {

            tabla.innerHTML = `
                <tr>

                    <td colspan="4">

                        <i class="fa-solid fa-user-slash"></i>

                        No hay simpatizantes registrados

                    </td>

                </tr>
            `;

            return;
        }


        /* =====================================
           MOSTRAR SIMPATIZANTES
           ===================================== */

        querySnapshot.forEach(
            (documento) => {

                const simpatizante =
                documento.data();


                tabla.innerHTML += `

                    <tr>

                        <td>
                            ${simpatizante.NombreSimpatizante || ""}
                        </td>

                        <td>
                            ${simpatizante.Celular || ""}
                        </td>

                        <td>
                            ${simpatizante.FechaIngreso || ""}
                        </td>


                        <!-- ACCIONES -->

                        <td>

                            <div class="acciones">

                                <!-- EDITAR -->

                                <button
                                    type="button"
                                    class="btnEditar"
                                    onclick="editarSimpatizante('${documento.id}')"
                                    aria-label="Editar simpatizante">

                                    <i class="fa-solid fa-pen"></i>

                                </button>


                                <!-- ELIMINAR -->

                                <button
                                    type="button"
                                    class="btnEliminar"
                                    onclick="eliminarSimpatizante('${documento.id}')"
                                    aria-label="Eliminar simpatizante">

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
            "Error al cargar simpatizantes:",
            error
        );

        tabla.innerHTML = `
            <tr>

                <td colspan="4">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    Error al cargar los simpatizantes

                </td>

            </tr>
        `;

    }

}


/* =========================================
   EDITAR SIMPATIZANTE
   ========================================= */

window.editarSimpatizante =
function(id) {

    window.location.href =
        `editar-simpatizante.html?id=${id}`;

};


/* =========================================
   ELIMINAR SIMPATIZANTE
   ========================================= */

window.eliminarSimpatizante =
async function(id) {

    const confirmar =
    confirm(
        "¿Desea eliminar este simpatizante?"
    );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "Simpatizante",
                id
            )
        );


        alert(
            "Simpatizante eliminado correctamente"
        );


        cargarSimpatizantes();

    }
    catch (error) {

        console.error(
            "Error al eliminar:",
            error
        );

        alert(
            "Error al eliminar el simpatizante"
        );

    }

};


/* =========================================
   INICIAR
   ========================================= */

cargarSimpatizantes();