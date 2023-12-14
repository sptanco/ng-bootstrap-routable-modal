import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, merge, take } from 'rxjs';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ROUTABLE_MODAL_CONFIG } from './routing-interceptor.service';
import { MODAL_NAME_PARAM, PREFIX_MODAL_PARAM } from '../const';
import { RoutableModalsConfiguration } from '../models/routable-modals-configuration.model';

@Injectable()
export class RoutableModalService {
  private openModal = new Subject<{ name: string; ref: NgbModalRef } | null>();
  openModal$ = this.openModal.asObservable();

  constructor(
    private modalSvc: NgbModal,
    private location: Location,
    @Inject(ROUTABLE_MODAL_CONFIG) private config?: RoutableModalsConfiguration
  ) {}

  public show(
    modalName: string,
    options?: NgbModalOptions | undefined,
    params?: any
  ): NgbModalRef {
    const routableModalConf = this.config?.modalsConfigurations.find(
      (c) => c.name == modalName
    );

    if (!routableModalConf) {
      throw new Error(
        'Modal with name ' +
          modalName +
          ' dont exist. Add to NgBootstraproutableModalModule.forRoot(conf)'
      );
    }

    const newParams = {
      [MODAL_NAME_PARAM]: routableModalConf.name,
      ...Object.entries(params).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [PREFIX_MODAL_PARAM + key]: value,
        }),
        {}
      ),
    };

    this.updateQueryParamsInternal(newParams);

    // OPEN MODAL

    const modalRef = this.modalSvc.open(routableModalConf.component, options);
    merge(modalRef.dismissed, modalRef.closed)
      .pipe(take(1))
      .subscribe((_) => {
        this.resetParamsInternal();
      });

    this.setOpenModalRef(routableModalConf.name, modalRef);
    return modalRef;
  }

  public updateQueryParams(params: any) {
    const newParams = {
      ...Object.entries(params).reduce(
        (acc, [key, value]) => ({ ...acc, [PREFIX_MODAL_PARAM + key]: value }),
        {}
      ),
    };

    this.updateQueryParamsInternal(newParams);
  }

  public setOpenModalRef(name: string, ref: NgbModalRef) {
    this.openModal.next({ name, ref });
  }

  public resetParamsInternal() {
    this.openModal.next(null);
    const currentUrl = this.location.path();

    const urlTree = this.location.normalize(
      this.location.prepareExternalUrl(currentUrl)
    );
    const queryParams = new URLSearchParams(urlTree);

    for (const [key, value] of Array.from(queryParams)) {
      if (key == MODAL_NAME_PARAM) {
        queryParams.delete(key);
      }
      if (key.startsWith(PREFIX_MODAL_PARAM)) {
        queryParams.delete(key);
      }
    }

    const newQueryParams = queryParams.toString();
    const baseUrl = urlTree.split('?')[0];
    const newUrl =
      newQueryParams === '' ? baseUrl : `${baseUrl}?${newQueryParams}`;

    this.location.replaceState(newUrl);
  }

  private updateQueryParamsInternal(params: { [key: string]: string }) {
    const currentUrl = this.location.path();

    const urlTree = this.location.normalize(
      this.location.prepareExternalUrl(currentUrl)
    );
    const queryParams = new URLSearchParams(urlTree);

    for (const [key, value] of Object.entries(params)) {
      queryParams.set(key, value);
    }

    const newQueryParams = queryParams.toString();
    const newUrl = `${urlTree.split('?')[0]}?${newQueryParams}`;

    this.location.replaceState(newUrl);
  }
}
