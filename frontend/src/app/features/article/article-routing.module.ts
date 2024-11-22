import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArticleComponent} from "./components/article/article.component";
import {ArticleDetailComponent} from "./components/article-detail/article-detail.component";
import {CreerArticleComponent} from "./components/creer-article/creer-article.component";

const routes: Routes = [
  { title: 'Articles', path: '', component: ArticleComponent },
  { title: 'Articles-Detail', path: 'detail/:id', component: ArticleDetailComponent },
  { title: 'Articles-Creer', path: 'creer', component: CreerArticleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
