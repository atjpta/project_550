const tag = require('./tag.routes');
const auth = require('./auth.routes');
const image = require('./image.routes');
const user = require('./user.routes')
const post = require('./post.routes')
const comment = require('./comment.routes')
const team = require('./team.routes')
const series = require('./series.routes')
const status = require('./status.routes')
exports.Start = (app) => {
    auth(app)
    image(app)
    user(app)
    tag(app)
    post(app)
    comment(app)
    team(app)
    series(app)
    status(app)
}
