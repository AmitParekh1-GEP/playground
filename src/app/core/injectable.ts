import { Injector } from "./injector";

export function Injectable(options?: InjectableOptions) {
  return function (target: any) {
    target.ɵprov = {
      // token: target,
      providedIn: options?.providedIn || 'root',
      // factory: () => new target(),
    };
    Injector.getInstance().register(target);
  };
};

interface InjectableOptions {
    providedIn?: 'root';
    deps?: any[];
}