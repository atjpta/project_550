const user = require("./user.models")
const roleM = require("./role.models")
const image = require('./image.models')
const statusM = require('./status.models')
const post = require('./post.models')
const series = require('./series.models')
const member = require('./member.models')
const team = require('./team.models')
const answer = require('./answer.models')
const notification = require('./notification.models')
const quenstion = require('./question.model')
const topic = require('./topic.models')
const comment = require('./comment.models')
const notificationtypeM = require('./notificationtype.models')
const report = require('./report.models')
const vote = require('./vote.model')
const tag = require('./tag.models')
function innitDB (){
    roleM.initRole()
    statusM.initStatus()
    notificationtypeM.initNotificationtype()
}

const role = roleM.Role
const status = statusM.status 
const notificationtype = notificationtypeM.notificationtype


module.exports = {
    user,
    role,
    image,
    status,
    post,
    series,
    member,
    team,
    answer,
    notification,
    quenstion,
    topic,
    comment,
    notificationtype,
    report,
    vote,
    tag,
    innitDB,
}