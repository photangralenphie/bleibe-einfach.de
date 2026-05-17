class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>&#169; 2019 - 2026 bleibe-einfach.de</p>
                <a href="/index.html#">Home</a>
                <a href="/impressum.html">Impressum</a>
                <a href="/datenschutz.html">Datenschutzerkl&auml;rung</a>
                <a href="https://mein.manitu.de/webhosting/site/100012231/">Login</a>
            </footer>
        `
    }
}

customElements.define("site-footer", SiteFooter)