# original source

https://github.com/f5devcentral/f5-automation-config-converter/tree/v1.24.0

# license

See ./LICENSE

# modifications

Removed any unnecessary code.

## ./engines/parser.js

Line 280, removed reference to original repo.
```
        e.message = `Error parsing input file. Error:\n${e.message}`;
```

## ./util/log.js

Line 43, instruct winston to always log to STDERR.

```
            stderrLevels: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'], // All log levels will be written to stderr
```