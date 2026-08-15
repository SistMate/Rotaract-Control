import { db }
from "./firebase-config.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const tabla =
document.getElementById(
    "tablaSocios"
);


/* =========================================
   CARGAR DATOS
   ========================================= */

async function cargarDatos() {

    try {

        const sociosSnap =
        await getDocs(
            collection(
                db,
                "Socios"
            )
        );


        const reunionesSnap =
        await getDocs(
            collection(
                db,
                "Reunion"
            )
        );


        const actividadesSnap =
        await getDocs(
            collection(
                db,
                "Actividad"
            )
        );


        const totalReuniones =
        reunionesSnap.size;


        const totalActividades =
        actividadesSnap.size;


        tabla.innerHTML = "";


        /* =====================================
           SIN SOCIOS
           ===================================== */

        if (sociosSnap.empty) {

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
           RECORRER SOCIOS
           ===================================== */

        sociosSnap.forEach(
            (docSocio) => {

                const socio =
                docSocio.data();


                const nombre =
                socio["Nombre Completo"];


                let reunionesAsistidas = 0;

                let actividadesAsistidas = 0;


                /* =================================
                   REUNIONES
                   ================================= */

                reunionesSnap.forEach(
                    (reunion) => {

                        const datos =
                        reunion.data();


                        if (
                            datos.asistenciaSocios &&
                            datos.asistenciaSocios.includes(nombre)
                        ) {

                            reunionesAsistidas++;

                        }

                    }
                );


                /* =================================
                   ACTIVIDADES
                   ================================= */

                actividadesSnap.forEach(
                    (actividad) => {

                        const datos =
                        actividad.data();


                        if (
                            datos.asistenciaSocios &&
                            datos.asistenciaSocios.includes(nombre)
                        ) {

                            actividadesAsistidas++;

                        }

                    }
                );


                /* =================================
                   PORCENTAJE
                   ================================= */

                const totalEventos =
                totalReuniones +
                totalActividades;


                const asistencias =
                reunionesAsistidas +
                actividadesAsistidas;


                const porcentaje =
                totalEventos > 0
                ?
                (
                    asistencias /
                    totalEventos
                ) * 100
                :
                0;


                const porcentajeRedondeado =
                porcentaje.toFixed(1);


                /* =================================
                   INSERTAR FILA
                   ================================= */

                tabla.innerHTML += `

                    <tr>

                        <td>

                            <i class="fa-solid fa-user"></i>

                            ${nombre || ""}

                        </td>


                        <td>

                            ${reunionesAsistidas}

                            /

                            ${totalReuniones}

                        </td>


                        <td>

                            ${actividadesAsistidas}

                            /

                            ${totalActividades}

                        </td>


                        <td>

                            <div class="porcentaje-contenedor">

                                <div class="barra">

                                    <div
                                        class="barra-progreso"
                                        style="width:${porcentaje}%">

                                    </div>

                                </div>

                                <span
                                    class="porcentaje-texto">

                                    ${porcentajeRedondeado}%

                                </span>

                            </div>

                        </td>

                    </tr>

                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Error al cargar asistencia:",
            error
        );


        tabla.innerHTML = `

            <tr>

                <td colspan="4">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    Error al cargar los datos de asistencia

                </td>

            </tr>

        `;

    }

}


/* =========================================
   INICIAR
   ========================================= */

cargarDatos();