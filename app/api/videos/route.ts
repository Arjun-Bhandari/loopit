import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { Contrail_One } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";
export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    if (!videos || videos.length == 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Fail to fetch video" }, { status: 500 });
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