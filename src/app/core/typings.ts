export type Type<T = any> = new (...args: any[]) => T;

export type Provider = ClassProvider | ValueProvider;

export type ClassProvider = Type | { provide: Type; useClass: Type };
export type ValueProvider = { provide: Type; useValue: any };
