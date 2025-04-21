import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { Delete } from "lucide-react";
import { getServerSession } from "next-auth";
import { Contrail_One } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "12");
//     const skip = (page - 1) * limit;

//     await connectToDatabase();

//     const videos = await Video.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate('owner', 'email');

//     return NextResponse.json(videos);
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch videos" },
//       { status: 500 }
//     );
//   }
// }
// export async function GET(request: Request) {
//   try {
//     await connectToDatabase();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     // If ID is provided, return single video
//     if (id) {
//       const video = await Video.findById(id).populate('owner', 'email');
//       if (!video) {
//         return NextResponse.json(
//           { error: "Video not found" },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(video);
//     }

//     // Otherwise, return paginated list
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "12");
//     const skip = (page - 1) * limit;

//     const videos = await Video.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate('owner', 'email');

//     return NextResponse.json(videos);
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch videos" },
//       { status: 500 }
//     );
//   }
// }
// ...existing code...

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    // If ID is provided, return single video
    if (id) {
      const video = await Video.findById(id).populate('owner', 'email');
      if (!video) {
        return NextResponse.json(
          { error: "Video not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(video);
    }

    // If userId is provided, return user's videos
    if (userId) {
      const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .populate('owner', 'email');
      return NextResponse.json(videos);
    }

    // Otherwise return all videos
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('owner', 'email');

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request:NextRequest){
    try{
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({error:"Unauthorized"},{status:401})

        }
        await connectToDatabase()
        const body:IVideo = await request.json();
        if(!body.title || !body.description || !body.thumbnailUrl || !body.videoUrl){
return NextResponse.json({error:"Missing Required Field"},{status:401})
        }

const videoData = {
    ...body,
    owner:session.user.id,
    controls:body.controls ?? true,
    transformation:{
        width: 1920,
        height: 1080,
        quality:body.transformation?.quality || 100
    }
}
const newVideo = await Video.create(videoData);

return NextResponse.json(newVideo)
    }catch(error){
        return NextResponse.json({ error: "Fail to Create a Video" }, { status: 500 });
    }
}

export async function DELETE(request:NextRequest){
  try { 
    const {searchParams} = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
    
    }
   const deletedVid =  await Video.deleteOne({_id:id})
   return NextResponse.json(deletedVid)
}catch(error){
return NextResponse.json({message:"Something went worng while Deleting Video"},{status:500})
  }
}