'use client'

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Video } from '@imagekit/next';
import { IVideo } from '@/models/Video';
import { apiClient } from '@/lib/api-client';
import { Settings, Grid, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session } = useSession();

  const { data: videos, isLoading } = useQuery<IVideo[]>({
    queryKey: ['userVideos', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      return apiClient.getUserVideos(session.user.id);
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Link href="/login" className="btn btn-primary">
          Please Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="relative w-32 h-32">
          <Image
            src={session.user?.image || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{session.user?.email}</h1>
            <Link href="/settings" className="btn btn-ghost btn-sm">
              <Settings size={20} />
              Edit Profile
            </Link>
          </div>

          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <div className="font-semibold">{videos?.length || 0}</div>
              <div className="text-gray-500">posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos?.map((video,index) => (
            video?.owner?._id.toString() === session.user?.id && (
              <Link 
                href={`/video/${video._id}`} 
                key={index}
                className="aspect-[9/16] relative group rounded-lg overflow-hidden"
              >
                <Video
                  urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                  src={video.videoUrl}
                  controls={false}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-4 w-full">
                    <h3 className="text-white font-medium truncate">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      )}

      {videos?.length === 0 && (
        <div className="text-center py-12">
          <Grid size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No Posts Yet</h2>
          <p className="text-gray-500">Start sharing your videos!</p>
          <Link href="/create" className="btn btn-primary mt-4">
            Create Your First Post
          </Link>
        </div>
      )}
    </div>
  );
}