const authJwt = require('./authJwt')
const verifySignUp = require('./verifySignUp')
const withoutDuplicates = require('./withoutDuplicates')
const checkFileName = require('./checkFileName')
module.exports = {
    authJwt,
    verifySignUp,
    withoutDuplicates,
    checkFileName,
}