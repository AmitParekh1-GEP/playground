export type Type<T = any> = new (...args: any[]) => T;

export type Provider = ClassProvider | ValueProvider;

export type ClassProvider = Type | { provide: Type; useClass: Type };
export type ValueProvider = { provide: Type; useValue: any };

export interface OnInit { onInit(): void; }
export interface AfterViewInit { afterViewInit(el: ElementRef): void; }
export interface OnChanges { onChanges(changes: SimpleChange): void; }
export interface OnDestroy { onDestroy(): void; }

export interface SimpleChange {
    [key: string]: { oldValue: any, newValue: any };
}

export class ElementRef extends HTMLElement {}