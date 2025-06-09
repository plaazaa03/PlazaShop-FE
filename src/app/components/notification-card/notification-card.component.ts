import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationMessage } from '../../services/notification.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ]
})
export class NotificationCardComponent implements OnInit, OnDestroy {
  notification: NotificationMessage | null = null;
  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      (message) => {
        this.notification = message;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  closeNotification(): void {
    this.notificationService.hide();
  }

  getNotificationClass(): string {
    if (!this.notification) return '';
    switch (this.notification.type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'info':
        return 'notification-info';
      case 'warning':
        return 'notification-warning';
      default:
        return '';
    }
  }
}