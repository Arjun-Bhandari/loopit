'use client'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video } from '@imagekit/next';
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { ObjectId } from 'mongoose';
import { Play } from 'lucide-react';
import React from 'react';
export default function ReelsExplorePage() {
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
    router.push(`/reels/${videoId.toString()}`);
  };

  // Fix status type checking
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error' && error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto px-[1px] py-[1px]">
        <div className="grid grid-cols-3 gap-[1px]">
          {data?.pages.map((group, i) => (
           <React.Fragment key={i}>
              {group.map((video) => (
                <div 
                  key={video._id?.toString()}
                  className="relative aspect-[9/16] group cursor-pointer bg-gray-900"
                  onClick={() => video._id && handleVideoClick(video._id?.toString())}
                >
                  <Video
                    urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                    src={video.videoUrl}
                    controls={false}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Infinite scroll trigger */}
        <div
          ref={ref}
          className="flex justify-center p-4"
        >
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"/>
          )}
        </div>
      </div>
    </div>
  );
}
