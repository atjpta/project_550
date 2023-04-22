const config = {
    app: {
        port: process.env.PORT || 8088,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb+srv://admin:abc201199@cluster0.3crqh.mongodb.net/ct550?retryWrites=true&w=majority"
    },
    // db: {
    //     uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ct550"
    // },
    jwt: {
        secret: process.env.JWT_SECRET || "ct550-secret-key",
        // secretReresh: process.env.JWT_SECRETRERESH || "wbchat-secret-reresh-key",
        tokenLife: process.env.JWT_LIFE || 86400, // 24h 
        // tokenLifeReresh: process.env.JWT_LIFE_RERESH || 20, // 24h 
    },
}
module.exports = config;