#istruzioni di setup per il nostro dockerfile
#prima istruzione è selezionare la nostra image di base dalla quale partire
FROM node:lts-alpine
# creiamo una cartella per la nostra applicazione (root folder)
WORKDIR /app
# copiamo il nostro Nasa-progect dentro la workdir appena creata 
# COPY source dest, la sintasse è con il punto punto 
COPY package*.json ./

COPY client/package*.json client/
# ora possiamo lanciare comandi per il setup del progetto
# non vogliamo però le devDependencies perche questa app vivrà nel cloud
# utilizziamo quindi --only=production che è un comando di npm
RUN npm run install-client --only=production
# costruiamo il clinet


COPY server/package*.json server/
RUN npm run install-server --only=production
# di default docker eseguira il comando CMD come root user, che come in un pc normale
# ha l'accesso a tutto quello che c'è dentro il container
# per diminuire la vulnerabilità dell'app le node images hanno uno user implementato apposta
# che ha meno privilegi del root user. quindi più sicuro

COPY client/ client/
RUN npm run build --prefix client


COPY server/ server/

USER node
# cosa fare quando questo docker container parte
# quando la docker image è costruita, e vogliamo far partire il container che usa questa immagine 
# dobbiamo lanciare il comando per far partire il servcer 
CMD [ "npm", "start", "--prefix", "server"]
# specificare quale PORT rendere disponibile per l'accesso all'app in internet
# utilizziamo la stessa dell'app
EXPOSE 8000