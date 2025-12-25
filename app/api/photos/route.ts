import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Definimos la interfaz localmente para asegurar que el build pase
interface CloudflareEnv {
    PHOTOS_BUCKET: any; // Usamos any para evitar conflictos con tipos globales de R2
}

export async function GET(request: NextRequest) {
    try {
        // Obtenemos el contexto de Cloudflare
        const context = getRequestContext();

        if (!context || !context.env) {
            return NextResponse.json({
                error: 'Ambiente local detectado. Las funciones de R2 solo funcionan desplegadas en Cloudflare o usando wrangler.',
                isLocal: true
            }, { status: 500 });
        }

        const { env } = context as unknown as { env: CloudflareEnv };
        const bucket = env.PHOTOS_BUCKET;

        if (!bucket) {
            return NextResponse.json({ error: 'R2 Bucket not bound' }, { status: 500 });
        }

        // Listamos todos los objetos en el bucket
        const listing = await bucket.list();

        // Transformamos los objetos en una estructura útil para el frontend
        // Esperamos estructura: YYYY/MM_nombre/foto.jpg
        const photos = listing.objects.map((obj: any) => {
            const parts = obj.key.split('/');

            // Si la estructura no es la esperada, devolvemos algo básico
            if (parts.length < 3) return null;

            const year = parts[0];
            const monthName = parts[1].toLowerCase();
            const filename = parts[2];

            // Si el nombre del archivo está vacío, es un marcador de posición de carpeta
            if (!filename) return null;

            const monthMapping: { [key: string]: number } = {
                'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
                'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
            };

            const monthNumber = monthMapping[monthName] || 99; // 99 para meses desconocidos

            const isVideo = filename.toLowerCase().match(/\.(mp4|mov|webm)$/);

            return {
                key: obj.key,
                year,
                monthNumber,
                monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                url: `/api/photos/view?key=${encodeURIComponent(obj.key)}`,
                filename,
                type: isVideo ? 'video' : 'image'
            };
        }).filter((p: any) => p !== null);

        return NextResponse.json({ photos });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
