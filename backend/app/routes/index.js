const auth = require('./auth.routes');
const image = require('./image.routes');

exports.Start = (app) => {
    auth(app)
    image(app)
}
