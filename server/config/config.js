//Puerto
process.env.PORT= process.env.PORT || 3000;
const USER =process.env.MONGO_USER;
const PASS=process.env.MONGO_PASS;

//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//mongodb+srv://diffo23:<Rastafari23.>@cafe-1ue16.mongodb.net/test?retryWrites=true

//https://downloads.mongodb.org/linux/mongodb-shell-linux-x86_64-ubuntu1804-4.0.6.tgz

//mongo "mongodb+srv://cafe-1ue16.mongodb.net/test" --username diffo23

// mongo "mongodb://cafe-shard-00-00-1ue16.mongodb.net:27017,cafe-shard-00-01-1ue16.mongodb.net:27017,cafe-shard-00-02-1ue16.mongodb.net:27017/test?replicaSet=cafe-shard-0" --ssl --authenticationDatabase admin --username diffo23 --password <PASSWORD>


let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';

}else{

    urlDB = `mongodb+srv://${USER}:${PASS}@cafe-1ue16.mongodb.net/test?retryWrites=true`;
}


process.env.URLDB = urlDB;

// vencimiento del token

/*
60 seg
60 mint
24 horas
30 dias
*/

process.env.CADUCIDAD_TOKEN ='48h';

// seed del token

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'secret-es-el-seed-de-desarrollo';

//Google Client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '794367911359-361mqjggk34ffpopv8kk620hms1k6jeq.apps.googleusercontent.com';

