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
## Клиентское приложение для контактов на Cordova

В этом примере шаг за шагом показано, как создать приложение Cordova с использованием Ionic Framework и служб O365 Outlook с нуля.

Настоятельно рекомендуется пройти через [инструменты Visual Studio для Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) и [Начало работы с инструментами Visual Studio для Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) для настройки среды разработки Cordova.

В этом уроке вы будете эти шаги

1. Создание Blank Cordova в среде Visual Studio
2. Добавить Ionic Framework
3. Добавление служб O365 в приложение
4. Установка разрешений для контактов O365 для предоставления соответствующего доступа к приложению
5. Создание структуры папок приложения, маршрутизации пользовательского интерфейса и макета с использованием элементов управления Ionic и навигации
6. Получение маркера доступа и получение клиента служб Outlook с использованием фабрики AngularJS
7. Получение контактов с помощью API O365
8. Добавление нового контакта с помощью API O365
9. Запуск приложения

![Страница входа в приложение](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Представление контактов приложения](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/contact-list.png)
![Страница сведений о контактах приложения](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-contact.png)

### Шаг 1. Создание Blank Cordova в среде Visual Studio
Чтобы создать новый проект Cordova в Visual Studio, выберите File --> New project --> JavaScript --> Apache Cordova Apps --> Blank App template. В этом примере используется код JavaScript, но вы также можете написать свое приложение Cordova на TypeScript.

### Шаг 2. Добавить Ionic Framework
1.	На веб-сайте Ionic Framework выберите Загрузить бета-версию.
2.	Извлечение ZIP-архива
3.	Создайте новую папку с именем lib в проекте Cordova в обозревателе решений Visual Studio и скопируйте извлеченный контент в папку lib.

![Структура папок для Project](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**обновить ссылки на скрипты**
— in. HTML, добавьте указанные ниже ионные ссылки в ``` < головка > ```, после того как ссылаются на platformOverrides.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- В index. HTML добавьте ниже ионную ссылку CSS.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Этап 3. Добавить сервисы O365 в приложение
См. документацию [Настройка среды разработки Office 365](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) в разделе Регистрация на сайте разработчика Office 365 и настройка доступа Azure Active Directory к сайту разработчика.

Выполните следующие действия, чтобы добавить и настроить API-интерфейсы Office 365 с помощью диспетчера служб в Visual Studio.

1. Загрузите и установите инструменты Office 365 API из галереи Visual Studio
2. На узле проекта щелкните правой кнопкой мыши и выберите **Добавить -> Подключенная служба**
3. В верхней части диалогового окна «Диспетчер служб» выберите ссылку Office 365, а затем выберите «Зарегистрировать приложение». Войдите в систему с учетной записью администратора клиента для вашей организации-разработчика Office 365.
![Вход в O365 Services Manager](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Шаг 4. Установка разрешений для контактов O365 для предоставления соответствующего доступа к приложению
Выберите "Контакты" и щелкните ссылку "Разрешения..." на правой панели, а затем выберите "Полный доступ к контактам пользователя". Аналогичным образом, если вы хотите предоставить доступ только для чтения к приложению, выберите "Чтение контактов пользователя".

![Области разрешений O365 для диалогового окна контактов](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Contact-permission.png)

Нажмите "Применить" и "ОК", чтобы установить разрешение и добавить API O365 в проект. Это добавит в проект папку Service, содержащую библиотеки JavaScript.

![дерево папок проекта после добавления разрешений](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

В index.html добавьте следующие ссылки O365 в элемент ``` <head> ```.
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Шаг 5 Создание структуры папок приложения, маршрутизации пользовательского интерфейса и макета с использованием элементов управления Ionic и навигации **

1. Создайте папку приложения под корневым узлом проекта. Папка приложения будет содержать файлы, специфичные для приложения. Каждый компонент пользовательского интерфейса, который выполняет выборку и привязку данных к пользовательскому интерфейсу, будет иметь соответствующий контроллер, аналогичный пользовательскому интерфейсу и шаблону кода. Например, contact-list.html покажет элемент управления списком для отображения контактов пользователя, а contact-list-ctrl.js будет содержать код для получения контактов пользователя с использованием API O365.

![древовидная структура папок проекта для приложения](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Contact-app-folders.PNG)

**Сведения о папках и файлах:**
— **проверка подлинности** содержит пользовательский интерфейс и код для входа и выхода
— **app.js** содержит функцию маршрутизации пользовательского интерфейса для перехода на другие страницы
— **service-o365.js** содержит служебную функцию для получения маркера доступа, создания клиентского объекта служб Outlook, выхода и получения имени пользователя. Она реализована как фабрика Angular, так что эти функции могут быть предоставлены в виде служебной функции на разных страницах.

**app.js, на котором определена маршрутизация пользовательского интерфейса**
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

**Макет приложения (меню, панель навигации)** 
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

### Этап 6. Получите токен доступа и получите клиент служб Outlook, используя фабрику AngularJS

**получить маркер доступа**
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
**create Outlook services client object**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### Шаг 7. Получение контактов с помощью API O365

**Получить все контакты**
```javascript
outlookClient.me.contacts.getContacts().fetch()
.then(function (contacts) {
  // Get the current page. Use getNextPage() to fetch next set of contacts.
  vm.contacts = contacts.currentPage;
  $scope.$apply();                
});
```

### Шаг 8. Добавление нового контакта с помощью API O365
Для добавления, обновления и удаления контакта можно использовать клиентский объект Outlook.

**Создать страницу для отправки данных для создания нового контакта**
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
**Создать новый контакт с помощью следующего кода**
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

### Шаг 9. Запуск приложения

1. Выберите Android и выберите его в качестве Android Emulator или устройства. Обратите внимание, что в настоящее время Ripple не поддерживается для аутентификации O365.

![панель выбора целевой платформы](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 для запуска приложения**

Ознакомьтесь [развертывании и запуске приложения, созданного с помощью средств Visual Studio Tools для Apache Cordova](http://msdn.microsoft.com/en-us/library/dn757049.aspx) Подробнее о том, как запустить приложение Cordova на разных платформах.


Этот проект соответствует [Правилам поведения разработчиков открытого кода Майкрософт](https://opensource.microsoft.com/codeofconduct/). Дополнительные сведения см. в разделе [часто задаваемых вопросов о правилах поведения](https://opensource.microsoft.com/codeofconduct/faq/). Если у вас возникли вопросы или замечания, напишите нам по адресу [opencode@microsoft.com](mailto:opencode@microsoft.com).
