# fsd47-node-project

## Initialisation du projet

```bash
git clone https://github.com/MDelmont/fsd47-node-project.git
```

```bash
cd fsd47-node-project
```

```bash
npm install
```

Création des données en base de donné

```bash
node addDataToDatabase.js
```

Configuration du .env en regardant le .env.sample

```
APP_HOSTNAME = "localhost"
APP_PORT = "8000"
NODE_ENV = "development" # production

SECRET_KEY_SESSION=key

MONGO_URI = mongodb://localhost:27017/{Database_name}
SECRET_KEY_HASH=key
SECRET_KEY_JWT_AUTH=key
```

Lancement de l’application

```bash
npm run dev
```

