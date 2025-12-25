import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) return new Response('Missing key', { status: 400 });

    try {
        const context = getRequestContext();

        if (!context || !context.env) {
            return new Response('Ambiente local detectado. R2 no está disponible.', { status: 500 });
        }

        const { env } = context;
        const bucket = env.PHOTOS_BUCKET as R2Bucket;

        const object = await bucket.get(key);

        if (!object) return new Response('Not found', { status: 404 });

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000');

        return new Response(object.body, { headers });
    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }
}
