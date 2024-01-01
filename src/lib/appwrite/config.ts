import {Client,Account,Databases,Storage,Avatars} from "appwrite"

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databasesId: import.meta.env.VITE_APPWRITE_DATABASES_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userscollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postscollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    savescollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID
}

export const client = new Client();

client.setProject(appwriteConfig.projectId)
client.setEndpoint(appwriteConfig.url)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);