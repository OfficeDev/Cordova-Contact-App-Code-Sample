---
page_type: sample
products:
- office-365
- office-outlook
languages:
- javascript
extensions:
  contentType: samples
  createdDate: 12/9/2014 3:57:44 PM
---
## Aplicación cliente de contactos en Cordova

Esta aplicación de ejemplo muestra paso a paso cómo crear desde cero una aplicación de Cordova con el marco Ionic y los servicios de Outlook de O365.

Le recomendamos encarecidamente que vea [Visual Studio Tools para Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) e [Introducción a Visual Studio Tools para Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) para instalar el entorno de desarrollo de Cordova.

En este tutorial, aprenderá los siguientes pasos:

1. Crear Cordova en blanco con Visual Studio.
2. Agregar el marco Ionic.
3. Agregar servicios de O365 a la aplicación
4. Establecer los permisos para los contactos de O365 para conceder el acceso apropiado a la aplicación
5. Crear una estructura de carpetas de aplicaciones, enrutamiento y diseño de la interfaz de usuario con la navegación y controles de Ionic.
6. Adquirir un token de acceso y obtener el cliente de servicios de Outlook con la factoría de AngularJS
7. Usar la API de O365 para obtener los contactos
8. Usar la API de O365 para agregar un nuevo contacto
9. ¡Ejecutar la aplicación!

![Página de inicio de sesión de la aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Vista de contacto de la aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/contact-list.png)
![Página de detalles de contacto de aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-contact.png)

### Paso 1: Crear Cordova en blanco con Visual Studio
Cree un nuevo proyecto de Cordova en Visual Studio, eligiendo Archivo: --> Nuevo proyecto: --> JavaScript, --> Aplicaciones de Apache Cordova --> Plantilla de aplicación vacía. Este ejemplo usa código JavaScript, pero también puede escribir la aplicación de Cordova en TypeScript.

### Paso 2: Agregar el marco Ionic
1.	Desde el sitio web del marco Ionic, elija Descargar beta.
2.	Descomprima el archivo zip
3.	Cree una nueva carpeta denominada lib en el proyecto de Cordova en el explorador de soluciones de Visual Studio y copie el contenido descomprimido en la carpeta lib.

