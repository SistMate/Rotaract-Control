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
   ELEMENTOS
   ========================================= */

const tabla =
document.getElementById(
    "tablaPagos"
);

const buscar =
document.getElementById(
    "buscar"
);


/* =========================================
   PAGOS
   ========================================= */

let pagos = [];


/* =========================================
   CARGAR PAGOS
   ========================================= */

async function cargarPagos() {

    try {

        const querySnapshot =
        await getDocs(
            collection(
                db,
                "Pagos"
            )
        );


        pagos = [];


        querySnapshot.forEach(
            (documento) => {

                pagos.push({

                    id:
                    documento.id,

                    ...documento.data()

                });

            }
        );


        mostrarPagos(pagos);

    }
    catch (error) {

        console.error(
            "Error al cargar pagos:",
            error
        );

        tabla.innerHTML = `
            <tr>

                <td colspan="5">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    Error al cargar los pagos

                </td>

            </tr>
        `;

    }

}


/* =========================================
   MOSTRAR PAGOS
   ========================================= */

function mostrarPagos(lista) {

    tabla.innerHTML = "";


    /* =====================================
       SIN RESULTADOS
       ===================================== */

    if (lista.length === 0) {

        tabla.innerHTML = `
            <tr>

                <td colspan="5">

                    <i class="fa-solid fa-receipt"></i>

                    No se encontraron pagos

                </td>

            </tr>
        `;

        return;

    }


    /* =====================================
       RECORRER PAGOS
       ===================================== */

    lista.forEach(
        (pago) => {

            let fechaFormateada = "";


            /* =================================
               FORMATEAR FECHA
               ================================= */

            if (pago.fecha) {

                if (
                    typeof pago.fecha.toDate ===
                    "function"
                ) {

                    fechaFormateada =
                    pago.fecha
                    .toDate()
                    .toLocaleDateString(
                        "es-BO"
                    );

                }
                else {

                    fechaFormateada =
                    pago.fecha;

                }

            }


            /* =================================
               CONCEPTO
               ================================= */

            const concepto =
            pago.conceptoPago ||
            pago.motivoPago ||
            "";


            /* =================================
               TABLA
               ================================= */

            tabla.innerHTML += `

                <tr>

                    <td>
                        ${pago.nombreSocio || ""}
                    </td>

                    <td>
                        ${fechaFormateada}
                    </td>

                    <td>
                        ${concepto}
                    </td>

                    <td class="monto">

                        Bs ${pago.montoPagado || 0}

                    </td>


                    <!-- ACCIÓN -->

                    <td>

                        <div class="acciones">

                            <button
                                type="button"
                                class="btnEliminar"
                                onclick="eliminarPago('${pago.id}')"
                                aria-label="Eliminar pago">

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
   BUSCADOR
   ========================================= */

buscar.addEventListener(
    "keyup",
    (e) => {

        const texto =
        e.target.value
        .toLowerCase()
        .trim();


        const filtrados =
        pagos.filter(
            (pago) => {

                const nombre =
                (
                    pago.nombreSocio ||
                    ""
                )
                .toLowerCase();


                const motivo =
                (
                    pago.conceptoPago ||
                    pago.motivoPago ||
                    ""
                )
                .toLowerCase();


                return (

                    nombre.includes(texto)

                    ||

                    motivo.includes(texto)

                );

            }
        );


        mostrarPagos(
            filtrados
        );

    }
);


/* =========================================
   ELIMINAR PAGO
   ========================================= */

window.eliminarPago =
async function(id) {

    const confirmar =
    confirm(
        "¿Desea eliminar este pago?"
    );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "Pagos",
                id
            )
        );


        alert(
            "Pago eliminado correctamente"
        );


        cargarPagos();

    }
    catch (error) {

        console.error(
            "Error al eliminar:",
            error
        );


        alert(
            "Error al eliminar el pago"
        );

    }

};


/* =========================================
   INICIAR
   ========================================= */

cargarPagos();