import {betterAuth} from 'better-auth'
import {mongodbAdapter} from 'better-auth/adapters/mongodb'
import clientPromise from "@/lib/db/mongoClient";
import {username} from "better-auth/plugins";

const client = await clientPromise;
const db = client.db("journal-app");

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
       google: {
           clientId: process.env.GOOGLE_CLIENT_ID as string,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
       }
    },
    plugins: [
        username()
    ]
})