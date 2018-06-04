import { User as UserService } from '../../../providers/user/user';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { BlogDialogPage } from './blog-dialog';
import { BlogService } from './blog.provider';

@NgModule({
    declarations: [
        BlogDialogPage
    ],
    imports: [
        IonicPageModule.forChild(BlogDialogPage),
        TranslateModule.forChild()
    ],
    exports: [
        BlogDialogPage
    ],
    providers: [
        BlogService,
        UserService,
    ]
})
export class BlogDialogPageModule {
}
