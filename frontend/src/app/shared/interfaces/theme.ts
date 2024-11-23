import {Article} from "./article.interface";

export interface Theme {
    id: number;
    titre: string;
    description: string;
    articles: Article[];
    abonnes: number[]
}
