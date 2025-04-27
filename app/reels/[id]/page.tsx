'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Video } from '@imagekit/next';
import { apiClient } from '@/lib/api-client';
import { Heart, MessageCircle, Share2, Info, Play } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IVideo } from '@/models/Video';
import { cn } from '@/lib/utils';

export default function ReelsViewer() {
  const params = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>(params.id as string);

  // Fetch current video and related videos
  const { data: videos } = useInfiniteQuery<IVideo[]>({
    queryKey: ['videos'],
    queryFn: ({ pageParam = 1 }) => apiClient.getVideos(pageParam),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length === 12 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  // Flatten videos array
  const allVideos = videos?.pages.flat() ?? [];
  const currentIndex = allVideos.findIndex(v => v._id?.toString() === activeVideoId);

  // Handle video playback
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Cleanup and pause video when navigating away
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle vertical scroll
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && currentIndex < allVideos.length - 1) {
        // Scroll down - next video
        const nextVideo = allVideos[currentIndex + 1];
        setActiveVideoId(nextVideo._id!.toString());
        router.push(`/reels/${nextVideo._id}`, { scroll: false });
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up - previous video
        const prevVideo = allVideos[currentIndex - 1];
        setActiveVideoId(prevVideo._id!.toString());
        router.push(`/reels/${prevVideo._id}`, { scroll: false });
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentIndex, allVideos, router]);

  const currentVideo = allVideos[currentIndex];

  if (!currentVideo) return null;

  const handleLike = async () => {
    try {
      await apiClient.toggleLike(activeVideoId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    // Implement comment modal/drawer logic
    console.log('Show comment section');
  };

  return (
    <div className="fixed inset-0 bg-black w-screen h-screen">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full max-w-[calc(100vh*9/16)] mx-auto">
          {/* Video with click handler and ref */}
          <div 
            className="relative w-full h-full cursor-pointer" 
            onClick={togglePlayPause}
          >
            <Video
              ref={videoRef}
              urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
              src={currentVideo.videoUrl}
              controls={false}
              autoPlay
              loop
              className="w-full h-full object-cover"
            />

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="w-16 h-16 text-white/80" />
              </div>
            )}
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

          {/* Right Side Actions - Adjusted positioning */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-8">
            <button 
              onClick={handleLike}
              className="p-2 text-white hover:scale-110 transition-transform"
            >
              <Heart className="w-8 h-8" />
              <p>{currentVideo?.likes?.length || 0}</p>
            </button>
            
            <button 
              onClick={handleComment}
              className="p-2 text-white hover:scale-110 transition-transform"
            >
              <MessageCircle className="w-8 h-8" />
            </button>
            
            <button className="p-2 text-white hover:scale-110 transition-transform">
              <Share2 className="w-8 h-8" />
            </button>
            
            <button 
              onClick={() => setShowDescription(!showDescription)}
              className="p-2 text-white hover:scale-110 transition-transform"
            >
              <Info className="w-8 h-8" />
            </button>
          </div>

          {/* Bottom Info - Adjusted positioning */}
          <div className="absolute bottom-8 left-4 right-20 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-600" /> {/* Avatar placeholder */}
              <h3 className="text-lg font-semibold">
                {currentVideo.owner?.username || 'Anonymous'}
              </h3>
            </div>
            
            <div className={cn(
              "transition-all duration-300 overflow-hidden mt-2",
              showDescription ? "max-h-24" : "max-h-0"
            )}>
              <p className="text-sm leading-normal">{currentVideo.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}