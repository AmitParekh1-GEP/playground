export type Type<T = any> = new (...args: any[]) => T;

export type Provider = ClassProvider | ValueProvider;

export type ClassProvider = Type | { provide: Type; useClass: Type };
export type ValueProvider = { provide: Type; useValue: any };

export interface CustomElement {
    render(): string;
    onInit?(): void;
    afterViewInit?(el: ElementRef): void;
    onChanges?(changes: SimpleChange): void;
    onDestroy?(): void;
}

export interface SimpleChange {
    [key: string]: { oldValue: any, newValue: any };
}

export class ElementRef extends HTMLElement {}