import { auth, db }
from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   ELEMENTOS DEL DOM
   ========================================= */

const nombreUsuario =
    document.getElementById("nombreUsuario");

const btnCerrarSesion =
    document.getElementById("btnLogout");


/* =========================================
   OBTENER SALUDO SEGÚN LA HORA
   ========================================= */

function obtenerSaludo() {

    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
        return "Buenos días";
    }

    if (hora >= 12 && hora < 19) {
        return "Buenas tardes";
    }

    return "Buenas noches";
}


/* =========================================
   VERIFICAR SESIÓN
   ========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /* =====================================
           USUARIO NO AUTENTICADO
           ===================================== */

        if (!user) {

            window.location.href = "index.html";

            return;
        }


        /* =====================================
           OBTENER DATOS DEL USUARIO
           ===================================== */

        try {

            const docRef =
                doc(
                    db,
                    "Usuarios",
                    user.uid
                );


            const docSnap =
                await getDoc(docRef);


            /* =================================
               USUARIO ENCONTRADO
               ================================= */

            if (docSnap.exists()) {

                const datos =
                    docSnap.data();

                const saludo =
                    obtenerSaludo();


                nombreUsuario.innerHTML = `

                    <span class="saludo">
                        ${saludo},
                        <strong>${datos.nombre}</strong> 👋
                    </span>

                    <span class="cargo">
                        ${datos.cargo}
                        · Rotaract Club Cochabamba
                    </span>

                `;

            }


            /* =================================
               USUARIO SIN INFORMACIÓN
               ================================= */

            else {

                const saludo =
                    obtenerSaludo();


                nombreUsuario.innerHTML = `

                    <span class="saludo">
                        ${saludo} 👋
                    </span>

                    <span class="cargo">
                        Usuario sin información
                    </span>

                `;

            }

        }


        /* =====================================
           ERROR AL OBTENER DATOS
           ===================================== */

        catch (error) {

            console.error(
                "Error al cargar los datos del usuario:",
                error
            );

            nombreUsuario.innerHTML = `

                <span class="saludo">
                    ${obtenerSaludo()}
                </span>

                <span class="cargo">
                    Error al cargar información
                </span>

            `;

        }

    }
);


/* =========================================
   CERRAR SESIÓN
   ========================================= */

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            }

            catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

            }

        }
    );

}