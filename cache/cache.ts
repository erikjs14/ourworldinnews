import { CountryNews } from "../types";
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const access = promisify(fs.access);

class Cache<T extends Object> {
    file: string;

    constructor(cacheFileName: string) {
        this.file = path.join(process.cwd(), cacheFileName); // do not reset file --> cache will be constructed multiple times
    }

    async put(key: string, val: T, ttl_ms: number | undefined = undefined): Promise<void> {
        let data: {[key: string]: T};
        try {
            data = JSON.parse(await read(this.file, { encoding: 'utf8' })); // use encoding to ensure string return type instead of buffer
        } catch (error) {
            // file does not exist
            data = {};
        }
        data[key] = {
            ...val,
            validUntil: ttl_ms ? new Date().getTime() + ttl_ms : undefined,
        };
        await write(
            this.file, 
            JSON.stringify(data), 
            { encoding: 'utf8' }
        );
        if (ttl_ms) this.scheduleTtl(key, ttl_ms);
    }

    async get(key: string): Promise<T|undefined> {
        try {
            const data = JSON.parse(await read(this.file, { encoding: 'utf8' }))[key];

            //check if valid
            if (data.validUntil) {
                if (new Date().getTime() >= data.validUntil) { // no need to write anything again
                    return undefined;
                }
            }

            const out = {...data};
            delete out.validUntil;
            return out;
        } catch (error) {
            return undefined;
        }
    }

    scheduleTtl(key: string, ttl: number) {
        const that = this;
        setTimeout(async () => {
            const data = JSON.parse(await read(that.file, { encoding: 'utf8' }));
            delete data[key];
            await write(that.file, JSON.stringify(data), { encoding: 'utf8' });
        }, ttl);
    }

}

export default new Cache<CountryNews>('build.cache');