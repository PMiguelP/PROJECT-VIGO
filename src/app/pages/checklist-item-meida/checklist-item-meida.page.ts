import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ChecklistItemService } from '../../services/checklist-item/checklist-item.service';
import {
  CommentService,
  Comment,
} from '../../services/comments/comments.service';
import { Observable } from 'rxjs';
import { UploadPhotoComponent } from '../../components/upload-photo/upload-photo.component';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-checklist-item-meida',
  templateUrl: './checklist-item-meida.page.html',
  styleUrls: ['./checklist-item-meida.page.scss'],
})
export class ChecklistItemMeidaPage implements OnInit {
  checklistItemId: string = '';
  photos$: Observable<string[]> | null = null;
  comments$: Observable<Comment[]> | null = null;
  activeTab: string = 'pictures';
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private checklistItemService: ChecklistItemService,
    private commentService: CommentService,
    private modalController: ModalController,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.checklistItemId = params['checklistItemId'];
      if (this.checklistItemId) {
        this.loadPhotos();
        this.loadComments();
      }
    });
  }

  loadPhotos() {
    this.photos$ = this.checklistItemService.getChecklistItemPhotos(
      this.checklistItemId
    );
  }

  loadComments() {
    this.comments$ = this.commentService.getCommentsForChecklistItem(
      this.checklistItemId
    );
  }

  async openUploadModal() {
    const modal = await this.modalController.create({
      component: UploadPhotoComponent,
      componentProps: {
        checklistItemId: this.checklistItemId, // Pass the ID to the component
      },
    });

    modal.onDidDismiss().then(() => {
      this.loadPhotos(); // Refresh photos after upload
    });

    await modal.present();
  }

  segmentChanged(event: any) {
    this.activeTab = event.detail.value;
  }

  // Post a new comment
  // Post a new comment
  postComment() {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (!user) {
        console.error('No user is logged in. Cannot post comment.');
        return;
      }
      const commentData = {
        checklistItemId: this.checklistItemId,
        comment: this.newComment,
        userId: user.id,
        commentType: 'CHECKLIST_ITEM',
      };
      if (
        !commentData.checklistItemId ||
        !commentData.comment ||
        !commentData.userId
      ) {
        console.error('Comment data is incomplete:', commentData);
        return;
      }
      console.log('Posting comment with data:', commentData);

      this.commentService.createComment(commentData).subscribe({
        next: () => {
          this.newComment = '';
          this.loadComments();
        },
        error: (error) => {
          console.error('Failed to post comment:', error);
        },
      });
    });
  }
}
