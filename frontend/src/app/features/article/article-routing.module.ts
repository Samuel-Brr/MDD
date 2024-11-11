import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArticleComponent} from "./components/article/article.component";
import {ArticleDetailComponent} from "./components/article-detail/article-detail.component";

const routes: Routes = [
  { title: 'Articles', path: '', component: ArticleComponent },
  { title: 'Articles', path: 'detail/:id', component: ArticleDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
