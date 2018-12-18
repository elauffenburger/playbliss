import { youtube_v3 } from "googleapis";

export interface YouTubeService {
  getVideoByUrl(url: string): Promise<youtube_v3.Schema$Video>;
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
      part: "snippet"
    });

    const videos = response.data && response.data.items;
    if (!videos || !videos.length) {
      // TODO: what do?
      throw new Error(`No video found with id '${id}'`);
    }

    return videos[0];
  }

  private getIdFromUrl(url: string): string | null {
    const uri = new URL(url);
    return uri && uri.searchParams.get("v");
  }
}
