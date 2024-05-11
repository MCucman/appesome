import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, NgbModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(protected userService: UserService){}


}


