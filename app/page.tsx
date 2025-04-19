
'use client'
import Image from "next/image";
import UploadExample from "./components/FileUpload";
import { IVideo } from "@/models/Video";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  useEffect(() => {
    const fetchVid = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.log("Error fetching videos", error);
      }
    };
    fetchVid();
  }, []);

  return (
    <div className="">
      {/* <h1>Loopit</h1> */}
      <UploadExample />
    </div>
  );
}
