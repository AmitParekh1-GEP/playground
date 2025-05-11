import "./styles.scss";
import { Component, inject, Injectable } from "./app/core";
import { OnInit } from "./app/core/typings";

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
    selector: "app-button",
    template: `<button type="button">Login</button>`
})
class ButtonComponent implements OnInit {
    http = inject(HttpClient);

    onInit(): void {
        this.http.get("");
    }
}

@Component({
    selector: "app-header",
    template: `<p>Header component! <app-button></app-button></p>`,
    providers: [
        { provide: HttpClient, useClass: HttpClientTest }
    ]
})
class HeaderComponent implements OnInit {
    onInit(): void {}
}

@Component({
    selector: "app-left-nav",
    template: `<p>LeftNav component!</p>`,
})
class LeftNavComponent implements OnInit {
    http = inject(HttpClient);

    onInit(): void {
        this.http.get("");
    }
}

@Component({
    selector: 'app-root',
    template: `
        <app-header></app-header>
        <h1>Hello, World!</h1>
        <p>Welcome to your first web component!</p>
        <app-left-nav></app-left-nav>
    `,
    providers: [HttpClient, DataService]
})
class AppComponent implements OnInit {
    onInit(): void {}
}