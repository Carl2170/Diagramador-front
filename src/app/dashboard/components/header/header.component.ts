import { Component } from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor (private router:Router){}

  toProfile(){
    this.router.navigate(['/profile']);
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['auth/login']);
  }
}