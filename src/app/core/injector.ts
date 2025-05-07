import { Provider, Type } from "./typings";

export class Injector {
    private static _current: Injector;
    private _providers: Map<Type, any>;    // Ideally key has to be Injection Token
    private _instances: Map<Type, any>;

    private constructor() {
        this._providers = new Map();
        this._instances = new Map();
    }

    public static getInstance(): Injector {
        if (!Injector._current) {
            Injector._current = new Injector();
        }
        return Injector._current;
    }

    public register(provider: Provider): void {
        const token = typeof provider === 'function' ? provider : provider.provide;
        if (this._providers.has(token)) {
            throw new Error(`Provider already registered: ${provider}`);
        }
        if (typeof provider === 'function')
            this._providers.set(token, provider);
        if (typeof provider === 'object') {
            if ('useClass' in provider) 
                this._providers.set(token, provider.useClass);
            else if ('useValue' in provider)
                this._providers.set(token, provider.useValue);
        }
    }

    public get<T>(token: Type<T>): T {
        const provider = this._providers.get(token);
        if (!provider) {
            throw new Error(`No provider found for ${token}`);
        }
        if (this._instances.has(token)) {
            return this._instances.get(token);
        }
        if (typeof provider === 'function') {
            const instance = new provider();    // Assuming no dependencies passed into constructor and only inject function is used
            this._instances.set(token, instance);
            return instance;
        }
        return provider;    // Return the provider directly as value if it's not a function
    }
}

export function inject<T>(token: Type<T>): T {
    const injector = Injector.getInstance();
    return injector.get<T>(token);
}