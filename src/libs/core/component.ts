import { Injector } from "./injector";
import { ElementRef, Provider, Type } from "./typings";

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
        static observedAttributes: string[] = target.ɵinp || [];
        private componentInjector!: Injector | null;
        private componentInstance: any;
        
        private getParentInjector(): Injector | null {
            let parentNode = this.parentNode;
            while (parentNode) {
                if (parentNode instanceof HTMLElement && 'componentInjector' in parentNode)
                    return parentNode.componentInjector as Injector;
                parentNode = parentNode.parentNode;
            }
            return null;
        }

        private setCurrentInjector(): void {
            const parentInjector = this.getParentInjector();   // Search parent injector up the dom tree, null means to create root component injector
            if (target.ɵcmp.providers.length) { // create injector only if providers are included
                this.componentInjector = Injector.create(target.ɵcmp.providers, parentInjector);    // Create injector everytime webcomponent is instantiated
                Injector.setCurrentInjector(this.componentInjector);    // If provider supplier, make component injector as current injector 
            }
            else if (parentInjector) {
                Injector.setCurrentInjector(parentInjector);    // use parent injector to resolve dependencies
            }
        }
        
        connectedCallback() {
            this.setCurrentInjector();
            this.componentInstance = new target();  // instantiate component only after setting current injector
            if (typeof this.componentInstance.onInit == "function") this.componentInstance.onInit();
            this.innerHTML = target.ɵcmp.template;
            if (typeof this.componentInstance.afterViewInit == "function") this.componentInstance.afterViewInit(this);
        }

        attributeChangedCallback(name: string, oldValue: any, newValue: any) {
            if (!this.componentInstance) return;
            if (typeof this.componentInstance.onChanges == "function") this.componentInstance.onChanges({ [`${name}`]: {oldValue, newValue} });
        }

        disconnectedCallback() {
            if (!this.componentInstance) return;
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