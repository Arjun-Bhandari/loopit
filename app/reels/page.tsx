'use client'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video } from '@imagekit/next';
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { ObjectId } from 'mongoose';

export default function Home() {
  const router = useRouter();
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<IVideo[], Error>({
    queryKey: ['videos'],
    queryFn: async ({ pageParam }) => {
      // Ensure pageParam is a number
      const page = typeof pageParam === 'number' ? pageParam : 1;
      const response = await apiClient.getVideos(page);
      return response;
    },
    getNextPageParam: (lastPage: IVideo[], allPages: IVideo[][]) => {
      return lastPage.length === 12 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  // Handle ObjectId type safely
  const handleVideoClick = (videoId: ObjectId | string) => {
    router.push(`/video/${videoId.toString()}`);
  };

  // Fix status type checking
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error' && error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Reels</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.pages.map((group, i) => (
<div key={i}>
            {group.map((video) => (
              <div 
                key={video._id?.toString()} // Safe ObjectId handling
                className="relative aspect-[9/16] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                onClick={() => video._id && handleVideoClick(video._id?.toString())}
              >
                <Video
                  urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                  src={video.videoUrl}
                  controls={false}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-white font-medium truncate">{video.title}</h3>
                    <p className="text-gray-200 text-sm truncate">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}
       </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div
        ref={ref}
        className="flex justify-center p-4"
      >
        {isFetchingNextPage && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/>
        )}
      </div>
    </div>
  );
}
