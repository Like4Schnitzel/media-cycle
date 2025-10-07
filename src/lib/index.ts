import { fileTypeFromFile } from 'file-type';
import { createReadStream, lstatSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import mime from 'mime';

export const mediaDirRootPath = join(import.meta.dirname, '..', '..', 'media');

export async function readFileWithMimeType(path: string) {
    if (lstatSync(path).isDirectory()) {
        return null;
    }

    const mimeTypeReader = fileTypeFromFile(path);
    const fileReader = createReadStream(path);
    let mimeType = (await mimeTypeReader)?.mime;
    // file extension fallback
    if (!mimeType) {
        mimeType = mime.getType(path) || "application/octet-stream";
    }
    return {
        file: Readable.toWeb(fileReader),
        mimeType,
    };
}
