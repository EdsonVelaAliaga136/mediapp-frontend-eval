import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuService } from 'src/app/service/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  username: string;
  rol: string;

  constructor(
    private menuService: MenuService
  ){}

  ngOnInit(): void {
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    console.log(decodedToken);
    this.username = decodedToken.sub;
    this.rol = decodedToken.role;
    //this.username = decodedToken.preferred_username;

  }

}
