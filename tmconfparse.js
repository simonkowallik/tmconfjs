#!/usr/bin/env node

"use strict";

const parser = require("./vendored/engines/parser");
const readFiles = require("./vendored/preConverter/readFiles");

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: node tmconfparse.js <file_path>");
  console.log("Reads a tmconf file and prints JSON conversion to STDOUT.");
  console.log("<file_path>: Path to the tmconf file to read.");
  process.exit(0);
}
if (process.argv.length < 3) {
  console.error("Error: A file path argument is required.");
  process.exit(1);
}

async function parse(filePath) {
    const data = await readFiles([filePath]);
    const parsed = parser(data);
    return parsed;
    
}

const filePath = process.argv[2];

(async (filePath) => {
    const parsed = await parse(filePath);
    console.log(JSON.stringify(parsed, null, 4));
})(filePath);

module.exports = parse;
