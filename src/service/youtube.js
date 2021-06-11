import axios from 'axios';

class Youtube {
  constructor(key) {
    this.youtube = axios.create({
      baseURL: 'https://youtube.googleapis.com/youtube/v3',
      params: { key: key },
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
        maxResults: 36,
        channelId: channelId,
        order: 'date',
      },
    });
    return response.data.items;
  }
  async mostPopular() {
    const response = await this.youtube.get('videos', {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 20,
      },
    });
    return response.data;
  }
  async description(id) {
    const response = await this.youtube.get('videos', {
      params: {
        part: 'snippet',
        id: id,
      },
    });
    return response.data.items[0].snippet;
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

  list() {}
}

export default Youtube;
