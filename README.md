# tmconfjs

**tmconfjs** provides a simple parser (`tmconfjs` command) to serialize a tmconf file (eg. `/config/bigip.conf`) to JSON. The produced JSON is printed to `STDOUT` or a specified file.

This project is a minimal wrapper and vendors the necessary code from the community project [F5 BIG-IP Automation Config Converter (BIG-IP ACC)](https://github.com/f5devcentral/f5-automation-config-converter/).

## Documentation by example

### Installation

```shell
npm install --global simonkowallik/tmconfjs
```

### Command line usage

When installed globally, `tmconfjs` can be invoked as a command:

```shell
tmconfjs example/test.tmconf 2>/dev/null \
    | jq '."ltm profile client-ssl clientssl-secure"'
```

```json
{
  "app-service": "none",
  "cert": "/Common/default.crt",
  "cert-key-chain": {
    "default": {
      "cert": "/Common/default.crt",
      "key": "/Common/default.key"
    }
  },
  "chain": "none",
  "ciphers": "ecdhe:rsa:!sslv3:!rc4:!exp:!des",
  "defaults-from": "/Common/clientssl",
  "inherit-certkeychain": "true",
  "key": "/Common/default.key",
  "options": [
    "no-ssl",
    "no-tlsv1.3"
  ],
  "passphrase": "none",
  "renegotiation": "disabled"
}
```

When this repo has been copied or cloned, invoke tmconfjs.js using node. An alternative is using npx, `npx tmconfjs` would work also.
Errors, warnings or any debug information is written to `STDERR`:

```shell
node ./tmconfjs.js example/test.tmconf \
    >/dev/null 2> example/test.tmconf.log

cat example/test.tmconf.log
```

```shell
2024-02-23T21:47:31.594Z WARN UNRECOGNIZED LINE: '     auto-check enabled'
2024-02-23T21:47:31.595Z WARN UNRECOGNIZED LINE: '     auto-phonehome enabled'
2024-02-23T21:47:31.602Z WARN UNRECOGNIZED LINE: '	time 500'
2024-02-23T21:47:31.602Z WARN UNRECOGNIZED LINE: '	enabled yes'
```

Input is also accepted from `STDIN`:

```shell
cat example/imap.tmconf | node tmconfjs.js
```

```json
{
    "ltm profile imap imap": {
        "activation-mode": "require"
    }
}
```

The `<file_path>` argument is preferred over `STDIN` however:

```shell
cat example/imap.tmconf | node tmconfjs.js example/pop3.tmconf
```

```json
{
    "ltm profile pop3 pop3": {
        "activation-mode": "require"
    }
}
```

The output can be written to a specified file using `--output` or `-o` when `STDOUT` is not desired:

```shell
node tmconfjs.js --output example/pop3.json example/pop3.tmconf
cat example/pop3.json
```

```json
{
    "ltm profile pop3 pop3": {
        "activation-mode": "require"
    }
}
```

More debug information is available and might help understand issues:

```shell
export LOG_LEVEL=debug
cat example/imap.tmconf | node tmconfjs.js example/pop3.tmconf 2> debug.log
```

```json
{
    "ltm profile pop3 pop3": {
        "activation-mode": "require"
    }
}
```

```shell
cat debug.log
```

```shell
2024-02-23T21:54:04.300Z DEBUG Parsing from <file_path>: example/pop3.tmconf
2024-02-23T21:54:04.302Z DEBUG Parsing data
```

### Container / Docker

Note the docker run options, `--rm` deletes the container right after it was executed and ended,
`-i` run the container interactively (required for STDIN to work). Also note the absence of the common `-t` option, which indicates a TTY/terminal - STDIN would fail when this is used.

```shell
cat example/imap.tmconf | docker run --rm -i simonkowallik/tmconfjs
```

```json
{
    "ltm profile imap imap": {
        "activation-mode": "require"
    }
}
```

Using volumes is another option:

```shell
docker run --rm -v $PWD/example:/data simonkowallik/tmconfjs \
    tmconfjs /data/pop3.tmconf -o /data/pop3.json

cat example/pop3.json
```

```json
{
    "ltm profile pop3 pop3": {
        "activation-mode": "require"
    }
}
```

### Use as module

A simple `demo.js` is available at [example/demo.js](./example/demo.js).

Just require either `parse` or `parseFile`. Both take a string as input, `parse` expects tmconf within the string while `parseFile` expects a path to a tmconf file.

```javascript
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
```

```shell
node example/demo.js
```

```json
{
    "ltm profile pop3 pop3": {
        "activation-mode": "require"
    }
}
```

## Disclaimer

Please read and understand the [LICENSE](./LICENSE) as well as the provided [SUPPORT.md](./SUPPORT.md).
