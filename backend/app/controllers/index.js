const auth = require('./auth.controller')
const image = require('./Image.controller')
const user = require('./user.controller')
const tag = require('./tag.controller')
const post = require('./post.controller')
const comment = require('./comment.controller')
module.exports = {
    auth,
    image,
    user,
    tag,
    post,
    comment,
}
