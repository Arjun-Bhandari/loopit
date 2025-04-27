import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
interface CommentRequest{
    text:string;
}

export async function POST(
    request:NextRequest,
    {params}:{params:{videoId:string}},
){
    try{
      const {videoId }= await  params;
        const session = await getServerSession(authOptions);
        if(!session?.user){
            return NextResponse.json({errror:"Please Login to Comment"},{status:401})
        };

        await connectToDatabase();

        if(!mongoose.Types.ObjectId.isValid(videoId)){
            return NextResponse.json({error:"Video Id is not valid"},{status:401})
        }
        const body:CommentRequest = await request.json();
        if(!body.text?.trim()){
            return NextResponse.json({error:"Comment text is Required"},{status:400})
        }
     const updatedVideo = await Video.findByIdAndUpdate(videoId,{
        $push:{
            comments:{
                text:body.text,
                user:session?.user.id,
                createdAt:new Date(),
            }
        }
     },
    {new:true}).populate("comments.user","username");
    console.log(updatedVideo)
if(!updatedVideo){
    return NextResponse.json({error:"Video Not found"},{status:404})
}
return NextResponse.json({comment:updatedVideo.comments[updatedVideo.comments.length-1]});
    }catch(error){
return NextResponse.json({error:"Failed to add comments"},{status:500})
    }
}


export async function GET(
    request: NextRequest,
    { params }: { params: { videoId: string } }
  ) {
    try {
  
      await connectToDatabase();
  
      // Get pagination parameters from URL
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const skip = (page - 1) * limit;
      const {videoId} = await params;
      // Validate videoId
      if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
      }
  
      // Find video and get paginated comments
      const video = await Video.findById(videoId)
        .select("comments")
        .populate("comments.user", "username")
        .slice("comments", [skip, limit]);
  
      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }
  
      return NextResponse.json({
        comments: video.comments,
        hasMore: video.comments.length === limit
      });
  
    } catch (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }
  }
  
  // DELETE comment
  export async function DELETE(
    request: NextRequest,
    { params }: { params: { videoId: string } }
  ) {
    try {
      const {videoId} = await params;
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      await connectToDatabase();
  
      const { searchParams } = new URL(request.url);
      const commentId = searchParams.get("commentId");
  
      if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
      }
  
      const video = await Video.findById(videoId);
      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }
  
      // Remove comment if user is comment author
      const updatedVideo = await Video.findOneAndUpdate(
        {
          _id: videoId,
          "comments._id": commentId,
          "comments.user": session.user.id
        },
        {
          $pull: { comments: { _id: commentId } }
        },
        { new: true }
      );
  
      if (!updatedVideo) {
        return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true });
  
    } catch (error) {
      console.error("Error deleting comment:", error);
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 }
      );
    }
  }