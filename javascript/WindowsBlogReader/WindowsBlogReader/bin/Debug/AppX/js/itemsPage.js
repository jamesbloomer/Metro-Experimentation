(function () {
    "use strict";

    var ui = WinJS.UI;

    ui.Pages.define("/html/itemsPage.html", {

        itemInvoked: function (eventObject) {
            var group = data.groups.getAt(eventObject.detail.itemIndex);
            WinJS.Navigation.navigate("/html/splitPage.html", { group: group });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemslist").winControl;
            ui.setOptions(listView, {
                itemDataSource: data.groups.dataSource,
                itemTemplate: element.querySelector(".itemtemplate"),
                oniteminvoked: this.itemInvoked.bind(this),
            });
            this.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value);

            // Display the appbar but hide the Full View button
            var appbar = document.getElementById('appbar');
            var appbarCtrl = appbar.winControl;
            appbarCtrl.hideCommands(["view"], false);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            var listView = element.querySelector(".itemslist").winControl;
            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        }
    });
})();
