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

chrome.app.runtime.onLaunched.addListener(function () {
	launchBinder();
});

function launchWebsite(command, websites, shortcuts) {
	var bindingNum = command.split("launch_binding_")[1];
	bindingNum = parseInt(bindingNum, 10);
	window.open(websites[shortcuts.indexOf(bindingNum)], "_blank");
}

chrome.commands.onCommand.addListener(function (command) {
	switch (command) {
		case "launch_binder":
			launchBinder();
			break;
		default:
			chrome.storage.sync.get(function (items) {
				launchWebsite(command, items.websites, items.shortcuts);
			});
			break;
	}
});

chrome.runtime.onMessage.addListener(function (message) {
	switch (message.cmd) {
		case "getKeyBindings":
			chrome.commands.getAll(function (commands) {
				if (commands.length > 0) {
					chrome.runtime.sendMessage({ "keyBindings": commands });
				}
			});
			break;
	}
});