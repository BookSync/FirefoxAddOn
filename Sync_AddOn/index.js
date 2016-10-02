var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var notifications = require("sdk/notifications");
var self = require("sdk/self");

var button = ToggleButton({
    id: "syncbutton",
	label: "Sync Bookmarks now",
	icon: {
      "16": "./syncUpdate.png",
      "32": "./syncUpdate.png",
      "64": "./syncUpdate.png"
	},
	onChange: handleChange
});

var panel = panels.Panel({
	contentURL: self.data.url("panel.html"),
	height: 100,
	width: 220,
	position: button,
	onHide: handleHide
});

function handleChange(state) {
	if( state.checked ) {
		panel.show({
			positon: button
		});
		console.log ("Start sync");
		//sync();
		/*notifications.notify({
			title: "Success!",
			text: "Your bookmarks were synced successfully."
		});*/
	}
}

function handleHide() {
	button.state('window', {checked: false});
}

var currentBookmark;			//bookmark
var currentServerItemUrl;		//url
var currentServerItemTitle;		//title

//helper function for sync
function onGot(bookmarkItems) {
	for(item of bookmarkItems) {
		currentBookmark = item;
		checkBookmark();
	}
}

/*
 * Sync bookmarks present in firefox and on server
 */
function sync() {
	//add any new bookmarks from server to firefox
	//recurse; set currentServerItemUrl, currentServerItemTitle & call func
	checkServerItem();

	//add any new bookmarks from firefox to server
	chrome.bookmarks.search({}, onGot);
}

/*
 * Checks if currentBookmark is already present on the server
 */
function checkBookmark() {
	//check if bookmark exists on server otherwise add it to server
}

/*
 * Checks if server item is already bookmarked, if not add it
 */
function checkServerItem() {
	
	chrome.bookmarks.search({url: currentServerItemUrl}, (bookmarks) => {
        if(bookmarks[0] == null) {
        	//bookmark doesn't exist
        	currentBookmark = bookmarks[0];
        	addBookmark();
        }
    });
}

/*
 * Adds a page from the server to the bookmarks if not present already
 */
function addBookmark() {
	chrome.bookmarks.create({
		title: currentServerItemTitle,
		url: currentServerItemUrl
	}, onBookmarkAdded );
}
