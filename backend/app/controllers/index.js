const auth = require('./auth.controller')
const image = require('./Image.controller')
const user = require('./user.controller')
const tag = require('./tag.controller')
const post = require('./post.controller')
const comment = require('./comment.controller')
const team = require('./team.controller')
const series = require('./series.controller')
const status = require('./status.controller')
const vote = require('./vote.controller')
module.exports = {
    auth,
    image,
    user,
    tag,
    post,
    comment,
    team,
    series,
    status,
    vote,
}
