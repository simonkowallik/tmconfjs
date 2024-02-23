'use strict'

const levels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warn: 4,
  warning: 4,
  notice: 5,
  info: 6,
  verbose: 7,
  debug: 8,
  trace: 9,
  silly: 10
}

const currentLevel = levels[process.env.LOG_LEVEL] || levels.info

const loggerFactory = (level, message) => {
  if (currentLevel >= levels[level]) {
    process.stderr.write(
      `${new Date().toISOString()} ${level.toUpperCase()} ${message}` + '\n',
      'utf-8'
    )
  }
}

const logger = {
  info: (message) => loggerFactory('info', message),
  warn: (message) => loggerFactory('warn', message),
  error: (message) => loggerFactory('error', message),
  debug: (message) => loggerFactory('debug', message),
  log: (level, message) => loggerFactory(level, message)
}

module.exports = logger
