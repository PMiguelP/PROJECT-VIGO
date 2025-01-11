import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  checklistId: string = '';
  photos$: Observable<string[]> | null = null;
  comments$: Observable<Comment[]> | null = null;
  activeTab: string = 'pictures';
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private checklistItemService: ChecklistItemService,
    private commentService: CommentService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.checklistItemId = params['checklistItemId'];

      // Tentar buscar o checklistId dos queryParams primeiro
      this.checklistId = params['checklistId'];

      // Caso não esteja nos queryParams, buscar no estado de navegação
      if (!this.checklistId) {
        const navigation = this.router.getCurrentNavigation();
        this.checklistId = navigation?.extras.state?.['checklistId'] || '';

        if (!this.checklistId) {
          console.error('Checklist ID is missing. Cannot proceed.');
        }
      }

      if (this.checklistItemId) {
        this.loadPhotos();
        this.loadComments();
      } else {
        console.error('Checklist Item ID is missing. Cannot load media.');
      }
    });
  }

  loadPhotos() {
    if (this.checklistItemId) {
      this.photos$ = this.checklistItemService.getChecklistItemPhotos(
        this.checklistItemId
      );
    } else {
      console.error('Cannot load photos without a Checklist Item ID.');
    }
  }

  loadComments() {
    if (this.checklistItemId) {
      this.comments$ = this.commentService.getCommentsForChecklistItem(
        this.checklistItemId
      );
    } else {
      console.error('Cannot load comments without a Checklist Item ID.');
    }
  }

  async openUploadModal() {
    const modal = await this.modalController.create({
      component: UploadPhotoComponent,
      componentProps: {
        checklistItemId: this.checklistItemId,
      },
    });

    modal.onDidDismiss().then(() => {
      this.loadPhotos();
    });

    await modal.present();
  }

  segmentChanged(event: any) {
    this.activeTab = event.detail.value;
  }

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
      if (!commentData.comment) {
        console.error('Comment is empty. Cannot post an empty comment.');
        return;
      }

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

  goBackToChecklistPage() {
    if (this.checklistId) {
      this.router.navigate(['/checklist'], {
        queryParams: { id: this.checklistId },
      });
    } else {
      console.error('Checklist ID is missing. Cannot navigate back.');
    }
  }
}
