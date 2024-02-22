# tmconfjs

**tmconfjs** provides a simple parser (`tmconfparse` command) to serialize a tmconf file (eg. `/config/bigip.conf`) to JSON. The produced JSON is printed to `STDOUT`.

This project is (supposed to be) a minimal wrapper and vendors the necessary code from the community project [F5 BIG-IP Automation Config Converter (BIG-IP ACC)](https://github.com/f5devcentral/f5-automation-config-converter/).

## Usage example

```shell
$ npm install -g https://github.com/simonkowallik/tmconfjs
```

```shell
$ tmconfparse example/test.tmconf 2>/dev/null | jq '."ltm profile client-ssl clientssl-secure"'
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

Any errors or info is written to `STDERR`.

```shell
# run node and tmconfparse.js as first argument followed by tmconfparse arguments.
$ node ./tmconfparse.js example/test.tmconf >/dev/null
Debugger attached.
2024-02-17 00:29:17 WARN UNRECOGNIZED LINE: '     auto-check enabled'
2024-02-17 00:29:17 WARN UNRECOGNIZED LINE: '     auto-phonehome enabled'
2024-02-17 00:29:17 WARN UNRECOGNIZED LINE: '   time 500'
2024-02-17 00:29:17 WARN UNRECOGNIZED LINE: '   enabled yes'
```

## Disclaimer

Please read and understand the LICENSE as well as the provided SUPPORT.md.
