import { Inject, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  RoutingInterceptorService,
  ROUTABLE_MODAL_CONFIG,
} from './services/routing-interceptor.service';
import { RoutableModalService } from './services/routable-modal.service';
import { RoutableModalsConfiguration } from './models/routable-modals-configuration.model';

@NgModule({
  declarations: [],
  imports: [CommonModule, NgbModule],
  exports: [NgbModule],
})
export class NgBootstraproutableModalModule {
  public constructor(
    private routingInterceptorService: RoutingInterceptorService
  ) {
    this.routingInterceptorService
      .watchRouteChanges()
      .subscribe((e) => console.dir(e));
  }

  public static forRoot(
    config?: RoutableModalsConfiguration
  ): ModuleWithProviders<NgBootstraproutableModalModule> {
    return {
      ngModule: NgBootstraproutableModalModule,
      providers: [
        RoutingInterceptorService,
        RoutableModalService,
        {
          provide: ROUTABLE_MODAL_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
