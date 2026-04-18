import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {

  private _breadcrumbs = new BehaviorSubject<string[]>([]);
  public breadcrumbs$ = this._breadcrumbs.asObservable(); // 👈 ISSO QUE FALTA

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumb(this.route.root);
        this._breadcrumbs.next(breadcrumbs);
      });
  }

  private buildBreadcrumb(route: ActivatedRoute, breadcrumbs: string[] = []): string[] {
    if (route.routeConfig?.data?.['breadcrumb']) {
      breadcrumbs.push(route.routeConfig.data['breadcrumb']);
    }

    if (route.firstChild) {
      return this.buildBreadcrumb(route.firstChild, breadcrumbs);
    }

    return breadcrumbs;
  }
}