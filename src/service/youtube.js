import axios from 'axios';

class Youtube {
  constructor(key) {
    this.youtube = axios.create({
      baseURL: 'https://youtube.googleapis.com/youtube/v3',
      params: { key: key },
      // crossDomain: true,
      // withCredentials: true,
    });
  }

  async search(submit) {
    const response = await this.youtube.get('search', {
      params: {
        part: 'snippet',
        maxResults: 9,
        q: `${submit ? submit : ''}`,
        type: 'channel',
      },
    });
    return response.data.items;
  }
  async bringVideo(channelId) {
    const response = await this.youtube.get('search', {
      params: {
        part: 'snippet',
        maxResults: 30,
        channelId: channelId,
        order: 'date',
      },
    });
    return response.data.items;
  }

  async description(id) {
    const response = await this.youtube.get('videos', {
      params: {
        part: 'snippet',
        id: id,
      },
    });
    return response.data;
  }
  async comments(id) {
    const response = await this.youtube.get('commentThreads', {
      params: {
        textFormat: 'plainText',
        part: 'snippet',
        order: 'relevance',
        videoId: id,
      },
    });
    return response.data.items;
  }
  async playListItems(id) {
    const response = await this.youtube.get('playlistItems', {
      params: {
        part: 'snippet',
        playlistId: id,
        maxResults: 30,
      },
    });
    return response.data.items;
  }
  async searchVideo(submit, pageToken) {
    const response = await this.youtube.get('search', {
      params: {
        part: 'snippet',
        maxResults: 9,
        q: submit,
        type: 'video',
        pageToken: pageToken && pageToken,
      },
    });
    return response.data;
  }
  async getVideoFromId(videoId) {
    const response = await this.youtube.get('videos', {
      params: {
        part: 'snippet',
        id: videoId,
      },
    });
    return response.data;
  }
}

export default Youtube;
