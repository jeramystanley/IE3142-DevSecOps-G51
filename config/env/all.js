// default app configuration
const port = process.env.PORT || 4000;
let db = process.env.MONGODB_URI || "mongodb://localhost:27017/nodegoat";

module.exports = {
    port,
    db,
    cookieSecret: process.env.NODEGOAT_SESSION_SECRET,
    cryptoKey: process.env.NODEGOAT_CRYPTO_KEY,
    cryptoAlgo: "aes256",
    hostName: "localhost",
    environmentalScripts: []
};

