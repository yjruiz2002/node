const { Telegraf } = require('telegraf');
const firebase = require('firebase/app');
require('firebase/database');

// Import the getDatabase function from the firebase/database module
const { getDatabase, ref, get } = require('firebase/database');

const bot = new Telegraf('6872352005:AAHedgmUMYc9PeHuetnCLsxjfJ2Phoq50rw');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJL6YfOQ_cNrLWla8praOgF03Z2BxKOXQ",
    authDomain: "tesis-final-84a29.firebaseapp.com",
    databaseURL: "https://tesis-final-84a29-default-rtdb.firebaseio.com",
    projectId: "tesis-final-84a29",
    storageBucket: "tesis-final-84a29.appspot.com",
    messagingSenderId: "751823933609",
    appId: "1:751823933609:web:672b19593e37faddd999b8"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const db = getDatabase();

const messageRef = ref(db, 'sensores/DHT11');
const messageRefLuz = ref(db, 'sensores/Luz');
const messageAcuse1 = ref(db, 'sensores/ACUSES1');
const messageAcuse2 = ref(db, 'sensores/ACUSES2');

var mensaje = "";
bot.start((ctx) => { 
        get(messageRef)
        .then((snapshot) => {
            var app_humedad = "";
            var app_temperatura = "";
            var tiempo_actualizacion = "";
            
            
            if (snapshot.exists()) {
                const children = snapshot.val();
                const keys = Object.keys(children);
                const lastKey = keys[keys.length - 1];
                const lastChild = children[lastKey];
                const lastChildText = JSON.stringify(lastChild);
                const objeto = JSON.parse(lastChildText);
                const humedad = objeto['humedad'];
                const temperatura = objeto['temperatura'];
                const newhumedad = JSON.stringify(humedad);
                //console.log("newhumedad", newhumedad);
                app_humedad = newhumedad.replace(/"/g, "");
                const newtemperatura = JSON.stringify(temperatura);
                //console.log("newtemperatura", newtemperatura);
                app_temperatura = newtemperatura.replace(/"/g, "");
                const time = objeto['tiempo'];
                //console.log("time", time); // Imprime la fecha formateada
                
                var valores = time.match(/\((.*?)\)/)[1];
                var lista = valores.split(", ");
                //console.log("time", lista); // Imprime la fecha formateada
                var año = parseInt(lista[0]);
                var mes = parseInt(lista[1]);
                var dia = parseInt(lista[2]);
                var hora = parseInt(lista[3]);
                var minuto = parseInt(lista[4]);
                var fecha = new Date(año, mes - 1, dia, hora, minuto); // Restamos 1 al mes porque los meses en JavaScript comienzan desde 0
                var formatoFecha = fecha.toLocaleDateString();
                var formatoHora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Obtiene el formato de fecha local del navegador
                //console.log("VALUEEE", parseInt(value));
                
               
                
                const newtiempo = JSON.stringify(formatoFecha) + " " + JSON.stringify(formatoHora);
                
                tiempo_actualizacion = newtiempo.replace(/"/g, "");
                mensaje = app_humedad + app_temperatura + tiempo_actualizacion;
                ctx.reply(mensaje.toString());
            } else {
                ////console.log("El nodo 'sensores/DHT11' no tiene hijos en la base de datos");
            }
        })
        .catch((error) => {
            console.error("Error al leer el mensaje:", error);
        });
});

bot.launch();