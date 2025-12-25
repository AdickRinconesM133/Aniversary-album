interface CloudflareEnv {
    PHOTOS_BUCKET: R2Bucket;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends CloudflareEnv { }
    }
}

export { };
