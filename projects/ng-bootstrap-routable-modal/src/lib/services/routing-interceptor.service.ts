import { Inject, Injectable, InjectionToken } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, merge, take, tap } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoutableModalService } from './routable-modal.service';
import { MODAL_NAME_PARAM, PREFIX_MODAL_PARAM } from '../const';
import { RoutableModalsConfiguration } from '../models/routable-modals-configuration.model';

export const ROUTABLE_MODAL_CONFIG =
  new InjectionToken<RoutableModalsConfiguration>('ROUTABLE_MODAL_CONFIG');

@Injectable()
export class RoutingInterceptorService {
  constructor(
    private router: Router,
    public modalService: NgbModal,
    public routableModalService: RoutableModalService,
    @Inject(ROUTABLE_MODAL_CONFIG) private config?: RoutableModalsConfiguration
  ) {}

  public watchRouteChanges(): Observable<any> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => this.getQueryParams((event as NavigationEnd).url)),
      tap((data) => {
        const modal = this.config?.modalsConfigurations.find(
          (c) => c.name == data.name
        );
        if (modal) {
          const modalRef = this.modalService.open(modal.component);
          modalRef.componentInstance.params = data.parmas;
          this.routableModalService.setOpenModalRef(data.name, modalRef);
          merge(modalRef.dismissed, modalRef.closed)
            .pipe(take(1))
            .subscribe((_) => {
              this.routableModalService.resetParamsInternal();
            });
        }
      })
    );
  }

  // UTILS

  private getQueryParams(url: string): any {
    const [baseUrl, queryString] = url.split('?');
    if (queryString) {
      const kv = queryString.split('&').map((p) => p.split('='));
      const modalName = kv.find(([key, value]) => key == MODAL_NAME_PARAM)?.[1];
      const parmas = kv
        .filter(([key, value]) => key.startsWith(PREFIX_MODAL_PARAM))
        .reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key.split(PREFIX_MODAL_PARAM)[1]]: value,
          }),
          {}
        );
      return { name: modalName, parmas, c: this.config };
    }
    return {};
  }
}
