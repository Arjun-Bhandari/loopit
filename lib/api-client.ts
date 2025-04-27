import { IVideo } from "@/models/Video";
export type videoFromData = Omit<IVideo, "_id">;
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const res = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }

  // async getVideos() {
  //   return this.fetch<IVideo[]>("/videos");
  // }

  async getVideos(page = 1, limit = 12): Promise<IVideo[]> {
    return this.fetch<IVideo[]>(`/videos?page=${page}&limit=${limit}`);
  }

  // async getAVideo(id: string) {
  //   return this.fetch<IVideo>(`/videos/${id}`);
  // }
  async getAVideo(id: string): Promise<IVideo> {
    return this.fetch<IVideo>(`/videos?id=${id}`);
  }

  async  getUserVideos(userId: string): Promise<IVideo[]> {
    try {
      return this.fetch(`/videos?userId=${userId}`);
   
    } catch (error) {
      throw new Error('Failed to fetch user videos');
    }
  }
  async deleteVideo(id: string): Promise<void> {
    return this.fetch<void>(`/videos?id=${id}`, { 
      method: "DELETE", 
      
    });
  }

  async createVideo(VideoData: videoFromData) {
    return this.fetch("/videos", {
      method: "POST",
      body: VideoData,
    });
  }
async toggleLike(videoId:string){
  return this.fetch(`/videos/${videoId}/like`,{
    method:"POST"
  })
}
  async createComment(videoId:string,text:string){
    return this.fetch(`/videos/${videoId}/comment`,{
      method:"POST",
      body:text,
    })
  }
async getComment(videoId:string,page=1){
  return this.fetch(`/videos/${videoId}/comment?page${page}`,{
    method:"GET"
  })

}
  async deleteComment(videoId:string){
    return this.fetch(`/videos/${videoId}/comment`,{
      method:"DELETE",
    })
  }
}

export const apiClient = new ApiClient();
