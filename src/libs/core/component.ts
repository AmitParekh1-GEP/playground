import { Injector } from "./injector";
import { Provider, Type } from "./typings";

export function Component(options: ComponentOptions) {
  return function (target: any) {
    target.ɵcmp = {
        selector: options.selector,
        providers: options.providers || [],
        imports: options.imports || []
    };

    const customElementConstructor = class extends HTMLElement {
        static observedAttributes: string[] = Array.from(Object.keys(target.ɵinp || {}));
        private componentInjector!: Injector | null;
        private componentInstance: any;
        private parentInjector = this.getParentInjector();
        private scope = this.getScope();
        
        /**
         * @returns {Injector | null} Search parent injector up the dom tree, null means its a root component injector
         */
        private getParentInjector(): Injector | null {
            let parentNode = this.parentNode;
            while (parentNode) {
                if (parentNode instanceof HTMLElement && 'componentInjector' in parentNode)
                    return parentNode.componentInjector as Injector;
                parentNode = parentNode.parentNode;
            }
            return null;
        }

        /**
         * @returns {any} Search parent component instance up the dom tree and use as scope
         */
        private getScope(): any {
            let parentNode = this.parentNode;
            while (parentNode) {
                if (parentNode instanceof HTMLElement && 'componentInstance' in parentNode)
                    return parentNode.componentInstance;
                parentNode = parentNode.parentNode;
            }
            return null;
        }

        /**
         * If providers is passed, create and set new injector referencing parent injector as current injector else set parent injector as current injector
         */
        private setCurrentInjector(): void {
            if (target.ɵcmp.providers.length) { // create injector only if providers are included
                this.componentInjector = Injector.create(target.ɵcmp.providers, this.parentInjector);    // Create injector everytime webcomponent is instantiated
                Injector.setCurrentInjector(this.componentInjector);    // If provider supplier, make component injector as current injector 
            }
            else if (this.parentInjector) {
                Injector.setCurrentInjector(this.parentInjector);    // use parent injector to resolve dependencies
            }
        }
        
        connectedCallback() {
            this.setCurrentInjector();
            this.componentInstance = new target();  // instantiate component only after setting current injector
            customElementConstructor.observedAttributes.forEach(attr => {
                if (!this.hasAttribute(attr)) return;
                this.attributeChangedCallback(attr, undefined, this.getAttribute(attr));
            });
            if (typeof this.componentInstance.onInit == "function") this.componentInstance.onInit();
            if (typeof this.componentInstance.render == "function") this.insertAdjacentHTML('beforeend', this.componentInstance.render());
            if (typeof this.componentInstance.afterViewInit == "function") this.componentInstance.afterViewInit(this);
        }

        attributeChangedCallback(name: string, oldValue: any, newValue: any) {
            if (!this.componentInstance) return;
            const property = target.ɵinp[name].property, 
                oldResolvedValue = target.ɵinp[name].isBinding && oldValue ? this.scope[oldValue] : this.componentInstance[property],   // scope will always reference to new changed value, ISSUE!!
                newResolvedValue = target.ɵinp[name].isBinding && newValue ? this.scope[newValue] : newValue;
            // resolve property first
            this.componentInstance[property] = newResolvedValue;    // new value should available into onChanges lifecycle hook
            if (typeof this.componentInstance.onChanges == "function") this.componentInstance.onChanges({ [`${property}`]: { oldValue: oldResolvedValue, newValue: newResolvedValue} });
        }

        disconnectedCallback() {
            if (!this.componentInstance) return;
            if (typeof this.componentInstance.onDestroy == "function") this.componentInstance.onDestroy();
            this.componentInstance = null;
            this.componentInjector = null;
            this.parentInjector = null;
            this.scope = null;
        }
    }

    customElements.define(target.ɵcmp.selector, customElementConstructor);
  };
};

export interface ComponentOptions {
    selector: string;
    providers?: Array<Provider>;
    imports?: Array<Type>;
}