//Puerto
process.env.PORT= process.env.PORT || 3000;
const USER ='diffo23';
const PASS='Rastafari23.';

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

