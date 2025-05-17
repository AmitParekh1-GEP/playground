import "./normalize.scss";
import "./theme.scss";
import "./styles.scss";
import styles from "./app/app.component.scss";
import { Component, inject, Injectable, Input } from "./libs/core";
import { CustomElement, ElementRef, SimpleChange } from "./libs/core/typings";

@Injectable()
class DataService {
    get(url: string) {
        console.log(`Fetching data from ${url}`);
        return `Data from ${url}`;
    }
}

@Injectable()
class HttpClient {
    dataService = inject(DataService);
    
    get(url: string) {
        return this.dataService.get('https://api.example.com/data');
    }
}

@Injectable()
class HttpClientTest {
    dataService = inject(DataService);
    
    get(url: string) {
        return this.dataService.get('https://api.test.com/data');
    }
}

@Component({
    selector: "app-button"
})
class ButtonComponent implements CustomElement {
    http = inject(HttpClient);

    @Input() type: string = "hello";
    @Input() content: string = "hello";

    render(): string {
        return /* html */`<button type="button">${this.content}</button>`;
    }

    onInit(): void {
        console.log(this.type, this.content);
        this.http.get("");
    }

    onChanges(changes: SimpleChange): void {
        console.log(changes);
    }
}

@Component({
    selector: "app-header",
    providers: [
        { provide: HttpClient, useClass: HttpClientTest }
    ],
    imports: [ButtonComponent]
})
class HeaderComponent implements CustomElement {
    onInit(): void {
        console.log(this.render());
    }

    content = {
        logo: "Hello world",
        menuButtons: ["Home", "About", "Contact"],
        navButtons: ["Login", "Search"]
    };

    hello = "world";

    
    render(): string {
        const buttonTemplate = (button: string) => /* html */`<app-button type="button" content="${button}"></app-button>`;
        return /* html */`<p>Header Component!</p> <p>${this.hello}</p> ${
            this.content.navButtons.reduce((result, button) => result + buttonTemplate(button), "")
        }`;
    }

    afterViewInit(el: ElementRef): void {
        el.querySelector('app-button')?.setAttribute('type', 'link');
    }
}

@Component({
    selector: "app-left-nav"
})
class LeftNavComponent implements CustomElement {
    http = inject(HttpClient);

    render(): string {
        return /* html */`<p>LeftNav component!</p>`;
    }

    onInit(): void {
        this.http.get("");
    }
}

@Component({
    selector: 'app-root',
    providers: [HttpClient, DataService],
    imports: [HeaderComponent, LeftNavComponent]
})
export class AppComponent implements CustomElement {
    onInit(): void {}

    render(): string {
        console.log(styles)
        return /* html */`
            <app-header></app-header>
            <h1 class="${styles.title}">Hello, World!</h1>
            <p class="${styles.header}">Welcome to your first web component!</p>
            <app-left-nav></app-left-nav>
        `;
    }
}