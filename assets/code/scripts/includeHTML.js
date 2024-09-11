/**
 * Includes HTML content into elements with the `w3-include-html` attribute.
 * This function performs the following tasks:
 * - Iterates over all elements with the `w3-include-html` attribute.
 * - Fetches the HTML content specified in the attribute value.
 * - Replaces the inner HTML of the element with the fetched content.
 * - Handles errors by displaying "Page not found." if the file is not found.
 * - Recursively processes any nested elements with the `w3-include-html` attribute.
 */
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

includeHTML();
