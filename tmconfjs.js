#!/usr/bin/env node

'use strict'

const parser = require('./vendored/engines/parser')
const log = require('./vendored/util/log')
const fs = require('fs').promises

const help = `usage: node tmconfjs.js [--output|-o <output_file_path>] <file_path>
options:
--output, -o <file_path>: File to write JSON output to.

arguments:
<file_path>: Path to tmconf file to read.

Parses tmconf file or STDIN and writes JSON representation to STDOUT.
Logs like warnings and errors are printed to STDERR.
License: Apache-2.0, home: https://github.com/simonkowallik/tmconfjs
`

if (
  process.argv.includes('--help') ||
  process.argv.includes('-h') ||
  process.argv.includes('--version') ||
  process.argv.includes('-v')
) {
  console.log(help)
  process.exit(0)
}

function parse (data) {
  log.log('trace', `Handing data to parser:\n${data}`)
  return parser({ data })
}

async function parseFile (filePath) {
  log.debug(`Parsing from <file_path>: ${filePath}`)
  const data = await fs.readFile(filePath)
  return parse(data.toString())
}

async function readStdin () {
  let data = ''
  for await (const chunk of process.stdin) {
    data += chunk
    log.log('trace', `STDIN data received: ${chunk}`)
  }
  log.debug(`STDIN data read completed. Bytes read: ${data.length}`)
  return data
}

async function mainOld () {
  const filePath = process.argv[2]

  if (filePath) {
    // prefer <file_path> argument, it's more explicit
    const parsed = await parseFile(filePath)
    process.stdout.write(JSON.stringify(parsed, null, 4))
  } else if (!process.stdin.isTTY) {
    // use STDIN otherwise
    log.debug('Parsing from <STDIN>')
    const parsed = parse(await readStdin())
    process.stdout.write(JSON.stringify(parsed, null, 4))
  } else {
    // neither file_path nor STDIN
    console.error('Error: <file_path> argument or STDIN is required.')
    process.exit(1)
  }
}

async function writeFile (outputFile, data) {
  log.debug('Writing to <output_file>: ' + outputFile)
  await fs.writeFile(outputFile, data)
}

async function main () {
  let filePath = null
  let outputFile = null

  // parse arguments
  const args = process.argv.slice(2)
  let optionValueIsNext = false
  args.forEach(arg => {
    if (arg === '--output' || arg === '-o') {
      optionValueIsNext = true
    } else if (optionValueIsNext) {
      outputFile = arg
      optionValueIsNext = false
    } else if (filePath === null) {
      filePath = arg
    }
  })

  if (filePath) {
    // prefer <file_path> argument, it's more explicit
    const parsed = await parseFile(filePath)

    if (outputFile && outputFile != '-') {
      await writeFile(outputFile, JSON.stringify(parsed, null, 4))
    } else {
      process.stdout.write(JSON.stringify(parsed, null, 4))
    }
  } else if (!process.stdin.isTTY) {
    // use STDIN otherwise
    log.debug('Parsing from <STDIN>')

    const parsed = parse(await readStdin())

    if (outputFile && outputFile != '-') {
      await writeFile(outputFile, JSON.stringify(parsed, null, 4))
    } else {
      process.stdout.write(JSON.stringify(parsed, null, 4))
    }
  } else {
    // neither file_path nor STDIN
    console.error('Error: <file_path> argument or STDIN is required.')
    process.exit(1)
  }
}

if (require.main === module) {
  // only run if called directly - do not run if required as a module
  main()
}

process.stdout.on('error', (err) => {
  // ignore EPIPE errors (broken pipe), eg. when piping to `head`
  if (err.code === 'EPIPE') {
    process.exit(0)
  }
})

module.exports = { parse, parseFile }
