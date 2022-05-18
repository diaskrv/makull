const crypto = require("crypto")

const hashPass = (plainText) => {
    return crypto.createHmac('sha256', 'secret key')
        .update(plainText)
        .digest('hex')
}
module.exports = { hashPass }