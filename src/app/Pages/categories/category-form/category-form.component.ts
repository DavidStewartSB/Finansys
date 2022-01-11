import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { switchMap, toArray } from 'rxjs/operators';
import toastr from 'toastr';
import { TouchSequence } from 'selenium-webdriver';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

currentAction: string;
categoryForm: FormGroup;
pageTitle: string;
serverErrorMessages: string[] = null;
submittingForm = false;
category: Category = new Category();

  constructor(private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() { // Garante o carregamento da página após todo componente enviar resposta
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'new') {
      this.createCategory();
    } else { this.updateCategory(); }
  }


  // Private METHODS
  private setCurrentAction() {
    // tslint:disable-next-line: triple-equals
    if (this.route.snapshot.url[0].path == 'nova') {
    this.currentAction = 'nova';
    } else {
      this.currentAction = 'editar';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group ({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'editar') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe((category) => {
        this.category = category;
        this.categoryForm.patchValue(category); // binds loaded category data to CategoryForm
      },
      (error) => alert('Ocorreu um erro no servidor, tente mais tarde'));
    }
  }

  private setPageTitle() {
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'nova') {
      this.pageTitle = 'Cadastro de nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
                        // tslint:disable-next-line: no-shadowed-variable
                        .subscribe( category => this.actionsForSuccess(category),
                                    error => this.actionsForError(error) );
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
                        // tslint:disable-next-line: no-shadowed-variable
                        .subscribe(category => this.actionsForSuccess(category),
                                   error => this.actionsForError(error) );
  }

  private actionsForSuccess(category: Category) {
    toastr.success('Solicitação processada com sucesso!');

    // Redirect/reload component page( skipLocationChange não salva o redirecionamento no cache do browser)
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'editar'])
    );
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body.errors);
    } else { this.serverErrorMessages =
      ['Falha na comunicação com o servidor. Por favor, tente mais tarde']; }
  }
}
