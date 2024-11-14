import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ng-button',
  standalone: true,
  imports: [],
  templateUrl: './ng-button.component.html',
  styleUrls: ['./ng-button.component.css'],
})
export class NgButtonComponent {
  // Define inputs for customizing the button
  buttonText = input('Button'); // Default text if none is provided
  buttonType = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);

  // Output event to emit click events to the parent component
  buttonClick = output();

  // Method to emit click events
  onClick() {
    if (!this.disabled()) {
      this.buttonClick.emit();
    }
  }
}
