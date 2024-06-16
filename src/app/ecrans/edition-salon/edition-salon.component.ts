import { HttpClient } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { Serveur } from '../../models/serveur.type';

@Component({
  selector: 'app-edition-salon',
  standalone: true,
  imports: [
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterLink,
    MatSelectModule    

  ],
  templateUrl: './edition-salon.component.html',
  styleUrl: './edition-salon.component.scss'
})
export class EditionSalonComponent {

  @Input() id!: string
  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  snackBar: MatSnackBar = inject(MatSnackBar);
  route: ActivatedRoute = inject(ActivatedRoute)
  listeServeur: Serveur[] = [];

  ngOnInit() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      this.http
        .get<Serveur[]>('http://localhost:3000/serveur/possede')
        .subscribe((listeServeur) => (this.listeServeur = listeServeur));
    }
  }

  formulaire: FormGroup = this.formBuilder.group({
    nom: [
      '',
      [Validators.required],
    ],
    public: [true, []],
    serveur: ['', [Validators.required]]
  });



  onAjoutSalon() {
    if (this.formulaire.valid) {
      console.log(this.formulaire.value)

      this.http
        .post('http://localhost:3000/serveur/ajout-salon', this.formulaire.value)
        .subscribe((nouveausalon) => {
          this.snackBar.open('Le salon a bien été ajouté', undefined, {
            duration: 3000,
          });

          this.router.navigateByUrl('/principal');
        });
    }
  }

}
