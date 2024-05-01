import { Component, inject, Input } from '@angular/core';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-offcanvas-content',
	standalone: true,
	template: `
		<div class="offcanvas-header">
			<h5 class="offcanvas-title">Change </h5>
		</div>
		<div class="offcanvas-body">
    <form>
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input type="text" class="form-control" id="username">
    </div>
    <div class="mb-3">
      <label for="desc" class="form-label">Description</label>
      <input type="text" class="form-control" id="desc">
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
    </div>
    <div class="mb-3">
      <label for="password1" class="form-label">New password</label>
      <input type="password" class="form-control" id="password1">
    </div>
    <div class="mb-3">
      <label for="password2" class="form-label">Repeat password</label>
      <input type="password" class="form-control" id="password2">
    </div>
    <div class="mb-3">
      <label for="password3" class="form-label">Old password</label>
      <input type="password" class="form-control" id="password3">
    </div>
    <button type="submit">Submit</button>
  </form>
		</div>
	`,
	styles: `
		/* Opening offcanvas as a component requires this style in order to scroll */
		:host {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
	`,
})
export class NgbdOffcanvasContent {
	activeOffcanvas = inject(NgbActiveOffcanvas);
}

@Component({
	selector: 'ngbd-offcanvas-component',
	standalone: true,
	templateUrl: './off-canvas.component.html',
  styleUrl: './off-canvas.component.css'
})
export class NgbdOffcanvasComponent {
	private offcanvasService = inject(NgbOffcanvas);

	open() {
		this.offcanvasService.open(NgbdOffcanvasContent);
	}
}
