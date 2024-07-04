import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { readFile } from 'fs/promises';
import UserModel from "./models/User.model.js";
dotenv.config();

const { MONGO_URI } = process.env;

// Function to load data and insert data in DB
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

// Connect to Mongo and call the importUsers function
mongoose.connect(MONGO_URI, {})
    .then(() => {
        console.log('Connexion à MongoDB réussie');
        importUsers();
    })
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
