// SPDX-License-Identifier: MIT
// Copyright © 2020 Xpl0itR

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { CrossCodeSave }                                      from "./CrossCodeSave";
import Getopt                                                 from "node-getopt";
import path                                                   from "path";

const getopt: Getopt = Getopt.create([
    [ "h", "help",     "Display this help message."              ],
    [ "e", "encrypt",  "Encrypt CrossCode save."                 ],
    [ "d", "decrypt",  "Decrypt CrossCode save. (Default)"       ],
    [ "o", "out=PATH", "The output path. "         +
                       "(File for a single save, " +
                       "Directory for multiple saves)"           ]
]).setHelp(
    "Usage: node CrossSave.js [options] <\path(s)>\n" +
    "Options:\n"                                      +
    "[[OPTIONS]]\n"                                   +
    "\n"                                              +
    "Repository: https://github.com/Xpl0itR/CrossSave"
);

const opts:    any      = getopt.parseSystem();
const inPaths: string[] = opts.argv;
let   encrypt: boolean  = false;
let   outPath: string   = "";

console.log("CrossSave - Copyright © 2020 Xpl0itR\n");

if (opts.options["help"]) {
    getopt.showHelp();
    process.exit(0);
}

if (opts.options["encrypt"] && opts.options["decrypt"])
    ThrowError("Can't encrypt and decrypt at the same time!");

if (inPaths.length < 1)
    ThrowError("You must specify an input file!");

if (opts.options["encrypt"]) encrypt = true;
if (opts.options["decrypt"]) encrypt = false;
if (opts.options["out"])     outPath = opts.options["out"] as string;

for (let i = 0; i < inPaths.length; i++) {
    try {
        console.log(`Attempting to ${encrypt ? "encrypt" : "decrypt"} save file (${i+1}/${inPaths.length}): ${inPaths[i]}`);

        let saveString: string = readFileSync(inPaths[i], { encoding: "utf8" });

        const crossCodeSave: CrossCodeSave = new CrossCodeSave(saveString);
        saveString = encrypt ? crossCodeSave.Encrypt() : crossCodeSave.Decrypt();

        let filePath: string;

        if (outPath && inPaths.length === 1) {
            if (!existsSync(path.dirname(outPath))) mkdirSync(path.dirname(outPath));
            filePath = outPath;
        }
        else if (outPath && inPaths.length > 1) {
            if (!existsSync(outPath)) mkdirSync(outPath);
            filePath = path.join(outPath, path.basename(inPaths[i]));
        }
        else
            filePath = `${inPaths[i]}.${encrypt ? "encrypted" : "decrypted"}`;

        writeFileSync(filePath, saveString, { encoding: "utf8" });
    }
    catch (error) {
        console.error(error.message);
    }
}

console.log("\nDone!");

function ThrowError(message: string): void {
    console.error(`${message}\nSee --help for more info.`);
    process.exit(1);
}