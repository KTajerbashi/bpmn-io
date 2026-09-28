import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type { ImportDoneEvent, ImportXMLError, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [],
  templateUrl: './designer.html',
  styleUrl: './designer.scss',
})
export class Designer implements AfterViewInit, OnChanges, OnDestroy {
  private readonly http = inject(HttpClient);

  @ViewChild('ref', { static: true })
  private readonly elementRef!: ElementRef<HTMLDivElement>;

  @Input()
  url?: string;

  @Output()
  readonly importDone = new EventEmitter<ImportDoneEvent>();

  /**
   * BPMN modeler is created only in the browser.
   */
  private bpmnJS?: BpmnModeler;

  private initialized = false;

  constructor() {
    /**
     * afterNextRender runs only in the browser after Angular
     * has rendered the component.
     *
     * This prevents bpmn-js from being instantiated during SSR.
     */
    afterNextRender(() => {
      this.initializeModeler();
    });
  }

  ngAfterViewInit(): void {
    // Intentionally empty.
    //
    // Modeler initialization is handled by afterNextRender().
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['url']) {
      return;
    }

    const url = changes['url'].currentValue as string | undefined;

    if (!url || !this.initialized) {
      return;
    }

    void this.loadUrl(url);
  }

  ngOnDestroy(): void {
    this.bpmnJS?.destroy();
    this.bpmnJS = undefined;
    this.initialized = false;
  }

  /**
   * Initialize BPMN modeler in the browser.
   */
  private initializeModeler(): void {
    if (this.bpmnJS || !this.elementRef?.nativeElement) {
      return;
    }

    this.bpmnJS = new BpmnModeler({
      container: this.elementRef.nativeElement,
    });

    this.bpmnJS.on<ImportDoneEvent>('import.done', (event: ImportDoneEvent) => {
      if (!event.error) {
        const canvas = this.bpmnJS?.get<Canvas>('canvas');

        canvas?.zoom('fit-viewport');
      }

      this.importDone.emit(event);
    });

    this.initialized = true;

    if (this.url) {
      void this.loadUrl(this.url);
    }
  }

  /**
   * Load BPMN XML from URL and import it into the modeler.
   */
  async loadUrl(url: string): Promise<ImportXMLResult | undefined> {
    if (!this.bpmnJS) {
      return undefined;
    }

    try {
      const xml = await firstValueFrom(
        this.http.get(url, {
          responseType: 'text',
        }),
      );

      return await this.importDiagram(xml);
    } catch (error: unknown) {
      this.importDone.emit({
        error: this.toImportXMLError(error),
        warnings: [],
      });

      return undefined;
    }
  }

  /**
   * Convert unknown errors to ImportXMLError.
   */
  private toImportXMLError(error: unknown): ImportXMLError {
    if (error instanceof Error) {
      return error as ImportXMLError;
    }

    return new Error(String(error)) as ImportXMLError;
  }

  /**
   * Import BPMN XML into the current modeler.
   */
  private async importDiagram(xml: string): Promise<ImportXMLResult> {
    if (!this.bpmnJS) {
      throw new Error('BPMN modeler has not been initialized.');
    }

    return this.bpmnJS.importXML(xml);
  }

  /**
   * Expose the underlying BPMN modeler if needed.
   */
  getModeler(): BpmnModeler | undefined {
    return this.bpmnJS;
  }
}
