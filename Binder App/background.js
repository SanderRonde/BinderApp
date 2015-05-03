function launchBinder() {
	chrome.app.window.create("window.html", {
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
}

var websites = [];

chrome.storage.sync.get("websites", function (items) {
	websites = items;
});

chrome.app.runtime.onLaunched.addListener(function () {
	launchBinder();
});

function launchWebsite() {
	var bindingNum = command.split("launch_binding_")[1];
	bindingNum = parseInt(bindingNum, 10);
	window.open(websites[bindingNum], "_blank");
}

chrome.commands.onCommand.addListener(function (command) {
	switch (command) {
		case "launch_binder":
			launchBinder();
			break;
		default:
			launchWebsite();
			break;
	}
});

function refreshWebsites() {
	chrome.Storage.sync.get("websites", function (items) {
		websites = items;
	});
}

chrome.runtime.onMessage.addListener(function (message) {
	switch (message.cmd) {
		case "getKeyBindings":
			chrome.commands.getAll(function (commands) {
				if (commands.length > 0) {
					chrome.runtime.sendMessage({ "keyBindings": commands });
				}
			});
			break;
		case "refreshWebsites":
			refreshWebsites();
			break;
	}
});