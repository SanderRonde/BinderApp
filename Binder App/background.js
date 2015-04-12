chrome.app.runtime.onLaunched.addListener(function() {
  var windowone = chrome.app.window.create('window.html', {
    bounds: {
      width: 500,
      height: 100,
      left: 100,
      top: 500
    },
	id: "mainwindow",
    minWidth: 500,
    minHeight: 60,
	maxWidth: 1000,
	maxHeight: 755,
	frame: "none",
	resizable: false
  });
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "update") {
        //Display update message, so place it in storage and wait for the user to boot up the app
        chrome.storage.sync.set({ "newversion": "yep" });
    };
});