import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdOffcanvasComponent, NgbdOffcanvasContent } from '../off-canvas/off-canvas.component';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, NgbModule, NgbdOffcanvasComponent, NgbdOffcanvasContent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}


