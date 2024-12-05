class PixelMudi {

    constructor() {

        /** Atributos asociados al usuario */

        this.userID = null;             // Id del usuario asignado desde el backEnd
        this.userDevice = null;         // Dispositivo desde donde se inicio la sesión
        this.userTime = 0               // Tiempo que ha durado en la página

        /** Atributos asociados al funcionamiento del  pixel */

        this.sessionId = null;          // ID de la sesión del usuario.
        this.sessionDate = null;        // Fecha de creación de la sesión
        this.currentDate = null;        // Fecha actual del momento consultado
        this.currentPath = null;        // Path de la página visitada
        this.viewIcon = 0               // La pagina visitada tiene algún icono 3D
        this.interaction = 0;           // la página visitada interactuo con algún 3D
        this.addToCar = 0               // La página visitada tuvo intensióin de compra
        this.company = null;            // Compañía que se está trackeando amoblando // Pullman 

        /** Verificadores de elementosHTML */

        this.iconsCards3D = 0           // Atributo que nos permite saber si hay icons3D en las cards PLP 
        this.icon3DPDP = 0              // Atributo que nos permite saber si hay icons3D en la PDP
        this.btnAddToCar = 0            // Atributo que nos permite saber si intensión de compra
    };



    /** Método para obtener la fecha del momento de la consulta en el servidor ✅  */
    async getCurrentDate() {
        fetch('https://viewer.mudi.com.co:3589/api/mudiV1/requestDate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(data => this.currentDate = data.date)
            .catch(error => { throw new Error(`No se obtener la fecha exacta del servidor.\n ${error}`) });
    };

    /** Método para determinar el tiempo que ha pasado ✅ */
    counterTime() {
        /** Por la naturaleza del sitio que es creado por JS  no limpiamos el intervalo. */
        setInterval(() => this.userTime++, 1000);
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




    /** Método para verificar si el usuario existe , si no ; se crea uno nuevo ✅*/
    async verifyUser() {

        const idUSer = localStorage.getItem('user_pixel_Mudi');

        if (!idUSer) {

            fetch('https://viewer.mudi.com.co:3589/api/mudiV1/createUserAmoblandoPullman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(data => data.json())
                .then(data => {
                    localStorage.setItem('user_pixel_Mudi', data.data.insertId);
                    this.userID = data.data.insertId
                })
                .catch(error => { throw new Error(`No se logró crear el usuario PIXEL MUDI.\n ${error}`) });

            return;
        };

        this.userID = idUSer;

    };

    /** Método me permite saber si ya la sesión expiró ( Expira cuando pasan 30 min o más sin cambiar de página - inactividad - )  ✅ */
    verifySessionExpired(myDate) {
        const date = new Date(myDate)
        const ahora = new Date(this.currentDate);

        const resultado = date - ahora
        const resultado2 = resultado / (1000 * 60);

        return resultado2 > 30;
    };

    /** Método para crear una nueva sesión en el pixel ✅ */
    async createSessionPixel() {

        const data = {
            id_user: this.userID,
            device: this.userDevice,
            company: this.company
        };

        fetch('https://viewer.mudi.com.co:3589/api/mudiV1/createSessionAmoblandoPullman', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => data.json())
            .then(data => {
                localStorage.setItem('session_id_pixelMudi', data.data.insertId);
                localStorage.setItem('session_date_pixelMudi', data.date);
                this.sessionId = data.data.insertId;
                this.sessionDate = data.date
            })
            .catch(error => { throw new Error(`No se logró crear el usuario PIXEL MUDI.\n ${error}`) });
    };

    /** Método para verificar si hay que crear una nueva sesión o se toman los datos de la sesión actual  ✅*/
    async verifySession() {

        const sessionDate = localStorage.getItem('session_date_pixelMudi');     // Fecha de actualización 
        const sessionID = localStorage.getItem('session_id_pixelMudi');         // Id de la sesión

        if (!sessionDate || !sessionID) {
            await this.createSessionPixel()
        } else {

            if (this.verifySessionExpired(sessionDate)) {
                await this.createSessionPixel();
            } else {
                localStorage.setItem('session_date_pixelMudi', this.currentDate);
            };
        };

    };




    /** Método para asignar un listener a los iconos 3D de las cards de productos PLP ✅*/
    verifyIconCardsProducts() {

        const iconsCards3D = document.querySelectorAll('.iconCatMudi_3D');

        if (this.iconsCards3D == 700) {
            return;
        }
        else if (icons3DPLP.length == 0) {
            this.iconsCards3D++;
            requestAnimationFrame(this.verifyIconCardsProducts.bind(this));
            return
        };

        this.viewIcon = 1;
        iconsCards3D.forEach(icon => {
            icon.addEventListener('click', () => {
                this.interaction = 1;
            })
        });

    };

    /** Método para asignar un listener al icono 3D de la PDP ✅*/
    verifyIcon3DPDP() {

        const icon3DPDP = document.querySelector('.btnsMudiContainer');

        if (this.icon3DPDP == 700) {
            return;
        }
        else if (!icon3DPDP) {
            this.icon3DPDP++;
            requestAnimationFrame(this.verifyIcon3DPDP.bind(this));
            return
        };

        this.viewIcon = 1;
        icon3DPDP.addEventListener('click', () => this.interaction = 1);

    };

    /** Método para asignar un listener al botón de add to car  ✅*/
    verifyBtnAddToCar() {

        const addToCar = document.querySelector('#product-addtocart-button');

        if (this.btnAddToCar == 700) {
            return;
        }
        else if (!addToCar) {
            this.btnAddToCar++;
            requestAnimationFrame(this.verifyBtnAddToCar.bind(this));
            return;
        };

        addToCar.addEventListener('click', () => this.addToCar = 1);
    };

    /** Método para verificar información importante de la página ✅*/
    verifyPage() {

        if (location.href.includes('/checkout')) return;

        const pagePath = window.location.pathname;
        const pageHash = window.location.hash;
        this.currentPath = `${pagePath}${pageHash}`;

        this.verifyIconCardsProducts();
        this.verifyIcon3DPDP();
        this.verifyBtnAddToCar();

        window.addEventListener('beforeunload', () => {

            if (!this.sessionId) return;
            fetch('https://viewer.mudi.com.co:3589/api/mudiV1/createPageViewAmoblandoPullman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_session: this.sessionId,
                    path: this.pagePath,
                    viewIcon: this.viewIcon,
                    interaction: this.interaction,
                    time_session: this.userTime,
                    addToCar: this.addToCar
                })
            }).catch(error => { throw new Error(`No se logro postear la información de la página.\n ${error}`) });

        });

    };



    /** Método para enviar el "total" de la transacción ❌*/
    verifyPurchase() {

    };



    /** Metodo para iniciar el proceso del pixel de Mudi ❌*/
    async pixelMudiOn() {

        try {

            await this.getCurrentDate();

            this.counterTime();
            this.verifyCompany();
            this.verifyDevice();

            await this.verifyUser();
            await this.verifySession();

        } catch (error) {
            console.error(error);
        };

    };

};

const pixelMudi = new PixelMudi();
pixelMudi.pixelMudiOn();
