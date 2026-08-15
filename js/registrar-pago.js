import { db }
from "./firebase-config.js";

import {
    collection,
    getDocs,
    addDoc,
    Timestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const form =
document.getElementById("formPago");

const selectSocio =
document.getElementById("nombreSocio");

const conceptoPago =
document.getElementById("conceptoPago");

const tipoPago =
document.getElementById("tipoPago");

const contenedorQR =
document.getElementById("contenedorQR");

const imagenQR =
document.getElementById("imagenQR");


/* =========================================
   CARGAR SOCIOS
   ========================================= */

async function cargarSocios() {

    try {

        const querySnapshot =
        await getDocs(
            collection(
                db,
                "Socios"
            )
        );

        selectSocio.innerHTML = `
            <option value="">
                Seleccione un socio
            </option>
        `;

        querySnapshot.forEach(
            (documento) => {

                const socio =
                documento.data();

                const nombre =
                socio["Nombre Completo"];

                selectSocio.innerHTML += `
                    <option value="${nombre}">
                        ${nombre}
                    </option>
                `;

            }
        );

    }
    catch (error) {

        console.error(error);

        alert(
            "Error al cargar socios"
        );

    }

}


/* =========================================
   CUOTAS MENSUALES
   ========================================= */

const cuotasMensuales = [

    "Cuota Enero",
    "Cuota Febrero",
    "Cuota Marzo",
    "Cuota Abril",
    "Cuota Mayo",
    "Cuota Junio",
    "Cuota Julio",
    "Cuota Agosto",
    "Cuota Septiembre",
    "Cuota Octubre",
    "Cuota Noviembre",
    "Cuota Diciembre"

];


/* =========================================
   OBTENER QR SEGÚN CONCEPTO
   ========================================= */

function obtenerQR(concepto) {

    if (
        cuotasMensuales.includes(
            concepto
        )
    ) {

        return "img/Cuotas26.jpeg";

    }


    if (
        concepto ===
        "Cuota Distrital"
    ) {

        return "img/CuotaDistrital.jpg";

    }


    if (
        concepto ===
        "Cuota Rotary International"
    ) {

        return "img/CuotaRI.jpg";

    }


    return null;

}


/* =========================================
   ACTUALIZAR QR
   ========================================= */

function actualizarQR() {

    const tipo =
    tipoPago.value;

    const concepto =
    conceptoPago.value;


    /*
        El QR SOLO aparece
        si el tipo de pago es QR
    */

    if (
        tipo !== "QR"
    ) {

        ocultarQR();

        return;

    }


    const rutaQR =
    obtenerQR(concepto);


    /*
        Si el concepto tiene
        un QR configurado
    */

    if (rutaQR) {

        imagenQR.src =
        rutaQR;

        contenedorQR.style.display =
        "flex";

    }
    else {

        ocultarQR();

    }

}


/* =========================================
   OCULTAR QR
   ========================================= */

function ocultarQR() {

    contenedorQR.style.display =
    "none";

    imagenQR.src = "";

}


/* =========================================
   CAMBIO TIPO DE PAGO
   ========================================= */

tipoPago.addEventListener(
    "change",
    () => {

        actualizarQR();

    }
);


/* =========================================
   CAMBIO CONCEPTO
   ========================================= */

conceptoPago.addEventListener(
    "change",
    () => {

        actualizarQR();

    }
);


/* =========================================
   REGISTRAR PAGO
   ========================================= */

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        try {

            await addDoc(
                collection(
                    db,
                    "Pagos"
                ),
                {

                    nombreSocio:
                    selectSocio.value,

                    fecha:
                    document.getElementById(
                        "fecha"
                    ).value,

                    montoPagado:
                    document.getElementById(
                        "montoPagado"
                    ).value,

                    tipoPago:
                    tipoPago.value,

                    conceptoPago:
                    conceptoPago.value,

                    fechaRegistro:
                    Timestamp.now()

                }
            );


            alert(
                "Pago registrado correctamente"
            );


            form.reset();

            ocultarQR();

        }
        catch (error) {

            console.error(error);

            alert(
                "Error al registrar pago"
            );

        }

    }
);


/* =========================================
   INICIAR
   ========================================= */

cargarSocios();