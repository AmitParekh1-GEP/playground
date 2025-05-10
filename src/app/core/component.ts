import { Injector } from "./injector";
import { Provider, Type } from "./typings";

export function Component(options: ComponentOptions) {
  return function (target: any) {
    target.ɵcmp = {
        selector: options.selector,
        providers: options.providers || [],
        imports: options.imports || [],
        styles: options.styles || [],
        template: options.template || "",
    };
    
    const customElementConstructor = class extends HTMLElement {
        private componentInjector!: Injector;
        private componentInstance: any;

        constructor() {
            super();
            this.componentInjector = Injector.create(target.ɵcmp.providers, Injector.getCurrentInjector());
            Injector.setCurrentInjector(this.componentInjector);
            this.componentInstance = new target();
        }

        connectedCallback() {
            if (typeof this.componentInstance.onInit == "function") this.componentInstance.onInit();
            this.innerHTML = target.ɵcmp.template;
            if (typeof this.componentInstance.afterViewInit == "function") this.componentInstance.afterViewInit();
        }

        attributeChangedCallback() {
            if (typeof this.componentInstance.onChanges == "function") this.componentInstance.onChanges();
        }

        disconnectedCallback() {
            if (typeof this.componentInstance.onDestroy == "function") this.componentInstance.onDestroy();
        }
    }

    customElements.define(target.ɵcmp.selector, customElementConstructor);
  };
};

export interface ComponentOptions {
    selector: string;
    template?: string;
    styles?: Array<string>;
    providers?: Array<Provider>;
    imports?: Array<Type>;
}