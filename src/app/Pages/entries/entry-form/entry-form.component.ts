import { CategoryService } from './../../categories/shared/category.service';
import { EntryService } from './../shared/entry.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, toArray } from 'rxjs/operators';
import toastr from 'toastr';
import { Entry } from '../shared/entry.model';
import { TouchSequence } from 'selenium-webdriver';
import { text } from '@angular/core/src/render3';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Category } from '../../categories/shared/category.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparators: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
       'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(private entryService: EntryService,
              private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterContentChecked() { // Garante o carregamento da página após todo componente enviar resposta
    this.setPageTitle();
  }


  submitForm() {
    this.submittingForm = true;
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'new') {
      this.createEntry();
    } else {this.updateEntry(); }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      // tslint:disable-next-line: no-shadowed-variable
      ([value, text]) => {
        return {
          // tslint:disable-next-line: object-literal-shorthand
          text: text,
          // tslint:disable-next-line: object-literal-shorthand
          value: value
        };
      }
    );
  }

  // Private Methods
  private setPageTitle() {
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'nova') {
      this.pageTitle = 'Cadasto de novo Lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Entries: ' + entryName;
    }

  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
                     // tslint:disable-next-line: no-shadowed-variable
                     .subscribe(entry => this.actionsForSuccess(entry),
                                error => this.actionsForError(error));
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
                     // tslint:disable-next-line: no-shadowed-variable
                     .subscribe(entry => this.actionsForSuccess(entry),
                                error => this.actionsForError(error) );

  }

  private actionsForSuccess(entry: Entry) {
    toastr.error('Solicitação processada com sucesso!');

    // Redirect/reload a página do component, não salva no cache do browser essa troca de links
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'editar'])
    );

  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');
    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body.errors);
    } else { this.serverErrorMessages =
    ['Falha na comunicação com o servidor. Por Favor, tente mais tarde']; }
  }


  private setCurrentAction() {
    // tslint:disable-next-line: triple-equals
    if (this.route.snapshot.url[0].path == 'nova') {
      this.currentAction = 'nova';
    } else {
      this.currentAction = 'editar';
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group ({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required, Validators.minLength(3)]],
      amount: [null,  [Validators.required, Validators.minLength(3)]],
      date: [null,  [Validators.required, Validators.minLength(3)]],
      paid: [true,  [Validators.required, Validators.minLength(3)]],
      categoryId: [null,  [Validators.required, Validators.minLength(3)]]
    });
  }

  private loadEntry() {
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'editar') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe((entry) => {
        this.entry = entry;
        this.entryForm.patchValue(entry); // bind loaded entry data to EntryForm
      });
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }
}
