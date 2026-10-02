import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import type Canvas from 'diagram-js/lib/core/Canvas';
import type CommandStack from 'diagram-js/lib/command/CommandStack';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type Selection from 'diagram-js/lib/features/selection/Selection';

import { TEMPLATE } from './configuration';
import { DialogService } from '../../core/services/dialog.service';
import { DiagramList } from './dialogs/diagram-list/diagram-list';

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [],
  templateUrl: './designer.html',
  styleUrl: './designer.scss',
})
export class Designer implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLDivElement>;
  private modeler?: BpmnModeler;
  private canvasService?: Canvas;
  private commandStack?: CommandStack;
  private eventBus?: EventBus;
  private selection?: Selection;
  /**
   * Indicates whether the diagram has unsaved changes.
   */
  public isDirty = false;

  /**
   * Indicates whether BPMN modeler is ready.
   */
  public isReady = false;

  /**
   * Indicates whether the designer is currently in edit mode.
   */
  public isEditing = true;

  /**
   * Current zoom level.
   */
  public zoomLevel = 1;

  private readonly dialogService = inject(DialogService);

  constructor() {

    afterNextRender(() => {
      void this.initializeModeler();
    });

  }

  // =========================================================
  // Angular lifecycle
  // =========================================================

  ngAfterViewInit(): void {
    // Initialization is intentionally handled by afterNextRender.
  }

  ngOnDestroy(): void {

    this.destroyModeler();

  }

  onLoadDiagrams() {
    console.log('[onLoadDiagrams]')
    const dialogRef = this.dialogService.open(
      DiagramList,
      {
        width: '600px',
        data: {
          title: 'Hello'
        }
      }
    );
    console.log('dialogRef', dialogRef)
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log('Dialog result:', result);
      }

    });
  }

  // =========================================================
  // Initialization
  // =========================================================

  private async initializeModeler(): Promise<void> {

    if (this.modeler) {
      return;
    }

    const container = this.canvas?.nativeElement;

    if (!container) {

      console.error(
        'BPMN canvas element was not found.'
      );

      return;
    }

    try {

      this.modeler = new BpmnModeler({
        container,
      });

      this.initializeServices();

      this.registerEvents();

      await this.createNewDiagram();

      this.isReady = true;

      console.info(
        'BPMN modeler initialized successfully.'
      );

    } catch (error) {

      console.error(
        'Failed to initialize BPMN modeler:',
        error
      );

      this.isReady = false;

    }

  }

  // =========================================================
  // BPMN Services
  // =========================================================

  private initializeServices(): void {

    if (!this.modeler) {
      return;
    }

    this.canvasService =
      this.modeler.get('canvas') as Canvas;

    this.commandStack =
      this.modeler.get('commandStack') as CommandStack;

    this.eventBus =
      this.modeler.get('eventBus') as EventBus;

    this.selection =
      this.modeler.get('selection') as Selection;

  }

  // =========================================================
  // Events
  // =========================================================

  private registerEvents(): void {

    if (!this.eventBus) {
      return;
    }

    /*
     * Any command executed inside BPMN.
     */
    this.eventBus.on(
      'commandStack.changed',
      () => {

        this.isDirty = true;

        this.updateZoomLevel();

      }
    );

    /*
     * Element selected.
     */
    this.eventBus.on(
      'selection.changed',
      (event: any) => {

        const selection =
          event.newSelection ?? [];

        if (selection.length) {

          const element =
            selection[0];

          console.debug(
            'Selected BPMN element:',
            element
          );

        }

      }
    );

    /*
     * Element created.
     */
    this.eventBus.on(
      'shape.added',
      (event: any) => {

        console.debug(
          'BPMN element added:',
          event.element
        );

      }
    );

    /*
     * Element removed.
     */
    this.eventBus.on(
      'shape.removed',
      (event: any) => {

        console.debug(
          'BPMN element removed:',
          event.element
        );

      }
    );

    /*
     * Connection created.
     */
    this.eventBus.on(
      'connection.added',
      (event: any) => {

        console.debug(
          'BPMN connection added:',
          event.connection
        );

      }
    );

  }

  // =========================================================
  // Diagram
  // =========================================================

  private async createNewDiagram(): Promise<void> {

    if (!this.modeler) {
      return;
    }

    try {

      const result =
        await this.modeler.importXML(TEMPLATE);

      if (result.warnings?.length) {

        console.warn(
          'BPMN import warnings:',
          result.warnings
        );

      }

      this.fitViewport();

      this.isDirty = false;

      this.updateZoomLevel();

    } catch (error) {

      console.error(
        'Failed to import BPMN diagram:',
        error
      );

    }

  }

  // =========================================================
  // New
  // =========================================================

  public async newDiagram(): Promise<void> {

    if (!this.modeler) {
      return;
    }

    if (this.isDirty) {

      const confirmed =
        window.confirm(
          'The current diagram contains unsaved changes. Create a new diagram anyway?'
        );

      if (!confirmed) {
        return;
      }

    }

    await this.createNewDiagram();

  }

  // =========================================================
  // Reset
  // =========================================================

  public async reset(): Promise<void> {

    if (!this.modeler) {
      return;
    }

    const confirmed =
      window.confirm(
        'Reset the current diagram to its initial state?'
      );

    if (!confirmed) {
      return;
    }

    await this.createNewDiagram();

  }

  // =========================================================
  // Edit
  // =========================================================

  public edit(): void {

    if (!this.modeler) {
      return;
    }

    this.isEditing = true;

    this.canvas?.nativeElement.focus();

    console.info(
      'BPMN editor mode enabled.'
    );

  }

  // =========================================================
  // Save
  // =========================================================
  public onLoadTemplates() {
    console.log('[onLoadTemplates]');
  }

  // =========================================================
  // Save
  // =========================================================

  public async save(): Promise<void> {
    if (!this.modeler) {
      console.error('BPMN modeler is not initialized.');
      return;
    }

    try {
      const result = await this.modeler.saveXML({ format: true, });
      const xml = result.xml;
      if (!xml) {
        console.error('BPMN XML is empty.');
        return;
      }
      console.log('BPMN XML:', xml);
      /*
       * TODO:
       *
       * Send XML to backend.
       *
       * Example:
       *
       * await firstValueFrom(
       *   this.http.put(
       *     '/api/processes/123/bpmn',
       *     xml
       *   )
       * );
       */

      this.isDirty = false;
      console.info('BPMN diagram saved successfully.');

    } catch (error) {
      console.error('Failed to save BPMN:', error);
    }
  }

  // =========================================================
  // Save As
  // =========================================================

  public async saveAs(): Promise<void> {

    if (!this.modeler) {
      return;
    }

    try {

      const result =
        await this.modeler.saveXML({
          format: true,
        });

      const xml =
        result.xml;

      if (!xml) {
        return;
      }

      const blob =
        new Blob(
          [xml],
          {
            type: 'application/xml',
          }
        );

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement('a');

      anchor.href = url;

      anchor.download =
        `process-${this.getTimestamp()}.bpmn`;

      anchor.click();

      URL.revokeObjectURL(url);

      console.info(
        'BPMN diagram exported successfully.'
      );

    } catch (error) {

      console.error(
        'Failed to export BPMN:',
        error
      );

    }

  }

  // =========================================================
  // Export SVG
  // =========================================================

  public async exportSvg(): Promise<void> {

    if (!this.modeler) {
      return;
    }

    try {

      const result =
        await this.modeler.saveSVG();

      const svg =
        result.svg;

      if (!svg) {
        return;
      }

      const blob =
        new Blob(
          [svg],
          {
            type: 'image/svg+xml',
          }
        );

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement('a');

      anchor.href = url;

      anchor.download =
        `process-${this.getTimestamp()}.svg`;

      anchor.click();

      URL.revokeObjectURL(url);

    } catch (error) {

      console.error(
        'Failed to export SVG:',
        error
      );

    }

  }

  // =========================================================
  // Undo
  // =========================================================

  public undo(): void {

    if (!this.commandStack) {
      return;
    }

    if (!this.commandStack.canUndo()) {
      return;
    }

    this.commandStack.undo();

  }

  // =========================================================
  // Redo
  // =========================================================

  public redo(): void {

    if (!this.commandStack) {
      return;
    }

    if (!this.commandStack.canRedo()) {
      return;
    }

    this.commandStack.redo();

  }

  // =========================================================
  // Zoom In
  // =========================================================

  public zoomIn(): void {

    if (!this.canvasService) {
      return;
    }

    const current =
      this.canvasService.zoom();

    this.canvasService.zoom(
      Math.min(
        current * 1.2,
        4
      )
    );

    this.updateZoomLevel();

  }

  // =========================================================
  // Zoom Out
  // =========================================================

  public zoomOut(): void {

    if (!this.canvasService) {
      return;
    }

    const current =
      this.canvasService.zoom();

    this.canvasService.zoom(
      Math.max(
        current / 1.2,
        0.2
      )
    );

    this.updateZoomLevel();

  }

  // =========================================================
  // Fit viewport
  // =========================================================

  public fitViewport(): void {

    if (!this.canvasService) {
      return;
    }

    this.canvasService.zoom(
      'fit-viewport'
    );

    this.updateZoomLevel();

  }

  // =========================================================
  // Reset zoom
  // =========================================================

  public resetZoom(): void {

    if (!this.canvasService) {
      return;
    }

    this.canvasService.zoom(1);

    this.updateZoomLevel();

  }

  // =========================================================
  // Selection
  // =========================================================

  public clearSelection(): void {

    if (!this.selection) {
      return;
    }

    this.selection.select([]);

  }

  // =========================================================
  // Get XML
  // =========================================================

  public async getXml(): Promise<string | null> {

    if (!this.modeler) {
      return null;
    }

    try {

      const result =
        await this.modeler.saveXML({
          format: true,
        });

      return result.xml ?? null;

    } catch (error) {

      console.error(
        'Failed to generate BPMN XML:',
        error
      );

      return null;

    }

  }

  // =========================================================
  // Get SVG
  // =========================================================

  public async getSvg(): Promise<string | null> {

    if (!this.modeler) {
      return null;
    }

    try {

      const result =
        await this.modeler.saveSVG();

      return result.svg ?? null;

    } catch (error) {

      console.error(
        'Failed to generate BPMN SVG:',
        error
      );

      return null;

    }

  }

  // =========================================================
  // Destroy
  // =========================================================

  private destroyModeler(): void {

    if (!this.modeler) {
      return;
    }

    try {

      this.modeler.destroy();

    } catch (error) {

      console.error(
        'Failed to destroy BPMN modeler:',
        error
      );

    }

    this.modeler = undefined;

    this.canvasService = undefined;

    this.commandStack = undefined;

    this.eventBus = undefined;

    this.selection = undefined;

    this.isReady = false;

  }

  // =========================================================
  // Helpers
  // =========================================================

  private updateZoomLevel(): void {

    if (!this.canvasService) {
      return;
    }

    const zoom =
      this.canvasService.zoom();

    if (typeof zoom === 'number') {

      this.zoomLevel =
        Math.round(
          zoom * 100
        );

    }

  }

  private getTimestamp(): string {

    const now =
      new Date();

    return now
      .toISOString()
      .replace(
        /[:.]/g,
        '-'
      );

  }

}