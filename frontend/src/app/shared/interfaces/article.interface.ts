import {I_Comment} from "./comment.interface";

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  theme: string;
  comments: I_Comment[];
}

