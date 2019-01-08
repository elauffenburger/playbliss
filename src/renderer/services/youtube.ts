import { youtube_v3 } from "googleapis";

export interface SearchVideosArgs {
  search: string;
  maxResults: number;
}

export interface YouTubeService {
  getVideoByUrl(url: string): Promise<youtube_v3.Schema$Video>;
  getVideos(
    args: youtube_v3.Params$Resource$Videos$List
  ): Promise<youtube_v3.Schema$VideoListResponse>;
  searchVideos(
    args: SearchVideosArgs
  ): Promise<youtube_v3.Schema$SearchListResponse>;
}

export class DefaultYouTubeService implements YouTubeService {
  constructor(private client: youtube_v3.Youtube) {}

  async getVideoByUrl(url: string): Promise<youtube_v3.Schema$Video> {
    const id = this.getIdFromUrl(url);
    if (!id) {
      // TODO: what do?
      throw `Failed to get id from url '${url}'`;
    }

    const response = await this.client.videos.list({
      id: id,
      part: "snippet,contentDetails"
    });

    const videos = response.data && response.data.items;
    if (!videos || !videos.length) {
      // TODO: what do?
      throw new Error(`No video found with id '${id}'`);
    }

    return videos[0];
  }

  async getVideos(args: youtube_v3.Params$Resource$Search$List) {
    args.part = args.part || "snippet,contentDetails";

    const response = await this.client.videos.list(args);

    return response.data;
  }

  async searchVideos(
    args: SearchVideosArgs
  ): Promise<youtube_v3.Schema$SearchListResponse> {
    const response = await this.client.search.list({
      q: args.search,
      part: "snippet",
      maxResults: args.maxResults
    });

    return response.data;
  }

  private getIdFromUrl(url: string): string | null {
    const uri = new URL(url);
    return uri && uri.searchParams.get("v");
  }
}
