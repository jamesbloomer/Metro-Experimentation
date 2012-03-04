(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/html/splitPage.html", {

        // This function checks if the list and details columns should be displayed
        // on separate pages instead of side-by-side.
        isSingleColumn: function () {
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            return (viewState === appViewState.snapped || viewState === appViewState.fullScreenPortrait);
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // Store information about the group and selection that this page will
            // display.
            this.group = (options && options.group) ? options.group : data.groups.getAt(0);
            this.items = data.getItemsFromGroup(this.group);
            this.itemSelectionIndex = (options && "selectedIndex" in options) ? options.selectedIndex : -1;
            element.querySelector("header[role=banner] .pagetitle").textContent = this.group.title;

            // Set up the ListView.
            var listView = element.querySelector(".itemlist").winControl;
            ui.setOptions(listView, {
                itemDataSource: this.items.dataSource,
                itemTemplate: element.querySelector(".itemtemplate"),
                onselectionchanged: this.selectionChanged.bind(this),
                layout: new ui.ListLayout()
            });

            var details = element.querySelector(".articlesection");
            this.updateVisibility();
            if (this.isSingleColumn()) {
                if (this.itemSelectionIndex >= 0) {
                    // For single-column detail view, load the article.
                    binding.processAll(details, this.items.getAt(this.itemSelectionIndex));
                }
            } else {
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/html/splitPage.html") {
                    // Clean up the backstack to handle a user snapping, navigating
                    // away, unsnapping, and then returning to this page.
                    nav.history.backStack.pop();
                }
                // If this page has a selectionIndex, make that selection
                // appear in the ListView.
                listView.selection.set(Math.max(this.itemSelectionIndex, 0));
            }
        },

        selectionChanged: function (eventObject) {
            var listView = document.body.querySelector(".itemlist").winControl;
            var that = this;
            // By default, the selection is restriced to a single item.
            listView.selection.getItems().then(function (items) {
                if (items.length > 0) {
                    that.itemSelectionIndex = items[0].index;
                    if (that.isSingleColumn()) {
                        // If snapped or portrait, navigate to a new page containing the
                        // selected item's details.
                        nav.navigate("/html/splitPage.html", { group: that.group, selectedIndex: that.itemSelectionIndex });
                    } else {
                        // If fullscreen or filled, update the details column with new data.
                        var details = document.querySelector(".articlesection");
                        binding.processAll(details, items[0].data);
                        details.scrollTop = 0;
                    }
                }
            })
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            var listView = element.querySelector(".itemlist").winControl;
            this.updateVisibility();

            if (this.isSingleColumn()) {
                listView.selection.clear();
                if (this.itemSelectionIndex >= 0) {
                    // If the app has snapped into a single-column detail view,
                    // add the single-column list view to the backstack.
                    nav.history.current.state = {
                        group: this.group,
                        selectedIndex: this.itemSelectionIndex
                    };
                    nav.history.backStack.push({
                        location: "/html/splitPage.html",
                        state: { group: this.group }
                    });
                }
            } else {
                // If the app has unsnapped into the two-column view, remove any
                // splitPage instances that got added to the backstack.
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/html/splitPage.html") {
                    nav.history.backStack.pop();
                }
                listView.selection.set(Math.max(this.itemSelectionIndex, 0));
            }
            listView.forceLayout();
        },

        // This function toggles visibility of the two columns based on the current
        // view state and item selection.
        updateVisibility: function () {
            var oldPrimary = document.querySelector(".primarycolumn");
            if (oldPrimary) {
                utils.removeClass(oldPrimary, "primarycolumn");
            }
            if (this.isSingleColumn()) {
                if (this.itemSelectionIndex >= 0) {
                    utils.addClass(document.querySelector(".articlesection"), "primarycolumn");
                } else {
                    utils.addClass(document.querySelector(".itemlistsection"), "primarycolumn");
                }
            }
        }
    });
})();
