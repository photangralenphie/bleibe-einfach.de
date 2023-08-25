var dt = new Date();
document.getElementById("year").innerHTML = dt.getFullYear();

function loadMaps() {
    document.getElementById("myframe").src = "";
}

function loadCalender() {
    document.getElementById("loadCalender").innerHTML = "<iframe id="loadCalender" src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=Europe%2FBerlin&amp;src=ajJvcXZqOW9mZm1ndTFnNXJxNjlybWw1dTRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%23D81B60&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0" ></iframe>"