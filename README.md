# Quick start

-Add lib:

```console
npm install ng-bootstrap-routable-modal
```

-Import module:

<!-- prettier-ignore -->
```angular
import { NgBootstraproutableModalModule } from 'ng-bootstrap-routable-modal';

NgBootstraproutableModalModule.forRoot({
  modalsConfigurations: [{ component: DemoModalComponent, name: 'demo' }],
})
```

-Use the service for open the modal:

<!-- prettier-ignore -->
```angular
import { RoutableModalService } from 'ng-bootstrap-routable-modal';

constructor(public routableModalService: RoutableModalService) {}

this.routableModalService.show('demo', undefined, {
  name: 'Pluto'
});
```

-Exemple of a Modal:

<!-- prettier-ignore -->
```angular
export class DemoModalComponent implements OnInit { 
  public params: {name: string}; 
  public form!: FormGroup; 

  constructor( public activeModal: NgbActiveModal, private fb: FormBuilder, private routableModalService: RoutableModalService ) {} 
  
  ngOnInit(): void { 
    this.form = this.fb.group({ name: null }); 
    this.form.patchValue(this.params); 
    this.form.valueChanges.subscribe((f) => this.routableModalService.updateQueryParams(f) ); 
  } 

  passBack() { 
    this.activeModal.close(this.form.getRawValue()); 
    } 
}
```

-Subscribe of the close event:

<!-- prettier-ignore -->
```angular
this.routableModalService.openModal$
  .pipe(filter((modal) => modal?.name === 'demo'))
  .subscribe((modal) => modal?.ref?.closed.subscribe((r) => console.dir(r)));
```
