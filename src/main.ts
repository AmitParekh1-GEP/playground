import "./styles.scss";

class AppComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <h1>Hello, World!</h1>
            <p>Welcome to your first web component!</p>
        `;
    }
}

customElements.define('app-root', AppComponent);