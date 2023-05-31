function toggle(checked) {
    var elm = document.getElementById('nav-toggle');
    var width = window.innerWidth
    if (checked != elm.checked && width < 1000) {
      elm.click();
    }
}