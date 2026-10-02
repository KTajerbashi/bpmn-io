import { ComponentType } from '@angular/cdk/overlay';
import { Injectable, inject } from '@angular/core';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogRef
} from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private readonly dialog = inject(MatDialog);

    open<T>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T> {
        return this.dialog.open(component, config);
    }
}