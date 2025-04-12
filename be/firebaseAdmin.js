import admin from "firebase-admin";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read Json file
const serviceAccount = JSON.parse(
    readFileSync(join(__dirname, "serviceAccountKey.json"), "utf-8")
);

// Initialize firebase admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export default admin;
