import { Injector } from "./injector";
import { Provider, Type } from "./typings";

export function Component(options: ComponentOptions) {
  return function (target: any) {
    target.ɵcmp = {
        selector: options.selector,
        providers: options.providers || [],
        styles: options.styles || [],
        template: options.template || "",
    };

    const customElementConstructor = class extends HTMLElement {
        private componentInjector!: Injector | null;
        private componentInstance: any;
        
        getParentInjector(): Injector | null {
            let parentNode = this.parentNode;
            while (parentNode) {
                if (parentNode instanceof HTMLElement && 'componentInjector' in parentNode)
                    return parentNode.componentInjector as Injector;
                parentNode = parentNode.parentNode;
            }
            return null;
        }
        
        connectedCallback() {
            const parentInjector = this.getParentInjector();   // Current injector must be of parent web component! NULL for root component
            if (target.ɵcmp.providers.length) { // create injector only if providers are included
                this.componentInjector = Injector.create(target.ɵcmp.providers, parentInjector);    // Create injector everytime webcomponent is instantiated
                Injector.setCurrentInjector(this.componentInjector);
            }
            else if (parentInjector) {
                Injector.setCurrentInjector(parentInjector);
            }
            this.componentInstance = new target();
            if (typeof this.componentInstance.onInit == "function") this.componentInstance.onInit();
            this.innerHTML = target.ɵcmp.template;
            if (typeof this.componentInstance.afterViewInit == "function") this.componentInstance.afterViewInit();
        }

        attributeChangedCallback() {
            if (typeof this.componentInstance.onChanges == "function") this.componentInstance.onChanges();
        }

        disconnectedCallback() {
            if (typeof this.componentInstance.onDestroy == "function") this.componentInstance.onDestroy();
            this.componentInstance = null;
            this.componentInjector = null;
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