import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Blog } from './blog.model';
import { BlogService } from './blog.provider';
import { User } from '../../../models/user.model';
import { User as UserService } from '../../../providers/user/user';

@IonicPage()
@Component({
    selector: 'page-blog-dialog',
    templateUrl: 'blog-dialog.html'
})
export class BlogDialogPage {

    blog: Blog;
    users: User[];
    isReadyToSave: boolean;

    form: FormGroup;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController,
                formBuilder: FormBuilder, params: NavParams,
                private userService: UserService,
                private blogService: BlogService) {
        this.blog = params.get('item');
        if (this.blog && this.blog.id) {
            this.blogService.find(this.blog.id).subscribe(data => {
                this.blog = data;
            });
        } else {
            this.blog = new Blog();
        }

        this.form = formBuilder.group({
            id: [params.get('item') ? this.blog.id : null],
            name: [params.get('item') ? this.blog.name : '',  Validators.required],
            handle: [params.get('item') ? this.blog.handle : '',  Validators.required],
            user: [params.get('item') ? this.blog.user : '',],
        });

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ionViewDidLoad() {
        this.userService.findAll().subscribe(data => this.users = data, (error) => this.onError(error));
    }

    /**
     * The user cancelled, dismiss without sending data back.
     */
    cancel() {
        this.viewCtrl.dismiss();
    }

    /**
     * The user is done and wants to create the blog, so return it
     * back to the presenter.
     */
    done() {
        if (!this.form.valid) { return; }
        this.viewCtrl.dismiss(this.form.value);
    }

    onError(error) {
        console.error(error);
        let toast = this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
        toast.present();
    }

    compareUser(first: User, second: User): boolean {
        return first && second ? first.id === second.id : first === second;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}
