import {I_Comment} from "./comment.interface";

export interface Article {
  id: number;
  theme: string;
  titre: string;
  auteur: string;
  date: Date;
  contenu: string;
  commentaires: I_Comment[];
}

