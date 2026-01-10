'use client';

import { getYouTubeEmbedUrl } from '@/lib/utils/youtube';

interface YouTubeEmbedProps {
    url: string;
    title?: string;
}

export default function YouTubeEmbed({ url, title = 'Product Video' }: YouTubeEmbedProps) {
    const embedUrl = getYouTubeEmbedUrl(url);

    if (!embedUrl) return null;

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
                src={embedUrl}
                title={title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
