import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthenticationService } from './_services';
import { Observable } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { stringify } from 'querystring';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  title = 'ng crm';
  user: any = null;
  isMobile: boolean;
  mode = "side"
  uiContent = "content"
  progrssBarClass = "progress-bar";
  isloading = true;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  countDown : string;

  constructor(
    // private loadingBar: SlimLoadingBarService,
    private router: Router,
    public authService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private idle: Idle, private keepalive: Keepalive
  ) {
    console.log(" constructor")

    this.isloading = true;


    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      console.log(result)
      if (result.matches) {
        // this.activateHandsetLayout();
        this.isMobile = true;
        this.mode = "over"
        this.uiContent = "mobile-content"
      }
      else {
        this.isMobile = false;
        this.mode = "side"
        this.uiContent = "content"
      }
    });
    // breakpointObserver.ngOnDestroy()

    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    })
      ;
      // sets an idle timeout of 30 seconds, for testing purposes.
    idle.setIdle(30);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) =>
     this.idleState = 'You will time out in ' + countdown + ' seconds!'
    );
    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
    
    
    
  }

  ngOnChanges() {
    console.log(" ngOnChanges")
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  ngOnInit(): void {
    console.log(" ngOnInit")
   

    this.user = this.authService.getUser();
    this.isloading = false;
  }

  logout(): void {
    // localStorage.removeItem('currentUser');
    this.authService.logout()
    this.router.navigate(['login']);
  }



  isAuth(isAuth?: any) {
    if (isAuth) {
      this.user = this.authService.getUser()
      // this.user = JSON.parse(localStorage.getItem(APP_USER_PROFILE)) || <User>{};
    }
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this. progrssBarClass = "progress-bar";
      this.isloading = true;
    }
    if (event instanceof NavigationEnd) {
      this. progrssBarClass = "progress-bar-hidden";
      this.isloading = false;
    }
    if (event instanceof NavigationCancel) {
      this. progrssBarClass = "progress-bar-hidden";
      this.isloading = false;
    }
    if (event instanceof NavigationError) {
      this. progrssBarClass = "progress-bar-hidden";
      this.isloading = false;
    }

  }


  ngOnDestroy() {
    this.breakpointObserver.ngOnDestroy()
    this.authService.logout()
    //   this.router.events
    // this.breakpoint.
  }

}
