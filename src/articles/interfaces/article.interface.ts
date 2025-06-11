import type { IProfile } from '@/profiles/interfaces';

export type IArticle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  tagList: string[];
  body: string;
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  // TODO: This is a hack. Just define the proper type in the profiles module and use it.
  author: Omit<
    IProfile,
    'followers' | 'id' | 'email' | 'password' | 'createdAt' | 'updatedAt'
  > & {
    following: boolean;
  };
};
