import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-save-the-date',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './save-the-date.html',
  styleUrl: './save-the-date.css'
})
export class SaveTheDate implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('scratchCanvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  revealed = {
    month: false,
    day: false,
    year: false
  };

  showConfetti = false;
  allRevealed = false;

  confettiParticles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    delay: Math.random() * 2 + 's',
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    size: Math.random() * 8 + 4 + 'px'
  }));

  private timerInterval: any;
  private targetDate = new Date('May 29, 2026 17:00:00').getTime();
  
  private isDrawing = false;
  private brushSize = 25;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.startTimer();
  }
  
  ngAfterViewInit() {
    // Initialize canvases
    this.canvases.forEach((canvasRef) => {
      this.initCanvas(canvasRef.nativeElement);
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  
  initCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill with metallic taupe/gold
    ctx.fillStyle = '#b59f7b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text "SCRATCH"
    ctx.font = 'bold 16px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH', canvas.width / 2, canvas.height / 2);

    // Setup mouse events
    canvas.addEventListener('mousedown', (e) => this.startDrawing(e, canvas));
    canvas.addEventListener('mousemove', (e) => this.draw(e, canvas));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseleave', () => this.stopDrawing());

    // Setup touch events
    canvas.addEventListener('touchstart', (e) => this.startDrawing(e, canvas), { passive: false });
    canvas.addEventListener('touchmove', (e) => this.draw(e, canvas), { passive: false });
    canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  startDrawing(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
    if (this.isRevealed(canvas)) return;
    this.isDrawing = true;
    this.draw(e, canvas);
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
    if (!this.isDrawing || this.isRevealed(canvas)) return;
    
    // Prevent scrolling when scratching on touch devices
    if (e.type === 'touchmove') e.preventDefault();

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (e instanceof TouchEvent) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as MouseEvent).clientX - rect.left;
      y = (e as MouseEvent).clientY - rect.top;
    }

    // Scale coordinates based on canvas pixel ratio vs display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    x *= scaleX;
    y *= scaleY;

    // Erase the canvas where the pointer is
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
    ctx.fill();

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    this.checkScratchPercent(canvas, ctx);
  }

  checkScratchPercent(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // Check pixel data to see how much is erased
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    // Check every 16th pixel for performance (step by 4 bytes * 4 pixels = 16)
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }
    
    const totalSampledPixels = pixels.length / 16;
    if (transparentPixels / totalSampledPixels > 0.4) {
      // If 40% cleared, automatically reveal the rest
      const part = canvas.getAttribute('data-part') as 'month' | 'day' | 'year';
      if (part && !this.revealed[part]) {
        this.reveal(part);
        this.cdr.detectChanges(); // Ensure Angular detects the change from event listener
      }
    }
  }

  isRevealed(canvas: HTMLCanvasElement): boolean {
    const part = canvas.getAttribute('data-part') as 'month' | 'day' | 'year';
    return part ? this.revealed[part] : false;
  }

  startTimer() {
    this.updateCountdown();

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.updateCountdown();
      this.cdr.detectChanges();
    }, 1000);
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return;
    }

    this.countdown = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }

  reveal(part: 'month' | 'day' | 'year') {
    this.revealed[part] = true;
    this.checkAllRevealed();
  }

  checkAllRevealed() {
    if (this.revealed.month && this.revealed.day && this.revealed.year) {
      this.allRevealed = true;
      this.triggerConfetti();
      this.startTimer();
    }
  }

  triggerConfetti() {
    this.showConfetti = true;
  }
}
