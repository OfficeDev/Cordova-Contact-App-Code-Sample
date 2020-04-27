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
## Application Contact Client Cordova

Cet exemple d’application montre comment créer, étape par étape, une application Cordova à l’aide du framework Ionic et des services Outlook O365 à partir de zéro.

Nous vous recommandons de lire attentivement [Visual Studio Tools pour Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) et [Prise en main de Visual Studio Tools pour Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) pour configurer l’environnement de développement Cordova.

Ce tutoriel vous montre comment effectuer les opérations suivantes

1. Créer un projet Cordova vide à l’aide de Visual Studio
2. Ajouter le framework Ionic
3. Ajouter les services O365 à l’application
4. Définir les autorisations sur les contacts O365 pour accorder un accès approprié à l'application
5. Créer une structure de dossier d'application, un routage et une mise en page de l'interface utilisateur à l'aide des commandes et de la navigation Ionic
6. Obtenir un jeton d’accès et les services clients Outlook, à l’aide de AngularJS Factory
7. Utiliser l’API O365 pour extraire les contacts
8. Utiliser l’API O365 pour ajouter un nouveau contact
9. Exécuter l’application

![Page de connexion de l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Affichage des contacts de l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/contact-list.png)
![Page des détails des contacts de l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-contact.png)

### Étape 1 : Créer un projet Cordova vide à l’aide de Visual Studio
Créer un projet Cordova dans Visual Studio en sélectionnant Fichier --> Nouveau projet --> JavaScript --> Applications Apache Cordova --> Modèle d’application vide. Cet exemple utilise du code JavaScript, mais vous pouvez également écrire votre application Cordova dans TypeScript.

### Étape 2 : Ajouter le framework Ionic
1.	Sur le site Web du framework Ionic, sélectionnez Télécharger la version bêta.
2.	Extrayez le fichier zip
3.	Créez un dossier nommé lib sous Projet Cordova dans l’Explorateur de solutions Visual Studio et copiez le contenu extrait sous le dossier lib.

![Structure de dossier pour le projet](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**Mettre à jour les références de script** :
dans index.html, ajoutez les références Ionic suivantes dans l’élément ```< head >```, après les références de script Cordova et platformOverrides.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- Dans index.html, ajouter la référence CSS Ionic suivante.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Étape 3 : Ajouter les services O365 à l’application
Consultez la documentation [Configurer votre environnement de développement Office 365](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) sur l’inscription à un site développeur Office 365 et configurez l’accès à Azure Active Directory pour votre site de développeur.

Procédez comme suit pour ajouter et configurer des API Office 365 à l’aide du gestionnaire de services dans Visual Studio.

1. Télécharger et Installez les outils d’API Office 365 à partir de la galerie Visual Studio.
2. Sur le nœud de projet, cliquez avec le bouton droit, puis sélectionnez **Ajouter --> Service connecté**
3. Dans la partie supérieure de la boîte de dialogue Gestionnaire des services, sélectionnez le lien Office 365, puis sélectionnez Enregistrer votre application. Connectez-vous à l’aide d’un compte d’administrateur client pour votre organisation Office 365 Développeur.
![Connexion à la boîte de dialogue Gestionnaire des services O365](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Étape 4 : Définir les autorisations sur les contacts O365 pour accorder un accès approprié à l'application
Sélectionnez Contact, puis cliquez sur le lien Autorisations... dans le volet droit, puis sélectionnez l’option «accès complet aux contacts des utilisateurs». De même, si vous souhaitez accorder un accès à l’application, en lecture uniquement, sélectionnez « Lire les contacts des utilisateurs ».

![Étendues d’autorisations O365 pour la boîte de dialogue des contacts](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Contact-permission.png)

Cliquez sur Appliquer, puis sur OK pour définir l’autorisation et ajouter l’API Office 365 au projet. Cette opération ajoute un dossier de Service contenant des bibliothèques JavaScript au projet.

![Arborescence des dossiers de projets après ajout d’autorisations](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

Dans index.html, ajoutez les références O365 suivantes dans l’élément ```<head>```.
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Étape 5 : Créer une structure de dossier d'application, un routage et une mise en page de l'interface utilisateur à l'aide des commandes et de la navigation Ionic**

1. Créez un dossier d’application sous le nœud racine du projet. Le dossier d’application contiendra les fichiers spécifiques à l’application. Chaque composant de l’interface utilisateur, qui récupère et lie les données à l’interface utilisateur disposera d’un contrôleur correspondant, comme l’interface utilisateur et le modèle de code. Par exemple, contact-list.html montre le contrôle de liste pour afficher les contacts des utilisateurs et contact-list-ctrl.js contient du code pour extraire les contacts des utilisateurs à l’aide de l’API Office 365.

![Structure arborescente des dossiers de projets pour l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Contact-app-folders.PNG)

**Détail de dossier et fichier :
** **authentification** contient l’interface utilisateur et du code pour la connexion et la déconnexion,
**app.js** contient le routage de l’interface utilisateur pour naviguer vers différentes pages,
**service-o365.js** contient une fonction utilitaire pour obtenir un jeton d'accès, créer un objet client des services Outlook, se déconnecter et obtenir le nom d'utilisateur. Ceci est implémenté comme Angular factory afin que ces fonctions puissent être exposées en tant que fonction utilitaire sur différentes pages.

**app.js définissant le routage interface utilisateur**
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

**Mise en page de l’application (menu, barre de navigation)**
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

### Étape 6 : Obtenir un jeton d’accès et les services clients Outlook, à l’aide de AngularJS Factory

**Obtenir un jeton d’accès**
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
**Créer un objet services client Outlook**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### Étape 7 : Utiliser l’API O365 pour extraire les contacts

**Récupérer tous les contacts**
```javascript
outlookClient.me.contacts.getContacts().fetch()
.then(function (contacts) {
  // Get the current page. Use getNextPage() to fetch next set of contacts.
  vm.contacts = contacts.currentPage;
  $scope.$apply();                
});
```

### Étape 8 : Utiliser l’API O365 pour ajouter un nouveau contact
Un objet client Outlook peut être utilisé pour ajouter, mettre à jour et supprimer un contact.

**Créer la page pour soumettre les données et créer un nouveau contact**
````html
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
**Utilisez le code suivant pour créer un nouveau contact**
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

### Étape 9 : Exécuter l’application

1. Sélectionnez Android et la cible comme un émulateur ou un appareil Android. Veuillez noter que Ripple n’est actuellement pas pris en charge pour l’authentification O365.

![Barre de sélection de la plateforme cible](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 pour exécuter l’application**

Pour plus d’informations sur l’exécution de l’application Cordova sur différentes plateformes, voir la rubrique [Déployer et exécuter votre application conçue avec Visual Studio Tools pour Apache Cordova](http://msdn.microsoft.com/en-us/library/dn757049.aspx).


Ce projet a adopté le [Code de conduite Open Source de Microsoft](https://opensource.microsoft.com/codeofconduct/). Pour en savoir plus, reportez-vous à la [FAQ relative au code de conduite](https://opensource.microsoft.com/codeofconduct/faq/) ou contactez [opencode@microsoft.com](mailto:opencode@microsoft.com) pour toute question ou tout commentaire.
