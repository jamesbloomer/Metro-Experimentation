(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/html/detailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // Display the appbar but hide the Full View button
            var appbar = document.getElementById('appbar');
            var appbarCtrl = appbar.winControl;
            appbarCtrl.hideCommands(["view"], false);

            var item = options && options.item ? options.item : data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.title;
            element.querySelector("article .item-content").innerHTML = item.content;
        }
    });
})();
