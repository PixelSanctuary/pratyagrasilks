export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image placeholder — brand-colored shimmer */}
            <div className="aspect-[3/4] relative overflow-hidden bg-primary">
                <div className="absolute inset-0 skeleton-shimmer opacity-40" />
            </div>

            {/* Text lines */}
            <div className="p-4 space-y-3">
                {/* Category badge placeholder */}
                <div className="h-4 w-1/3 bg-primary-200 rounded-full animate-pulse" />
                {/* Product name — two lines */}
                <div className="space-y-1.5">
                    <div className="h-4 w-full bg-primary-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-primary-200 rounded animate-pulse" />
                </div>
                {/* Region origin line */}
                <div className="h-3 w-1/2 bg-primary-100 rounded animate-pulse" />
                {/* Price */}
                <div className="h-5 w-2/5 bg-primary-200 rounded animate-pulse" />
            </div>
        </div>
    );
}
