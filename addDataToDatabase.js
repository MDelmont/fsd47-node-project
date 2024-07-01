import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserModel from './models/User.model.js'; // Assurez-vous que le chemin est correct
import { readFile } from 'fs/promises'; // Utilisation de fs.promises pour une utilisation asynchrone
dotenv.config();

const { MONGO_URI } = process.env;

// Fonction asynchrone pour charger les données et les insérer dans MongoDB
async function importUsers() {
    try {
        const data = await readFile('./data/users.json', 'utf8');
        const usersData = JSON.parse(data);
        const insertedUsers = await UserModel.insertMany(usersData);
        console.log(`${insertedUsers.length} utilisateurs insérés avec succès`);
    } catch (err) {
        console.error('Erreur lors de l\'import des utilisateurs :', err);
    }
}

// Connexion à MongoDB et exécution de la fonction d'importation
mongoose.connect(MONGO_URI, {})
    .then(() => {
        console.log('Connexion à MongoDB réussie');
        importUsers(); // Appeler la fonction d'importation une fois connecté à MongoDB
    })
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));

const app = express();
app.use(express.json());
// Autres configurations d'Express

// Autres routes et configurations d'Express

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
