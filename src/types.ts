export interface Channel {
  id: string;
  channel_number: number;
  channel_name: string;
  genre: string;
  language: string;
}

export interface ChannelGroup {
  language: string;
  genre: string;
  channels: Channel[];
  count: number;
}

export interface PaginatedResponse {
  success: boolean;
  data: Channel[] | Record<string, Channel[]>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta: {
    platform: string;
    version: string;
    lastUpdated: string;
  };
}
