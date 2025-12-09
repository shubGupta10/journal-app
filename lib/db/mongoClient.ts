import { MongoClient } from 'mongodb'

if (!process.env.DB_LOCAL_URL && !process.env.DB_PROD_URL) {
    throw new Error('Invalid/Missing environment variable: "DB_LOCAL_URL" or "DB_PROD_URL"');
}

const uri = process.env.NODE_ENV === 'production'
    ? process.env.DB_PROD_URL!
    : process.env.DB_LOCAL_URL!;

const options = {};

 let client: MongoClient;
 let clientPromise: Promise<MongoClient>

if(process.env.NODE_ENV === 'development') {

    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if(!globalWithMongo._mongoClientPromise){
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export  default clientPromise;