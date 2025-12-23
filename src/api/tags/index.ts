import type { TagsData } from '@/types/tags'
import httpClient from '@/utils/request'

export enum TagsApi {
  GetTags = '/data/tags.json',
}

// Get all tags data
export const getTagsData = () => {
  return httpClient.get<TagsData>({
    url: TagsApi.GetTags,
  })
}
