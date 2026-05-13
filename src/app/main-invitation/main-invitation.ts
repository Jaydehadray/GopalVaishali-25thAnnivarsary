import { Component, AfterViewInit, ElementRef, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDetails } from '../invitation-details/invitation-details';
import { SaveTheDate } from '../save-the-date/save-the-date';
import { Photos } from '../photos/photos';
import { Schedule } from '../schedule/schedule';
import { Venue } from '../venue/venue';

@Component({
  selector: 'app-main-invitation',
  standalone: true,
  imports: [
    CommonModule,
    InvitationDetails,
    SaveTheDate,
    Photos,
    Schedule,
    Venue
  ],
  templateUrl: './main-invitation.html',
  styleUrl: './main-invitation.css'
})
export class MainInvitation implements AfterViewInit, OnDestroy {
  @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;
  isMuted = true;
  hasInteracted = false;
  
  private observer: IntersectionObserver | null = null;
  private scrollY = 0;

  constructor(private el: ElementRef) {}

  @HostListener('window:click')
  onFirstInteraction() {
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      // Try to auto-play if unmuted, or just unlock audio context
      if (!this.isMuted && this.bgMusic?.nativeElement) {
        this.bgMusic.nativeElement.play().catch(e => console.log('Audio autoplay prevented'));
      }
    }
  }

  toggleAudio() {
    this.isMuted = !this.isMuted;
    if (this.bgMusic?.nativeElement) {
      this.bgMusic.nativeElement.muted = this.isMuted;
      if (!this.isMuted) {
        this.bgMusic.nativeElement.play().catch(e => console.log('Audio play prevented', e));
      } else {
        this.bgMusic.nativeElement.pause();
      }
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    this.scrollY = event.target.scrollTop;
    this.updateParallax();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          this.observer?.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '200px', // Trigger animations early to prevent missing elements on fast scroll
      threshold: 0
    });

    // Observe all elements with the 'reveal' class and photo frames
    const revealElements = this.el.nativeElement.querySelectorAll('.reveal, .photo-frame');
    revealElements.forEach((el: HTMLElement) => {
      this.observer?.observe(el);
    });
  }

  updateParallax() {
    const hearts = this.el.nativeElement.querySelectorAll('.floating-heart');
    hearts.forEach((heart: HTMLElement, index: number) => {
      const speed = (index + 1) * 0.1;
      const yOffset = this.scrollY * speed;
      heart.style.transform = `translateY(${yOffset}px)`;
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
