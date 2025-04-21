'use client'

import { useQuery } from '@tanstack/react-query';
import { Video } from '@imagekit/next';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { IVideo } from '@/models/Video';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface PageParams {
  params: {
    id: string;
  };
}

// Separate the video content into its own component
function VideoContent({ id }: { id: string }) {
  const { data: video, isLoading, error } = useQuery<IVideo>({
    queryKey: ['video', id],
    queryFn: () => apiClient.getAVideo(id),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    throwOnError: true
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"/>
      </div>
    );
  }

  if (error || !video) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-primary hover:opacity-80 mb-6">
        <ArrowLeft className="mr-2" /> Back to reels
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-[9/16] rounded-lg overflow-hidden bg-base-200">
          <Video
            urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
            src={video.videoUrl}
            controls={true}
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{video.title}</h1>
          {/* <p className="text-gray-400">
            Posted by {video.owner && 'email' in video.owner ? video.owner.email : 'Anonymous'}
          </p> */}
          <p className="text-lg">{video.description}</p>
          
          <div className="pt-4 border-t border-base-300">
            <p className="text-sm text-gray-400">
              {video.createdAt && (
                <>Posted on {new Date(video.createdAt).toLocaleDateString()}</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component that handles params
export default function VideoDetailPage({ params }: PageParams) {
  const id = params.id;

  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"/>
        </div>
      }
    >
      <VideoContent id={id} />
    </Suspense>
  );
}