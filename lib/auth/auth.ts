import {betterAuth} from 'better-auth'
import {mongodbAdapter} from 'better-auth/adapters/mongodb'
import clientPromise from "@/lib/db/mongoClient";
import {username} from "better-auth/plugins";

const client = await clientPromise;
const db = client.db("journal-site");

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        username()
    ]
})