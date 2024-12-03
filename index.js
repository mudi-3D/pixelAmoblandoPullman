class PixelMudi {

    constructor() {

        /** Atributos del usuario */
        this.userID = null;             // Id del usuario asignado desde el backEnd
        this.userDevice = null;         // Dispositivo desde donde se inicio la sesión
        this.userTime = null            // Tiempo que ha durado en la página

        this.company = null;            // Compañía que se está trackeando amoblando // Pullman 
    };

    /** Método para verificar si el usuario existe o se crea uno nuevo ❌*/
    async verifyUser() {

        const idUSer = localStorage.getItem('user_pixel_Mudi');

        if (!idUSer) {

            /**
             
             * Petición FETCH para saber que consecutivo tendrá ese usuario 
             * guardarlo en el localStorage 
             * Asociarlo con el atributo this.user
             * 
             
            **/

            return;
        };

        this.userID = idUSer;

    };

    /** Método para verificar la compañia en la que se está ejecutando el pixel ✅ */
    verifyCompany() {
        const domain = location.hostname;
        domain.includes('amoblando') && (this.company = "amoblando");
        domain.includes('pullman') && (this.company = "pullman");
    };

    /** Método para identificar el dispositivo por el ancho de pantalla  ✅*/
    verifyDevice() {
        const widthUserScreen = window.innerWidth;

        if (widthUserScreen <= 768) {
            this.userDevice = 'Mobile';
        } else if (widthUserScreen > 768 && widthUserScreen <= 1024) {
            this.userDevice = 'Tablet';
        } else {
            this.userDevice = 'Computador';
        };
    };

    /** Método para determinar el tiempo que ha pasado ✅ */
    counterTime() {
        /** Por la naturaleza del sitio que es creado por JS  no limpiamos el intervalo. */
        setInterval(() => this.userTime++, 1000);
    };

    /** Método para verificar si hay que crear una nueva sesión o se toman los datos de la sesión actual ❌*/
    verifySession() {

        const session = localStorage.getItem('session_date_pixelMudi');   // Fecha de actualización 
        const sessionID = localStorage.getItem('session_id_pixelMudi');     // Id de la sesión

        if (!session || !sessionID) {

            /** Creamos la sesión en el local storage y en la base de datos */
            return;

        } else {

            /** Hacemos la verificación de si ya se pasó 30 min 
             *  Si se pasó 30 min entonces creamos otra sesión 
             *  Si no ,  actualizamos el ultimo valor del local storage para que siga la sesión 
            */
        };

    };

    /** Método para enviar información de la página visitada ❌*/
    verifyPage() {

    };

    /** Método para enviar el "total" de la transacción ❌*/
    verifyPurchase() {

    };

    /** Método para enviar el detalle de la transacción ( Información por producto ) ❌*/
    verifyDetailsPurchase() {

    };

    /** Metodo para iniciar el proceso del pixel de Mudi ❌*/
    pixelMudiOn() {

    };

}
