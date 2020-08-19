// SPDX-License-Identifier: MIT
// Copyright © 2020 Xpl0itR

import { AES, enc } from "crypto-js";

const ENCRYPTION_MARKER:   string = "[-!_0_!-]";
const ENCRYPTION_PASSWORD: string = ":_.NaN0";

export class CrossCodeSave {
    public slots:    string[];
    public autoSlot: string;
    public globals:  string;
    public lastSlot: number;

    public constructor(saveString: string) {
        const saveJson: any = JSON.parse(saveString);

        this.slots    = [];
        this.lastSlot = saveJson.lastSlot;

        if (typeof saveJson.autoSlot === "string")
            this.autoSlot = saveJson.autoSlot;
        else
            this.autoSlot = JSON.stringify(saveJson.autoSlot);

        if (typeof saveJson.globals === "string")
            this.globals = saveJson.globals;
        else
            this.globals = JSON.stringify(saveJson.globals);

        for (let slot of saveJson.slots)
            if (typeof slot === "string")
                this.slots.push(slot);
            else
                this.slots.push(JSON.stringify(slot));
    }

    public Encrypt(): string {
        if (!this.autoSlot.startsWith(ENCRYPTION_MARKER))
            this.autoSlot = ENCRYPTION_MARKER + AES.encrypt(this.autoSlot, ENCRYPTION_PASSWORD).toString();

        if (!this.globals.startsWith(ENCRYPTION_MARKER))
            this.globals = ENCRYPTION_MARKER + AES.encrypt(this.globals, ENCRYPTION_PASSWORD).toString();

        for (let i = 0; i < this.slots.length; i++)
            if (!this.slots[i].startsWith(ENCRYPTION_MARKER))
                this.slots[i] = ENCRYPTION_MARKER + AES.encrypt(this.slots[i], ENCRYPTION_PASSWORD).toString();

        return JSON.stringify(this);
    }

    public Decrypt(): string {
        if (this.autoSlot.startsWith(ENCRYPTION_MARKER))
            this.autoSlot = AES.decrypt(this.autoSlot.substr(ENCRYPTION_MARKER.length), ENCRYPTION_PASSWORD).toString(enc.Utf8);

        if (this.globals.startsWith(ENCRYPTION_MARKER))
            this.globals = AES.decrypt(this.globals.substr(ENCRYPTION_MARKER.length), ENCRYPTION_PASSWORD).toString(enc.Utf8);

        for (let i = 0; i < this.slots.length; i++)
            if (this.slots[i].startsWith(ENCRYPTION_MARKER))
                this.slots[i] = AES.decrypt(this.slots[i].substr(ENCRYPTION_MARKER.length), ENCRYPTION_PASSWORD).toString(enc.Utf8);

        return JSON.stringify(this);
    }
}