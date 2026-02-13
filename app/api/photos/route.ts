import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import type { PhotoMeta, ApiPhotosResponse } from '@/lib/types';

export const runtime = 'edge';

const MONTH_MAPPING: Record<string, number> = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
};

export async function GET(request: NextRequest) {
    try {
        const context = getRequestContext();

        if (!context || !context.env) {
            return NextResponse.json({
                error: 'Ambiente local detectado. Las funciones de R2 solo funcionan desplegadas en Cloudflare o usando wrangler.',
                isLocal: true,
                photos: []
            } satisfies ApiPhotosResponse, { status: 500 });
        }

        const { env } = context as unknown as { env: CloudflareEnv };
        const bucket = env.PHOTOS_BUCKET;

        if (!bucket) {
            return NextResponse.json({ error: 'R2 Bucket not bound', photos: [] } satisfies ApiPhotosResponse, { status: 500 });
        }

        const listing = await bucket.list();

        const photos: PhotoMeta[] = listing.objects
            .map((obj) => {
                const parts = obj.key.split('/');

                if (parts.length < 3) return null;

                const year = parts[0];
                const monthName = parts[1].toLowerCase();
                const filename = parts[2];

                if (!filename) return null;

                const monthNumber = MONTH_MAPPING[monthName] || 99;

                const isVideo = /\.(mp4|mov|webm)$/i.test(filename);
                const isLogo = monthName === 'logo';

                return {
                    key: obj.key,
                    year,
                    monthNumber,
                    monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                    url: `/api/photos/view?key=${encodeURIComponent(obj.key)}`,
                    filename,
                    type: isLogo ? 'logo' as const : (isVideo ? 'video' as const : 'image' as const)
                };
            })
            .filter((p): p is PhotoMeta => p !== null);

        return NextResponse.json({ photos } satisfies ApiPhotosResponse);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message, photos: [] } satisfies ApiPhotosResponse, { status: 500 });
    }
}
