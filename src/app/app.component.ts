import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  TemplateRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fakeLogText } from '../assets/fake-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  public title = 'niwaka-hacker';
  public inputSubject: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  public convertedText: string = '';
  private inputCounter: number = 0;
  public fakeLog: string[] = [];
  public fakePassword: string = '';

  @ViewChild('progress') private templateProgress: TemplateRef<any>;
  @ViewChild('logger') private templateLogger: TemplateRef<any>;
  @ViewChild('password') private templatePassword: TemplateRef<any>;
  @ViewChild('txt') private textArea: ElementRef<any>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscription = this.inputSubject.subscribe(txt => {
      this.inputCounter++;
      if (this.inputCounter % 5 === 0) {
        this.showFakeProgress();
      }
      if (this.inputCounter % 13 === 0) {
        this.showFakeLogger();
      }
      if (this.inputCounter % 19 === 0) {
        this.showFakeLogin();
      }
      this.convertedText += this.Char2Binary(txt);
    });
  }

  ngAfterViewInit(): void {
    this.textArea.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private Char2Binary(text: string): string {
    const lastCharCode: number = text ? text.charCodeAt(text.length - 1) : 0;
    const lastCharCodeBinary: string = (
      '0000000000000000' + lastCharCode.toString(2)
    ).slice(-16);
    return (
      (this.convertedText ? ' ' : '') +
      lastCharCodeBinary.substr(0, 8) +
      ' ' +
      lastCharCodeBinary.substr(8, 8)
    );
  }

  private showFakeProgress(): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      this.templateProgress,
      {
        minWidth: '50%',
        autoFocus: false,
        hasBackdrop: false,
        panelClass: 'fake-dialog',
        position: {
          top: `${Math.random() * 50}%`,
          left: `${Math.random() * 50}%`
        }
      }
    );
    const dialogOpen: Subscription = dialogRef
      .afterOpened()
      .subscribe(() => this.textArea.nativeElement.focus());
    setTimeout(() => {
      dialogRef.close();
      dialogOpen.unsubscribe();
    }, 1000);
  }

  private showFakeLogger(): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(this.templateLogger, {
      autoFocus: false,
      hasBackdrop: false,
      width: '500px',
      panelClass: 'fake-dialog',
      position: {
        top: `5%`,
        left: `5%`
      }
    });
    const dialogOpen: Subscription = dialogRef.afterOpened().subscribe(() => {
      this.textArea.nativeElement.focus();
      this.fakeLog = [];
      let count: number = 0;
      const timer = setInterval(() => {
        this.fakeLog.push(fakeLogText[count]);
        if (this.fakeLog.length > 20) {
          this.fakeLog.shift();
        }
        if (count++ > fakeLogText.length) {
          clearInterval(timer);
        }
      }, 20);
    });
    setTimeout(() => {
      dialogRef.close();
      dialogOpen.unsubscribe();
    }, 2000);
  }

  private showFakeLogin(): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      this.templatePassword,
      {
        hasBackdrop: false,
        autoFocus: true,
        panelClass: 'fake-dialog',
        position: {
          top: `5%`,
          right: `5%`
        }
      }
    );
    const dialogOpen: Subscription = dialogRef.afterOpened().subscribe(() => {
      this.fakePassword = '';
      const timer = setInterval(() => {
        this.textArea.nativeElement.focus();
        this.fakePassword += '0';
        if (8 < this.fakePassword.length) {
          clearInterval(timer);
          setTimeout(() => {
            dialogRef.close();
            dialogOpen.unsubscribe();
          }, 1800);
        }
      }, 200);
    });
  }
}
