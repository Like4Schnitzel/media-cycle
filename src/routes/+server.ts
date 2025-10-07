import { existsSync, mkdirSync, readdirSync } from 'fs';
import { mediaDirRootPath, readFileWithMimeType } from '$lib';
import { join } from 'path';
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    if (!existsSync(mediaDirRootPath)) {
        mkdirSync(mediaDirRootPath)
    }

    const filePaths = readdirSync(mediaDirRootPath);
    const randomIndex = Math.round(Math.random() * filePaths.length-1);
    const randomFilePath = join(mediaDirRootPath, filePaths[randomIndex]);
    const fileAndType = await readFileWithMimeType(randomFilePath);
    if (fileAndType === null) {
        return new Response("Server tried to read directory as a file. Please refresh.", {
            status: 500,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }

    const { file, mimeType } = fileAndType;
    return new Response(file as BodyInit, {
        status: 200,
        headers: {
            "Content-Type": mimeType,
        },
    });
}
