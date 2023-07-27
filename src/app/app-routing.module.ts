import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormRenderComponent } from './components/form-render/form-render.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:"formBuilder",
    pathMatch:'full'
  },
  {
    path: 'formBuilder',
    component: FormBuilderComponent,
  },
  {
    path: 'formRender',
    component: FormRenderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
