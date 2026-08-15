import { db }
from "./firebase-config.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const listaActividades =
document.getElementById(
    "listaActividades"
);

const detalleActividad =
document.getElementById(
    "detalleActividad"
);

const btnVolverActividades =
document.getElementById(
    "btnVolverActividades"
);

const tituloActividad =
document.getElementById(
    "tituloActividad"
);

const fechaActividad =
document.getElementById(
    "fechaActividad"
);

const totalSocios =
document.getElementById(
    "totalSocios"
);

const totalSimpatizantes =
document.getElementById(
    "totalSimpatizantes"
);

const listaAsistenciaSocios =
document.getElementById(
    "listaAsistenciaSocios"
);

const listaAsistenciaSimpatizantes =
document.getElementById(
    "listaAsistenciaSimpatizantes"
);


/* =========================================
   VARIABLE DE ACTIVIDADES
   ========================================= */

let actividades = [];


/* =========================================
   CARGAR ACTIVIDADES
   ========================================= */

async function cargarActividades(){

    try{

        const snapshot =
        await getDocs(
            collection(
                db,
                "Actividad"
            )
        );


        actividades = [];


        snapshot.forEach(
            (documento)=>{

                actividades.push({

                    id:
                    documento.id,

                    ...documento.data()

                });

            }
        );


        mostrarActividades();

    }
    catch(error){

        console.error(
            "Error:",
            error
        );

        listaActividades.innerHTML = `

            <div class="mensaje-error">

                <i class="fa-solid fa-circle-exclamation"></i>

                Error al cargar las actividades

            </div>

        `;

    }

}


/* =========================================
   MOSTRAR ACTIVIDADES
   ========================================= */

function mostrarActividades(){

    listaActividades.innerHTML = "";


    if(actividades.length === 0){

        listaActividades.innerHTML = `

            <div class="sin-datos">

                <i class="fa-solid fa-calendar-xmark"></i>

                <h3>
                    No hay actividades registradas
                </h3>

                <p>
                    Todavía no se han registrado actividades.
                </p>

            </div>

        `;

        return;

    }


    actividades.forEach(
        (actividad)=>{

            const socios =
            actividad.asistenciaSocios || [];

            const simpatizantes =
            actividad.asistenciaSimpatizantes || [];


            let fecha = "Sin fecha";


            if(actividad.fecha){

                if(
                    typeof actividad.fecha.toDate ===
                    "function"
                ){

                    fecha =
                    actividad.fecha
                    .toDate()
                    .toLocaleDateString(
                        "es-BO",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    );

                }
                else{

                    fecha =
                    actividad.fecha;

                }

            }


            const tarjeta =
            document.createElement(
                "div"
            );


            tarjeta.className =
            "actividad-card";


            tarjeta.innerHTML = `

                <div class="actividad-icono">

                    <i class="fa-solid fa-calendar-check"></i>

                </div>


                <div class="actividad-info">

                    <h3>

                        ${actividad.nombreActividad || "Actividad sin nombre"}

                    </h3>

                    <p>

                        <i class="fa-solid fa-calendar"></i>

                        ${fecha}

                    </p>

                    <div class="mini-resumen">

                        <span>

                            <i class="fa-solid fa-user"></i>

                            ${socios.length} socios

                        </span>

                        <span>

                            <i class="fa-solid fa-users"></i>

                            ${simpatizantes.length} simpatizantes

                        </span>

                    </div>

                </div>


                <div class="actividad-flecha">

                    <i class="fa-solid fa-chevron-right"></i>

                </div>

            `;


            tarjeta.addEventListener(
                "click",
                ()=>{

                    mostrarDetalle(
                        actividad
                    );

                }
            );


            listaActividades.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================================
   MOSTRAR DETALLE
   ========================================= */

function mostrarDetalle(
    actividad
){

    listaActividades.style.display =
    "none";


    detalleActividad.style.display =
    "block";


    tituloActividad.textContent =
    actividad.nombreActividad ||
    "Actividad sin nombre";


    /* =====================================
       FECHA
       ===================================== */

    let fecha = "Sin fecha";


    if(actividad.fecha){

        if(
            typeof actividad.fecha.toDate ===
            "function"
        ){

            fecha =
            actividad.fecha
            .toDate()
            .toLocaleDateString(
                "es-BO",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

        }
        else{

            fecha =
            actividad.fecha;

        }

    }


    fechaActividad.innerHTML = `

        <i class="fa-solid fa-calendar-day"></i>

        ${fecha}

    `;


    /* =====================================
       ARRAYS
       ===================================== */

    const socios =
    actividad.asistenciaSocios || [];


    const simpatizantes =
    actividad.asistenciaSimpatizantes || [];


    totalSocios.textContent =
    socios.length;


    totalSimpatizantes.textContent =
    simpatizantes.length;


    /* =====================================
       MOSTRAR SOCIOS
       ===================================== */

    mostrarListaAsistencia(
        listaAsistenciaSocios,
        socios,
        "fa-user",
        "No hubo socios registrados"
    );


    /* =====================================
       MOSTRAR SIMPATIZANTES
       ===================================== */

    mostrarListaAsistencia(
        listaAsistenciaSimpatizantes,
        simpatizantes,
        "fa-user-group",
        "No hubo simpatizantes registrados"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   CREAR LISTA DE ASISTENCIA
   ========================================= */

function mostrarListaAsistencia(
    contenedor,
    personas,
    icono,
    mensaje
){

    contenedor.innerHTML = "";


    if(
        !personas ||
        personas.length === 0
    ){

        contenedor.innerHTML = `

            <div class="sin-asistencia">

                <i class="fa-solid fa-user-slash"></i>

                ${mensaje}

            </div>

        `;

        return;

    }


    personas.forEach(
        (persona, index)=>{

            const elemento =
            document.createElement(
                "div"
            );


            elemento.className =
            "persona";


            elemento.innerHTML = `

                <div class="numero">

                    ${index + 1}

                </div>


                <div class="persona-icono">

                    <i class="fa-solid ${icono}"></i>

                </div>


                <span>

                    ${persona}

                </span>


                <i class="fa-solid fa-circle-check check"></i>

            `;


            contenedor.appendChild(
                elemento
            );

        }
    );

}


/* =========================================
   VOLVER
   ========================================= */

btnVolverActividades.addEventListener(
    "click",
    ()=>{

        detalleActividad.style.display =
        "none";


        listaActividades.style.display =
        "grid";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================
   INICIAR
   ========================================= */

cargarActividades();