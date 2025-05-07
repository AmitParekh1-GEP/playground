import "./styles.scss";
import { inject, Injectable, Injector } from "./app/core";

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

class AppComponent extends HTMLElement {
    http = inject(HttpClient);

    connectedCallback() {
        this.http.get('https://api.example.com/data');
        this.innerHTML = `
            <h1>Hello, World!</h1>
            <p>Welcome to your first web component!</p>
        `;
    }
}

customElements.define('app-root', AppComponent);