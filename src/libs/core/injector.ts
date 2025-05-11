import { Provider, Type } from "./typings";

export class Injector {
    private static _current: Injector | null = null;
    private _records: Map<Type, any> = new Map();    // Ideally key has to be Injection Token
    private _instances: Map<Type, any> = new Map();
    private _resolving: Set<Type> = new Set();  // To check circular dependency

    constructor(
        private readonly _providers: Array<Provider>,
        private readonly _parent: Injector | null = null
    ) {
        this.register({ provide: Injector, useValue: this });
        this._providers.forEach(this.register.bind(this));
    }

    public static getCurrentInjector(): Injector | null {
        return Injector._current;
    }

    public static setCurrentInjector(injector: Injector): void {
        Injector._current = injector;
    }

    public static create(providers: Array<Provider>, parent: Injector | null): Injector {
        return new Injector(providers, parent);
    }

    public register(provider: Provider): void {
        const token = typeof provider === 'function' ? provider : provider.provide;
        if (this._records.has(token)) {
            throw new Error(`Provider already registered: ${provider}`);
        }
        if (typeof provider === 'function')
            this._records.set(token, provider);
        if (typeof provider === 'object') {
            if ('useClass' in provider) 
                this._records.set(token, provider.useClass);
            else if ('useValue' in provider)
                this._records.set(token, provider.useValue);
        }
    }

    public get<T>(token: Type<T>): T {
        const provider = this._records.get(token);

        if (!provider) {
            if (this._parent) return this._parent.get<T>(token);
            else throw new Error(`No provider found for ${token.name}`);
        }
        if (this._instances.has(token)) {
            return this._instances.get(token);
        }
        if (this._resolving.has(token)) {
            throw new Error(`Circular dependecy detected!`);
        }
        if (typeof provider === 'function') {
            this._resolving.add(token);
            const instance = new provider();    // Assuming no dependencies passed into constructor and only inject function is used
            this._instances.set(token, instance);
            this._resolving.delete(token);
            return instance;
        }
        return provider;    // Return the provider directly as value if it's not a function
    }
}

export function inject<T>(token: Type<T>): T {
    const injector = Injector.getCurrentInjector();
    if (!injector) throw new Error(`Null injector error.`);
    return injector.get<T>(token);
}