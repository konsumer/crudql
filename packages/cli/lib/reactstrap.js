const { getTemplate } = require('./utils')

const template = getTemplate(`${__dirname}/templates/reactstrap.mustache`)

module.exports = (type, file) => template(type)
