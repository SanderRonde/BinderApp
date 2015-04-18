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

var settings = {};

chrome.app.runtime.onLaunched.addListener(function () {
	launchBinder();
});

chrome.runtime.onInstalled.addListener(function (details) {
	if (details.reason === "update") {
		//Display update message, so place it in storage and wait for the user to boot up the app
		chrome.storage.sync.set({ "newversion": "yep" });
	};
});

chrome.commands.onCommand.addListener(function (command) {
	console.log(command);
	switch (command) {
		case "launch_binder":
			launchBinder();
			break;
		default:
			var bindingNum = command.split("launch_binding_")[1];
			bindingNum = parseInt(bindingNum, 10);
			var websites = settings.websites;
			window.open(websites[bindingNum], "_blank");
			break;
	}
});

chrome.commands.getAll(function (commands) {
	for (var i = 0; i < commands.length; i++) {
		console.log(commands[i]);
	}
});

chrome.runtime.onMessage.addListener(function (message) {
	console.log(message);
	switch (message.cmd) {
		case "getKeyBindings":
			chrome.commands.getAll(function (commands) {
				console.log(commands);
				if (commands.length > 0) {
					chrome.runtime.sendMessage({ "keyBindings": commands });
				}
			});
			break;
	}
});