![Estructura de carpetas para el proyecto](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**Actualizar las referencias al script**
- En index.html, agregue las siguientes referencias a Ionic en el elemento ``` <head> ```, después de las referencias al script de Cordova y platformOverrides.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- En index.html, agregue las siguientes referencias de CSS Ionic.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Paso 3: Agregar servicios de O365 a la aplicación
Consulte la documentación [Configurar el entorno de desarrollo de Office 365](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) para  suscribirse a un sitio para desarrolladores de Office 365 y configurar el acceso de Azure Active Directory para su sitio de desarrolladores.

Siga estos pasos para agregar y configurar las API de Office 365 mediante el Administrador de servicios en Visual Studio.

1. Asegúrese de descargar e instalar las herramientas de la API de Office 365 desde la Galería de Visual Studio.
2. En el nodo proyecto, haga clic con el botón derecho y elija **Agregar --> Servicio conectado**
3. En la parte superior del cuadro de diálogo del Administrador de servicios, elija el vínculo Office 365 y luego seleccione Registrar su aplicación. Conéctese con una cuenta de Administrador de espacios empresariales de su organización de desarrolladores de Office 365.
![Inicio de sesión del administrador de servicios de O365](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Paso 4: Establecer los permisos para los contactos de O365 para conceder el acceso apropiado a la aplicación
Seleccione Contacto y haga clic en Permisos... situado en el panel derecho y, luego, seleccione "Tener acceso total a los contactos de los usuarios". Si lo que desea es dar solo acceso de lectura a la aplicación, seleccione "Acceso de lectura a los contactos de los usuarios".

![Ámbitos de permiso de O365 para el cuadro de diálogo Contacto](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Contact-permission.png)

Haga clic en Aplicar y Aceptar para establecer el permiso y agregar la API de O365 al proyecto. Esto agregará la carpeta Servicio que contiene las bibliotecas de JavaScript del proyecto.

![Árbol de carpetas del proyecto después de agregar permisos](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

En index.html, agregue las siguientes referencias de O365 al elemento ``` <head> ```.
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Paso 5: Crear una estructura de carpetas de aplicaciones, enrutamiento y diseño de la interfaz de usuario con la navegación y controles de Ionic**

1. Cree una carpeta de aplicación en el nodo raíz del proyecto. La carpeta de aplicación contendrá archivos específicos de la aplicación. Cada componente de la interfaz de usuario que recupera y enlaza datos a la interfaz de usuario, tendrá un controlador correspondiente muy similar a la interfaz de usuario y patrones de código subyacentes. Por ejemplo, contact-list.html mostrará el control de lista para visualizar los contactos del usuario y contact-list-ctrl.js contendrá código para capturar los contactos de los usuarios mediante la API de O365.

![Estructura de árbol de las carpetas del proyecto para la aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Contact-app-folders.PNG)

**Detalle de archivo y carpetas:*
 - **auth** contiene la interfaz de usuario y el código para iniciar y cerrar sesión
 - **app.js** contiene el enrutamiento de la interfaz de usuario para ir a las distintas páginas
 - **service-o365.js** contiene una función de utilidad para obtener el token de acceso, crear un objeto de cliente de servicios de Outlook, cerrar sesión y obtener el nombre del usuario. Esto se implementa como una factoría de Angular para que las funciones puedan exponerse como una función de utilidad en diferentes páginas.

**app.js que define el enrutamiento de la interfaz de usuario**
```javascript
angular.module("app365", ["ionic"])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    // Layout page
    .state('app', {
        abstract: true,
        url: "/app",
        templateUrl: "app/layout/layout.html"
    })

    // Sign-in page
     .state('sign-in', {
         url: "/sign-in",
         templateUrl: "app/auth/sign-in.html"
     })

    // Sign-out page
    .state('app.sign-out', {
        url: "/sign-out",
        views: {
            'mainContent': {
                templateUrl: "app/auth/sign-out.html"
            }
        }
    })    

    // Add new contact page
    .state('app.newContact', {
        url: "/newContact",
        views: {
            'mainContent': {
                templateUrl: "app/contact/add-contact.html"
            }
        }
    })

    // Contact list page
    .state('app.contact', {
        url: "/contact",
        views: {
            'mainContent': {
                templateUrl: "app/contact/contact-list.html"
            }
        }
    });    

    // Navigate to sign-in page when app starts.
    $urlRouterProvider.otherwise('sign-in');
})
```

**Diseño de aplicación (menú, barra de navegación)**
```html
<ion-side-menus ng-controller="layoutCtrl as vm">
    <ion-pane ion-side-menu-content>
        <ion-nav-bar class="bar-positive">
            <ion-nav-back-button class="button-clear icon ion-ios7-arrow-back"></ion-nav-back-button>
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>
        </ion-nav-bar>
        <ion-nav-view name="mainContent" animation="slide-left-right"></ion-nav-view>
    </ion-pane>

    <ion-side-menu side="left">
        <header class="bar bar-header bar-positive">
            <h1 class="title">{{vm.userName}}</h1>
        </header>
        <ion-content class="has-header">
            <ion-list>
                <ion-item nav-clear menu-close ui-sref="app.contact">Home</ion-item>
                <ion-item nav-clear menu-close ui-sref="app.newContact">New Contact</ion-item>                           
                <ion-item nav-clear menu-close ui-sref="app.sign-out">Sign-out</ion-item>
            </ion-list>
    </ion-side-menu>
</ion-side-menus>
```

### Paso 6: Adquirir un token de acceso y obtener el cliente de servicios de Outlook con la factoría de AngularJS

**Adquirir un token de acceso**
```javascript
var authContext = new O365Auth.Context();
authContext.getIdToken("https://outlook.office365.com/")
.then((function (token) {
     // Get auth token
     authtoken = token;
     // Get user name from token object.
     userName = token.givenName + " " + token.familyName;
    }), function (error) {
      // Log sign-in error message.
      console.log('Failed to login. Error = ' + error.message);
 });
```
**crear un objeto de cliente para servicios de Outlook**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### Paso 7: Usar la API de O365 para obtener los contactos

**Capturar todos los contactos**
```javascript
outlookClient.me.contacts.getContacts().fetch()
.then(function (contacts) {
  // Get the current page. Use getNextPage() to fetch next set of contacts.
  vm.contacts = contacts.currentPage;
  $scope.$apply();                
});
```

### Step 8: Use O365 API to add new contact
Outlook client object can be used to add, update and delete contact.

**Create the page to submit the data for creating new contact**
```html
<ion-view title=" New Contact" ng-controller="newContactCtrl as vm">
    <ion-content class="has-header">
        <div class="list">
            <label class="item item-input">
                <input type="text" placeholder="First Name" ng-model="newContact.firstname" />
            </label> 
            <label class="item item-input">
                <input type="text" placeholder="Last Name" ng-model="newContact.lastname" />
            </label> 
            <label class="item item-input">
                <input type="email" placeholder="Email" ng-model="newContact.email">
            </label>
            <label class="item item-input">
                <input type="text" placeholder="Phone" ng-model="newContact.phone" />
            </label>            
        </div>       
        <div class="padding">
            <button class="button button-block button-positive" ng-click="addContact()">
                Add Contact
            </button>
        </div>
    </ion-content>
</ion-view>
```
**Use el siguiente código para crear un nuevo contacto**
```javascript 
// Outlook client object.
var outlookClient;
// To store contact info.
$scope.newContact = {};

$scope.addContact = function () {
   outlookClient = app365api.outlookClientObj();           

    // Contact object
    var contact = new Microsoft.OutlookServices.Contact();

    // First and last name
    contact.givenName = $scope.newContact.firstname;
    contact.surname = $scope.newContact.lastname;

    // Mobile phone
    contact.mobilePhone1 = $scope.newContact.phone;

    // Email address
    var emailAddress = new Microsoft.OutlookServices.EmailAddress();
    emailAddress.address = $scope.newContact.email;
    contact.emailAddresses.push(emailAddress);

    // Add Contact
    outlookClient.me.contacts.addContact(contact)
    .then((function (response) {
         console.log('Contact added successfully.');    
     })
     .bind(this), function (reason) {
         // Log the error message when add contact fails.
         console.log('Fail to add contact. Error = ' + reason.message);
      });
};
```

### Paso 9: Ejecutar la aplicación

1. Seleccione Android, ya sea en un emulador o dispositivo de Android. Tenga en cuenta que actualmente no se permite Ripple para la autenticación de O365.

![barra de selección de plataforma de destino](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**Presione F5 para ejecutar la aplicación**

Consulte [Implementar y ejecutar una aplicación para Apache Cordova creada con Visual Studio Tools](http://msdn.microsoft.com/en-us/library/dn757049.aspx) para ver información adicional sobre cómo ejecutar la aplicación de Cordova en distintas plataformas.


Este proyecto ha adoptado el [Código de conducta de código abierto de Microsoft](https://opensource.microsoft.com/codeofconduct/). Para obtener más información, vea [Preguntas frecuentes sobre el código de conducta](https://opensource.microsoft.com/codeofconduct/faq/) o póngase en contacto con [opencode@microsoft.com](mailto:opencode@microsoft.com) si tiene otras preguntas o comentarios.
