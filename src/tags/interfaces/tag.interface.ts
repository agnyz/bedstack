export type ITag = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IArticleTag = {
  articleId: number;
  tagName: string;
  createdAt: Date;
  updatedAt: Date;
};
