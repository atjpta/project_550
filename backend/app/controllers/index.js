const auth = require('./auth.controller');
const image = require('./Image.controller');
const user = require('./user.controller');
const tag = require('./tag.controller');
const post = require('./post.controller');
const comment = require('./comment.controller');
const team = require('./team.controller');
const series = require('./series.controller');
const status = require('./status.controller');
const vote = require('./vote.controller');
const question = require('./question.controller');
const topic = require('./topic.controller');
const answer = require('./answer.controller');
const member = require('./member.controller');
const role = require('./role.controller');
const follow = require('./follow.controller');
const notification = require('./notification.controller');
const report = require('./report.controller')
const typecourse = require('./typecourse.controller')
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
    question,
    topic,
    answer,
    member,
    role,
    follow,
    notification,
    report,
    typecourse,
}
