// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: false,

  apiUrl: 'http://api.meupedido.localhost',

  firebase: {
    apiKey: "AIzaSyD4MqNZ5Mu42i3Spt_QytbJqnf0cDoB1OM",
    authDomain: "meu-pedido-2a14c.firebaseapp.com",
    projectId: "meu-pedido-2a14c",
    storageBucket: "meu-pedido-2a14c.appspot.com",
    messagingSenderId: "201452188265",
    appId: "1:201452188265:web:8f572a356ac80ca121e8f8",
    measurementId: "G-29JQV9JVNP"
  },

  mercadopago: {
    publicKey: 'TEST-b01bd26b-0810-457b-8187-54db697eb8eb'
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
