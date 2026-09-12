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
   TABLA Y BUSCADOR
   ========================================= */

const tabla =
document.getElementById(
    "tablaSocios"
);

const buscarSocio =
document.getElementById(
    "buscarSocio"
);


/* =========================================
   VARIABLE SOCIOS
   ========================================= */

let socios = [];


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


        socios = [];


        /* =====================================
           GUARDAR SOCIOS EN EL ARRAY
           ===================================== */

        querySnapshot.forEach(
            (documento) => {

                socios.push({

                    id: documento.id,

                    ...documento.data()

                });

            }
        );


        /* =====================================
           SI NO HAY SOCIOS
           ===================================== */

        if (socios.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="4" class="sin-resultados">

                        <i class="fa-solid fa-users-slash"></i>

                        <span>
                            No hay socios registrados
                        </span>

                    </td>
                </tr>
            `;

            return;
        }


        /* =====================================
           MOSTRAR SOCIOS
           ===================================== */

        mostrarSocios(socios);

    }
    catch (error) {

        console.error(
            "Error al cargar socios:",
            error
        );

        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="sin-resultados">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <span>
                        Error al cargar los socios
                    </span>

                </td>
            </tr>
        `;

    }

}


/* =========================================
   MOSTRAR SOCIOS
   ========================================= */

function mostrarSocios(lista) {

    tabla.innerHTML = "";


    /* =====================================
       SIN RESULTADOS
       ===================================== */

    if (lista.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="sin-resultados">

                    <i class="fa-solid fa-user-slash"></i>

                    <span>
                        No se encontraron socios
                    </span>

                </td>
            </tr>
        `;

        return;
    }


    /* =====================================
       RECORRER SOCIOS
       ===================================== */

    lista.forEach(
        (socio) => {

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
                                onclick="editarSocio('${socio.id}')"
                                aria-label="Editar socio">

                                <i class="fa-solid fa-pen"></i>

                            </button>


                            <!-- ELIMINAR -->

                            <button
                                type="button"
                                class="btnEliminar"
                                onclick="eliminarSocio('${socio.id}')"
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


/* =========================================
   BUSCAR SOCIO
   ========================================= */

if (buscarSocio) {

    buscarSocio.addEventListener(
        "input",
        function() {

            const texto =
            this.value
                .toLowerCase()
                .trim();


            /* =================================
               SI EL BUSCADOR ESTÁ VACÍO
               ================================= */

            if (texto === "") {

                mostrarSocios(socios);

                return;

            }


            /* =================================
               FILTRAR SOCIOS
               ================================= */

            const resultados =
            socios.filter(
                (socio) => {

                    const nombre =
                    String(
                        socio["Nombre Completo"] || ""
                    ).toLowerCase();


                    const celular =
                    String(
                        socio["Celular"] || ""
                    ).toLowerCase();


                    const carnet =
                    String(
                        socio["Carnet"] ||
                        socio["carnet"] ||
                        ""
                    ).toLowerCase();


                    return (

                        nombre.includes(texto) ||

                        celular.includes(texto) ||

                        carnet.includes(texto)

                    );

                }
            );


            mostrarSocios(
                resultados
            );

        }
    );

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
