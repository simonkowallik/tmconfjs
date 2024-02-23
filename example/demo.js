// demo.js
'use strict'

// use parse function from tmconfjs.js
const parse = require('../tmconfjs.js').parse

const tmconf = `
ltm profile pop3 pop3 {
    activation-mode require
}`

// supply string with tmconf to parse function
const tmconfAsJSON = parse(tmconf)

console.log(JSON.stringify(tmconfAsJSON, null, 4))
