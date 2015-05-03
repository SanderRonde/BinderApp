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
		websites = items.websites;
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

function checkSettingsValidity(obj) {
	if (!isset(obj.colors)) {
		obj.colors = {
			"bg": "#3C92FF",
			"title": "#FFFFFF",
			"text": "#FFFFFF"
		};
	}
	if (!isset(obj.bindings)) {
		obj.bindings = [""];
	}
	if (!isset(obj.websites)) {
		obj.websites = [""];
	}
	if (!isset(obj.shortcuts)) {
		obj.shortcuts = [""];
	}
	var websitesAmount = obj.websites.length;
	var bindingsAmount = obj.bindings.length;
	var shortcutsAmount = obj.shortcuts.length;
	var i;
	if (bindingsAmount > websitesAmount) {
		for (i = 0; i < (bindingsAmount - websitesAmount) ; i++) {
			obj.bindings.push("");
		}
	}
	else if (bindingsAmount < websitesAmount) {
		for (i = 0; i < (websitesAmount - bindingsAmount) ; i++) {
			obj.websites.push("");
		}
	}
	if (shortcutsAmount !== bindingsAmount) {
		if (shortcutsAmount > bindingsAmount) {
			var newShortcuts = [];
			for (i = 0; i < bindingsAmount; i++) {
				newShortcuts.push(obj.shortcuts[i]);
			}
			obj.shortcuts = newShortcuts;
		}
		else {
			for (i = shortcutsAmount; i < bindingsAmount; i++) {
				obj.shortcuts.push("");
			}
		}
	}
	if (!isset(obj.closeBinder)) {
		obj.closeBinder = true;
	}
	if (!isset(obj.superSearch)) {
		obj.superSearch = false;
	}

	if (!isset(obj.keyBindings)) {
		obj.keyBindings = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
	}
	else {
		if (obj.keyBindings.length !== 50) {
			obj.keyBindings = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
		}
	}
	websites = obj.websites;
	chrome.storage.sync.set(obj);
}

function upgradeBinderVersion(settings) {
	var oldBindings = settings.binding;
	var bindings = [];
	var urls = [];
	var emptyArray = [];
	var oldBindingsSplit;
	for (var i = 0; i < oldBindings.length; i++) {
		oldBindingsSplit = oldBindings[i].split("%123");
		bindings.push(oldBindingsSplit[0]);
		urls.push(oldBindingsSplit[1]);
		emptyArray.push("");
	}
	var oldColors = settings.colors;

	oldColors.bg = "#" + oldColors.bg.replace("#", "");
	oldColors.title = "#" + oldColors.title.replace("#", "");
	var closeAfterBindings = (settings.exitafter === "1" || settings.exitafter === 1);
	var superSearch = (settings.supasearch !== "no");

	//Clear old settings
	chrome.storage.sync.clear(function () {
		//Create a new settings container object
		var newSettings = {
			"bindings": bindings,
			"websites": urls,
			"color": {
				"bg": oldColors.bg,
				"title": oldColors.title,
				"text": "#FFFFFF"
			},
			"set": true,
			"shortcuts": emptyArray,
			"keyBindings": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
			"closeBinder": closeAfterBindings,
			"superSearch": superSearch
		};

		checkAndUploadSettings(newSettings);
	});
}

chrome.runtime.onInstalled.addListener(function () {
	//Check if people are coming from the old Binder App
	chrome.storage.sync.get(function (items) {
		if (items.firstrun !== undefined) {
			//Yep
			upgradeBinderVersion(items);
		}
	});
});