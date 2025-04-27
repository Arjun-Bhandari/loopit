import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/Video";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import {authOptions} from "@/lib/auth"
import mongoose from "mongoose";
import { LucideKeySquare } from "lucide-react";

export async function POST(
    request:NextRequest,
    {params}:{params:{videoId:string}}
){
try{
const session = await getServerSession(authOptions);
if(!session?.user){
    return NextResponse.json({error:"Please SignUp To Like"},{status:401})
}

await connectToDatabase();


if(!mongoose.Types.ObjectId.isValid(params.videoId)){
    NextResponse.json({error:"Invalid video Id"},{status:400})
}
const video = await Video.findById(params.videoId);
if(!video){
    NextResponse.json({error:"No Video Found"},{status:404})
}


const userId = session?.user.id;
const userLikedIndex  = video.likes?.findIndex((id:string)=>id.toString() === userId)

if(userLikedIndex === -1){
    await Video.findByIdAndUpdate(params.videoId,{
        $addToSet:{likes:userId},
    });
return NextResponse.json({liked:true});
}else{
    await Video.findByIdAndUpdate(params.videoId,{
        $pull:{likes:userId},
    });
return NextResponse.json({liked:false})
}

}catch(error){
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
}
}