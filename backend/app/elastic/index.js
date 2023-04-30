const { Client } = require('@elastic/elasticsearch');
const client = new Client({
    node: 'https://localhost:9200/',
    auth: {
        username: 'elastic',
        password: 'IxN_vEEX4fQ_i0h*4Cv0'
    },
    tls: {
        rejectUnauthorized: false
    }
})


module.exports = {
    client
}