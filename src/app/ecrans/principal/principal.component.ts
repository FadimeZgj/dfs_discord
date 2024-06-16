import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Serveur } from '../../models/serveur.type';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatFormField, MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Message } from '../../models/message.type';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    MatIconModule, 
    RouterLink, 
    MatTooltipModule, 
    MatListModule, 
    MatSelectModule, 
    MatFormField,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss',
})
export class PrincipalComponent {
  http: HttpClient = inject(HttpClient);
  listeServeur: Serveur[] = [];
  listeSalon: Serveur [] = [];
  routeServeur: ActivatedRoute = inject(ActivatedRoute)
  formBuilder: FormBuilder = inject(FormBuilder);
  route: ActivatedRoute = inject(ActivatedRoute)
  allMessages: Message[] = []
  idServeur?: string
  nomSalon?: string


  ngOnInit() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      this.http
        .get<Serveur[]>('http://localhost:3000/serveur/possede')
        .subscribe((listeServeur) => (this.listeServeur = listeServeur)
      );
    }

    this.route.url.subscribe(() => {
      this.getMessagesSalon();
    });

    //  this.getMessagesSalon();

  }

  getMessagesSalon(): void {
    const idServeur = this.route.snapshot.url[1]?.path;;
    const nomSalon = this.route.snapshot.url[2]?.path;;
    if (idServeur && nomSalon) {
      this.allMessages = []; // Effacer le contenu actuel
      this.http.get<Message[]>(`http://localhost:3000/serveur/${idServeur}/${nomSalon}/messages`)
        .subscribe((allMessages) => this.allMessages = allMessages);
    }
  
  }
 

  message: FormGroup = this.formBuilder.group({
    contenu: ['',[Validators.required]]
  });

  onEnvoiMessage() {
    const idServeur = this.route.snapshot.url[1];
    const nomSalon = this.route.snapshot.url[2];
    if (this.message.valid) {
      console.log(this.message.value)

      this.http
        .post(`http://localhost:3000/serveur/envoi-message/${idServeur}/${nomSalon}`  , this.message.value)
        .subscribe((nouveauMessage) => {
          this.getMessagesSalon(); 
          this.message.reset();
          //this.router.navigateByUrl('/principal');
        });
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onEnvoiMessage();
    }
  }
  
  
}