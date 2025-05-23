import mongoose, { Schema, model, models } from "mongoose";
import Users from "./Users";
export const VIDEO_DIMENTIONS = {
  width: 1080,
  height: 1920,
} as const;
export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  owner?:mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  likes?: mongoose.Types.ObjectId[];
  comments?:{
    _id:string|mongoose.Types.ObjectId;
    text:string;
    user:{
      _id:string |mongoose.Types.ObjectId;
      username:string;
    }
  }[];
  updatedAt?: Date;
  createdAt?: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    owner:{type:Schema.Types.ObjectId, ref:Users},
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENTIONS.height },
      width: { type: Number, default: VIDEO_DIMENTIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: Users,
      default: [],
    }],
    comments: [{
      text: {
        type: String,
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: Users,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);


const Video = models?.Video || model<IVideo>("Video",videoSchema);

export default Video;
