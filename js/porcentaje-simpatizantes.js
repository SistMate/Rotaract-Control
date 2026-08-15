import { db }
from "./firebase-config.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const tabla =
document.getElementById(
    "tablaSimpatizantes"
);


/* =========================================
   CARGAR DATOS
   ========================================= */

async function cargarDatos() {

    try {

        /* =====================================
           SIMPATIZANTES
           ===================================== */

        const simpatizantesSnap =
        await getDocs(
            collection(
                db,
                "Simpatizante"
            )
        );


        /* =====================================
           REUNIONES
           ===================================== */

        const reunionesSnap =
        await getDocs(
            collection(
                db,
                "Reunion"
            )
        );


        /* =====================================
           ACTIVIDADES
           ===================================== */

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
           SI NO HAY SIMPATIZANTES
           ===================================== */

        if (simpatizantesSnap.empty) {

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
           RECORRER SIMPATIZANTES
           ===================================== */

        simpatizantesSnap.forEach(
            (docSimpatizante) => {

                const simpatizante =
                docSimpatizante.data();


                const nombre =
                simpatizante.NombreSimpatizante;


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
                            datos.asistenciaSimpatizantes &&
                            datos.asistenciaSimpatizantes.includes(nombre)
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
                            datos.asistenciaSimpatizantes &&
                            datos.asistenciaSimpatizantes.includes(nombre)
                        ) {

                            actividadesAsistidas++;

                        }

                    }
                );


                /* =================================
                   CALCULAR PORCENTAJE
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
                   MOSTRAR EN TABLA
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