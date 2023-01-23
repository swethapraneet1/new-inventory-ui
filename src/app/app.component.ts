import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import {
  Breakpoints,
  BreakpointObserver,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { AuthenticationService } from './_services';
import { Observable } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { stringify } from 'querystring';
import { Store } from '@ngrx/store';
import { setSiteSelection } from '../app/app.action';
import {
  selectSiteId,
  getSiteDropdwon,
  getUserDetails,
} from '../app/app.selectors';
import { Site } from '../app/shared/common.model';
import { BackendService } from '../app/_services/backend.service';
import { AppAction } from '../app/app.action';

interface sites {
  siteId: string;
  siteName: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  title = 'Fuel Inventory';
  user: any = null;
  isMobile: boolean;
  mode = 'side';
  uiContent = 'content';
  progrssBarClass = 'progress-bar';
  isloading = true;
  idleState = '';
  timedOut = false;
  lastPing?: Date = null;
  countDown: string;
  site: Observable<number>;
  selectedValue: string;
  sites: sites[] = [];

  constructor(
    // private loadingBar: SlimLoadingBarService,
    private router: Router,
    public authService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private idle: Idle,
    private keepalive: Keepalive,
    private store: Store,
    private backendService: BackendService
  ) {
    // console.log(' constructor');
    if (this.user === null || this.user === undefined) {
      let userInfo = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
      // console.log('appComp', userInfo);
    }
    this.isloading = true;

    breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        // console.log(result);
        if (result.matches) {
          // this.activateHandsetLayout();
          this.isMobile = true;
          this.mode = 'over';
          this.uiContent = 'mobile-content';
        } else {
          this.isMobile = false;
          this.mode = 'side';
          this.uiContent = 'content';
        }
      });
    // breakpointObserver.ngOnDestroy()

    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
    // auto logout timer code starts
    // sets an idle timeout of 30 seconds, for testing purposes.
    idle.setIdle(600);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idle.onIdleEnd.subscribe(() =>
      setTimeout(() => {
        this.idleState = '';
      }, 1000)
    );
    //

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });
    idle.onIdleStart.subscribe(() => (this.idleState = ''));
    idle.onTimeoutWarning.subscribe(
      (countdown) =>
        (this.idleState = 'You will time out in ' + countdown + ' seconds!')
    );
    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
    // auto logout timer code starts
  }

  ngOnChanges() {
    // console.log(' ngOnChanges');
  }
  reset() {
    this.idle.watch();
    this.idleState = '';
    this.timedOut = false;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.user = this.authService.getUser();
    if (this.user === null || this.user === undefined || Object.keys(this.user).length === 0) {
      this.store.select(getUserDetails).map((users) => {
        this.user = users;
        // console.log(this.user);
      });
    }
    this.isloading = false;

    console.log(this.user);
    this.store.dispatch(AppAction.getSitesDropdown());
    this.store.dispatch(AppAction.getTotalGrades()); // don't remove 
    this.store.select(selectSiteId).subscribe((siteId) => {
      this.site = siteId;
      console.log(this);
    });
    this.store.select(getSiteDropdwon).subscribe((dropdown) => {
      if (dropdown.res) {
        let dropDownValue = dropdown.res.sites;
        this.sites = dropDownValue;
        this.selectedValue = this.sites[0].siteId;
        this.store.dispatch(setSiteSelection({ siteId: this.sites[0].siteId }));
      }
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.authService.logout();
    this.router.navigate(['login']);
    this.reset();
  }

  selected(value) {
    this.store.dispatch(setSiteSelection({ siteId: value }));
  }

  isAuth(isAuth?: any) {
    if (isAuth) {
      this.user = this.authService.getUser();
      this.user = JSON.parse(localStorage.getItem('FUEL_INVENTORY')) || {};
      if (this.user === null) {
        this.store.select(selectSiteId).subscribe((user) => {
          this.user = user;
        });
      }
    }
  }
  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.progrssBarClass = 'progress-bar';
      this.isloading = true;
    }
    if (event instanceof NavigationEnd) {
      this.progrssBarClass = 'progress-bar-hidden';
      this.isloading = false;
    }
    if (event instanceof NavigationCancel) {
      this.progrssBarClass = 'progress-bar-hidden';
      this.isloading = false;
    }
    if (event instanceof NavigationError) {
      this.progrssBarClass = 'progress-bar-hidden';
      this.isloading = false;
    }
  }

  ngOnDestroy() {
    this.breakpointObserver.ngOnDestroy();
    this.authService.logout();
    localStorage.clear();
    this.reset();
    //   this.router.events
    // this.breakpoint.
  }
}
