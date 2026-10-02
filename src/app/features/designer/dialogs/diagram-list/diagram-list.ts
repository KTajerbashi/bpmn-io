import { Component } from '@angular/core';
import { DialogContainer } from '../../../../shared/components/dialog-container/dialog-container';
import { DialogHeader } from '../../../../shared/components/dialog-container/dialog-header/dialog-header';
import { DialogContent } from '../../../../shared/components/dialog-container/dialog-content/dialog-content';
import { DialogFooter } from '../../../../shared/components/dialog-container/dialog-footer/dialog-footer';

@Component({
  imports: [DialogContainer, DialogHeader, DialogContent, DialogFooter],
  selector: 'app-diagram-list',
  styleUrl: './diagram-list.scss',
  templateUrl: './diagram-list.html',
})
export class DiagramList {}
