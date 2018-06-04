import { Component } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Entry } from './entry.model';
import { EntryService } from './entry.provider';
import { Blog, BlogService } from '../blog';
import { Tag, TagService } from '../tag';

@IonicPage()
@Component({
    selector: 'page-entry-dialog',
    templateUrl: 'entry-dialog.html'
})
export class EntryDialogPage {

    entry: Entry;
    blogs: Blog[];
    tags: Tag[];
    date: string;
    isReadyToSave: boolean;

    form: FormGroup;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController,
                formBuilder: FormBuilder, params: NavParams,
                private dataUtils: JhiDataUtils,                 private blogService: BlogService,
                private tagService: TagService,
                private entryService: EntryService) {
        this.entry = params.get('item');
        if (this.entry && this.entry.id) {
            this.entryService.find(this.entry.id).subscribe(data => {
                this.entry = data;
            });
        } else {
            this.entry = new Entry();
        }

        this.form = formBuilder.group({
            id: [params.get('item') ? this.entry.id : null],
            title: [params.get('item') ? this.entry.title : '',  Validators.required],
            content: [params.get('item') ? this.entry.content : '',  Validators.required],
            date: [params.get('item') ? this.entry.date : '',  Validators.required],
            blog: [params.get('item') ? this.entry.blog : '',],
            tags: [params.get('item') ? this.entry.tags : '',],
        });

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ionViewDidLoad() {
        this.blogService.query()
            .subscribe(data => { this.blogs = data; }, (error) => this.onError(error));
        this.tagService.query()
            .subscribe(data => { this.tags = data; }, (error) => this.onError(error));
    }

    /**
     * The user cancelled, dismiss without sending data back.
     */
    cancel() {
        this.viewCtrl.dismiss();
    }

    /**
     * The user is done and wants to create the entry, so return it
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

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
        
    }

    compareBlog(first: Blog, second: Blog): boolean {
        return first && second ? first.id === second.id : first === second;
    }

    trackBlogById(index: number, item: Blog) {
        return item.id;
    }
    compareTag(first: Tag, second: Tag): boolean {
        return first && second ? first.id === second.id : first === second;
    }

    trackTagById(index: number, item: Tag) {
        return item.id;
    }
}
