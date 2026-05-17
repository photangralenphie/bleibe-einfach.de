class SiteHeader extends HTMLElement {

    toggleNavbar(checked) {
        var elm = this.querySelector('#nav-toggle');
        var width = window.innerWidth
        if (checked != elm.checked && width < 1000) {
            elm.click();
        }
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav>
                    <input type="checkbox" id="nav-toggle" class="nav-toggle">
                    <label for="nav-toggle" class="nav-toggle-lable">
                        Men&uuml;
                        <img src="/bilder/bars-solid.svg" alt="menu button">
                    </label>
                    <div class="links">
                        <a href="/#unterkunft">Unterkunft</a>
                        <a href="/#ausstattung">Ausstattung</a>
                        <a href="/#reservierung">Reservierung</a>
                        <a href="/#preise">Preise</a>
                        <a href="/#anreise">Anreise</a>
                        <a href="/#umgebung">Umgebung</a>
                    </div>
                </nav>
                <div class="bild1">
                    <img src="/bilder/strassenschild.jpg" alt="Straßenschild der Straße 'An den Pferdnerkabeln'">
                </div>
                <div class="wege">
                    <p class="erster_weg"><a href="http://www.jakobswege-europa.de/wege/via-imperii.htm" target="_blank">Via Imperii Stettin-Hof</a></p>
                    <p class="zweiter_weg"><a href="https://www.radweg-berlin-leipzig.de/" target="_blank">Radweg Berlin-Leipzig</a></p>
                    <p class="dritter_weg"><a href="http://www.jakobswege-europa.de/wege/brandenburg.htm" target="_blank">Jakobsweg aus Brandenburg</a></p>
                    <p class="vierter_weg"><a href="https://www.lutherweg-sachsen.de/" target="_blank">Lutherweg in Sachsen</a></p>
                </div>
                <h1>"Bleibe - Einfach"</h1>
                <p class="untertitel">Unterkunft f&uuml;r Pilger und Radfahrer</p>
            </header>
        `

        this.querySelectorAll('.links a').forEach(link => 
            link.addEventListener('click', () => this.toggleNavbar(false))
        )
    }
}

customElements.define("site-header", SiteHeader)

