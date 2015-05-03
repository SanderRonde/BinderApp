var storage = chrome.storage.sync;
var app = chrome.app.window.current();
var settings = {};
var searchWebsites = [];
var searchMode = false;
var keyBindingsToSet = [];
var keyBindingsToSetNum = [];
var keyBindingCallback = function () {
};
var searchEngineImportExpanded = false;
var searchWorker = undefined;

function isset(dataToCheck) {
	if (dataToCheck === undefined || dataToCheck === null) {
		return false;
	}
	return true;
}

function sendUpdateWebsitesMessage() {
	chrome.runtime.sendMessage({ cmd: "refreshWebsites" });
}

function updateSettings(key, data) {
	var obj = {};
	if (key !== null) {
		if (typeof key === "object") {
			for (var objKey in key) {
				if (key.hasOwnProperty(objKey)) {
					obj = {};
					if (objKey === "websites") {
						sendUpdateWebsitesMessage();
					}
					obj[objKey] = key[objKey];
					storage.set(obj);
					settings[objKey] = key[objKey];
				}
			}
		}
		else {
			if (key === "websites") {
				sendUpdateWebsitesMessage();
			}
			obj[key] = data;
			storage.set(obj);
			settings[key] = data;
		}
	}
}

function performBlackMagic(arrayOfObjectsInQuantumState) {
	//it's a mystery what happens here... if i pass this data along by itself entry 2 of the array wil simply disappear so i'm going to have to copy it
	var copy = [];
	for (var i = 0; i < arrayOfObjectsInQuantumState.length; i++) {
		copy[i] = arrayOfObjectsInQuantumState[i];
	}
	return copy;
}

chrome.runtime.onMessage.addListener(function (message) {
	if (!isset(message.cmd)) {
		var data = message.keyBindings;
		var x = data;
		var copyToUpload = performBlackMagic(data);
		copyToUpload.splice(0, 1);
		updateSettings("keyBindings", copyToUpload);
		keyBindingCallback(performBlackMagic(x));
	}
});

function getAllKeyBindings(callback) {
	keyBindingCallback = callback;
	chrome.runtime.sendMessage({ cmd: "getKeyBindings" });
}

function hidePopup() {
	if (searchWorker !== undefined) {
		searchWorker.terminate();
	}
	$(".overlay, .overlay2").animate({
		opacity: 0
	}, 200, "easeInCubic");
	$(".popup").animate({
		marginLeft: "100%"
	}, 250, "easeInCubic", function () {
		$(this).remove();
		$(".overlay, .overlay2").remove();
	});
}

function assignKeyBinding(i, bindings) {
	var shortcuts = settings.shortcuts;
	var shortcutToSet = keyBindingsToSetNum[0];
	shortcuts[i] = shortcutToSet;
	updateSettings("shortcuts", shortcuts);
	keyBindingsToSet.splice(0, 1);
	keyBindingsToSetNum.splice(0, 1);
	hidePopup();
	loadBindings();
	setTimeout(function () {
		setKeyBindings(bindings);
	}, 260);
}

function pushBindingToData(binding, website, shortcut) {
	var bindings = settings.bindings;
	var websites = settings.websites;
	var shortcuts = settings.shortcuts;
	if (isset(binding)) {
		bindings.push(binding);
		updateSettings("bindings", bindings);
	}
	if (isset(website)) {
		websites.push(website);
		updateSettings("websites", websites);
	}
	if (isset(shortcut)) {
		shortcuts.push(shortcut);
		updateSettings("shortcuts", shortcuts);
	}
}

function hideLoadingGif() {
	$(".loadingGif").remove();
}

function showLoadingGif() {
	hideLoadingGif();
	$("<div class='loadingGif'><img src='/Images/loading.png'></div>")
		.insertBefore($("body").children().first());
}

function loadBindings() {
	$(".bindingsContainer").html("");
	$("<div class=\"bindingTxt\">Bindings:</div>\
				<div class=\"URLTxt\">Websites:</div>")
		.appendTo($(".bindingsContainer"));
	var bindings = settings.bindings;
	var websites = settings.websites;
	var shortcuts = settings.shortcuts;
	var buttonsCont = $("<div class=\"bindinsContButtonCont\"></div>")
		.appendTo($(".bindingsContainer"));
	$("<paper-button class=\"addInputs\" raised><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Add Inputs</div></paper-ripple>" +
			"<paper-shadow> <div class=\"shadow-bot\"></div><div class=\"shadow-top\"></div> </paper-shadow></paper-button>")
		.click(function (e) {
			ripplestuff($(this).children("paper-ripple")[0], e, false);
			simpleAddInputField($(this).parent().parent());
		})
		.appendTo(buttonsCont);
	$("<paper-button class=\"loadBindings\" raised><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Reload Bindings</div></paper-ripple>" +
			"<paper-shadow> <div class=\"shadow-bot\"></div><div class=\"shadow-top\"></div> </paper-shadow></paper-button>")
		.click(function () {
			//Load for a bit
			showLoadingGif();
			setTimeout(function () {
				loadBindings();
				hideLoadingGif();
			}, 500);
		})
		.appendTo(buttonsCont);
	if (bindings.length > 0) {
		var smallerWidth = false;
		var i;
		for (i = 0; i < bindings.length; i++) {
			if (shortcuts[i] !== "") {
				smallerWidth = true;
				break;
			}
		}
		for (i = 0; i < bindings.length; i++) {
			if (shortcuts[i] !== "") {
				addInputField($(".bindingsContainer"), bindings[i], websites[i], smallerWidth, i, true);
			}
			else {
				addInputField($(".bindingsContainer"), bindings[i], websites[i], smallerWidth);
			}
		}
	}
	checkForKeyBindings();
}

function loadAKBindings(keyBindings) {
	var target = $(".AKBindings");

	var bindings = settings.bindings;
	var websites = settings.websites;
	var shortcuts = settings.shortcuts;

	var akBinding;
	var keys;
	var shortcutSplit;

	function assignShortcutOnClick() {
		assignKeyBinding(parseInt($(this).attr("id").split("item")[1], 10), keyBindings);
	}

	function swapShortcutOnClick() {
		var i = parseInt($(this).attr("id").split("item")[1], 10);
		var bindings = keyBindings;
		var shortcuts = settings.shortcuts;
		var shortcutToSet = keyBindingsToSetNum[0];
		var originalShortcut = shortcuts[i];
		shortcuts[i] = shortcutToSet;
		updateSettings("shortcuts", shortcuts);
		keyBindingsToSet[0] = keyBindings[originalShortcut];
		keyBindingsToSetNum[0] = originalShortcut;
		var keys2 = "";
		var split = keyBindings[originalShortcut].shortcut.split("+");
		for (var j = 0; j < split.length; j++) {
			if (j !== 0) {
				keys2 += "+";
			}
			keys2 += "<span class='key'>" + split[j] + "</span>";
		}
		$(".assignKeyBinding .bigTxt").html("Swapping a key binding");
		$(".AKDescr").html("You are now swapping a key binding, keep in mind that pressing cancel will not cancel the swap, it will only cancel the current" +
			"assignment. You can always assign this key whenever you want by pressing the button below the bindings. Additionally, you can always un-assign" +
			"a key binding by clicking the keyboard button on that binding and clicking \"Unassign\". Now assigning <b>" + keyBindings[originalShortcut].description + "</b>" +
			", which triggers upon pressing " + keys2 + ".");
		$(".AKBindings").html("");
		loadBindings();
		loadAKBindings(bindings);
		swapBinding(parseInt($(this).attr("id").split("item")[1], 10), keyBindings);
	}

	for (var i = 0; i < bindings.length; i++) {
		akBinding = $("<div class='AKBinding'></div>")
			.appendTo(target);

		$("<paper-input disabled class=\"AKInput inputCont\"><paper-input-decorator><input disabled class=\"actualinput bindingInput\" value='" + bindings[i] + "'/>\
<div class=\"underline\"><div class=\"unfocused-underline\"></div><div class=\"focusedUnderline focused-underline\"></div></div></paper-input-decorator>\
</paper-input>")
			.css("width", "150px")
			.appendTo(akBinding)
			.find(".unfocused-underline")
			.css("width", "150px");

		$("<paper-input disabled class=\"AKInput inputCont\"><paper-input-decorator><input disabled class=\"actualinput rightInput\" value='" + websites[i] + "' />\
<div class=\"underline\"><div class=\"unfocused-underline\"></div><div class=\"focusedUnderline focused-underline\"></div></div></paper-input-decorator>\
					</paper-input>")
			.css("margin-left", "3px")
			.css("width", "150px")
			.appendTo(akBinding)
			.find(".unfocused-underline")
			.css("width", "150px");

		if (shortcuts[i] === "") {
			$("<div class='AKShortcut'>No Shortcut</div>")
				.appendTo(akBinding);
			$("<paper-button class=\"assignShortcut\" id='item" + i + "' raised> <paper-ripple> <div class=\"bg\"></div> <div class=\"waves\"></div> <div class=\"button-content\">Assign</div> </paper-ripple><paper-shadow> <div class=\"shadow-bot\"></div> <div class=\"shadow-top\"></div> </paper-shadow> </paper-button>")
				.click(assignShortcutOnClick)
				.appendTo(akBinding);
		}
		else {
			keys = "";
			shortcutSplit = keyBindings[shortcuts[i]].shortcut.split("+");
			for (var j = 0; j < shortcutSplit.length; j++) {
				if (j !== 0) {
					keys += "+";
				}
				keys += "<span class='key'>" + shortcutSplit[j] + "</span>";
			}
			$("<div class='AKShortcut'>" + keys + "</div>")
				.appendTo(akBinding);
			$("<paper-button class=\"swapShortcut\" id='item" + i + "' raised> <paper-ripple> <div class=\"bg\"></div> <div class=\"waves\"></div> <div class=\"button-content\">Swap</div> </paper-ripple><paper-shadow> <div class=\"shadow-bot\"></div> <div class=\"shadow-top\"></div> </paper-shadow> </paper-button>")
				.click(swapShortcutOnClick)
				.appendTo(akBinding);
		}
	}

	bindstuff(target);
}

function swapBinding(i, bindings) {
	var shortcuts = settings.shortcuts;
	var shortcutToSet = keyBindingsToSetNum[0];
	var originalShortcut = shortcuts[i];
	shortcuts[i] = shortcutToSet;
	updateSettings("shortcuts", shortcuts);
	var keyBindings = settings.keyBindings;
	keyBindingsToSet[0] = keyBindings[originalShortcut];
	keyBindingsToSetNum[0] = originalShortcut;
	var keys = "";
	var shortcutSplit = keyBindings[originalShortcut].shortcut.split("+");
	for (var j = 0; j < shortcutSplit.length; j++) {
		if (j !== 0) {
			keys += "+";
		}
		keys += "<span class='key'>" + shortcutSplit[j] + "</span>";
	}
	$(".assignKeyBinding .bigTxt").html("Swapping a key binding");
	$(".AKDescr").html("You are now swapping a key binding, keep in mind that pressing cancel will not cancel the swap, it will only cancel the current" +
		"assignment. You can always assign this key whenever you want by pressing the button below the bindings. Additionally, you can always un-assign" +
		"a key binding by clicking the keyboard button on that binding and clicking \"Unassign\". Now assigning <b>" + keyBindings[originalShortcut].description + "</b>" +
		", which triggers upon pressing " + keys + ".");
	$(".AKBindings").html("");
	loadBindings();
	loadAKBindings(bindings);
	setTimeout(function () {
		setKeyBindings(bindings);
	}, 260);
}

function assignNewKeyBindingScreen(bindings) {
	var keyBinding = keyBindingsToSet[0];
	$(".overlay, .assignKeyBindingCont").remove();
	$("<div class='overlay'></div>")
		.click(function () {
			hidePopup();
		})
		.insertBefore($("body").children().first())
		.animate({
			opacity: 1
		}, 400, "easeOutCubic");
	var popup = $("<div class='assignKeyBindingCont popup bodyColor'></div>")
		.insertBefore($("body").children().first());

	$("<div class=\"topShadowLayer\"></div>")
		.appendTo(popup);

	$("<div class=\"bottomShadowLayer\"></div>")
		.appendTo(popup);

	var cont = $("<div class=\"assignKeyBinding\"></div>")
		.appendTo(popup);

	$("<div style='text-align:center;' class='bigTxt'>Assign Keybindings</div>")
		.appendTo(cont);

	var keys = "";
	var shortcutSplit = keyBinding.shortcut.split("+");
	for (var i = 0; i < shortcutSplit.length; i++) {
		if (i !== 0) {
			keys += "+";
		}
		keys += "<span class='key'>" + shortcutSplit[i] + "</span>";
	}

	$("<div class='AKDescr'>You have just assigned keyboard shortcuts, but you have not linked them to a Binding yet, choose one of the Bindings below to link it to <b>" + keyBinding.description + "</b> which is triggered upon pressing " +
			keys +
			", choose a Binding below that will trigger (the website will open) upon pressing that shortcut</div>")
		.appendTo(cont);

	$("<div class='AKBindings'></div>")
		.appendTo(cont);

	$("<paper-button class=\"closeAssignKeyBinding\" raised> <paper-ripple> <div class=\"bg\"></div> <div class=\"waves\"></div> <div class=\"button-content\">Close</div> </paper-ripple><paper-shadow> <div class=\"shadow-bot\"></div> <div class=\"shadow-top\"></div> </paper-shadow> </paper-button>")
		.click(function (e) {
			ripplestuff($(this).children("paper-ripple")[0], e, false);
			hidePopup();
		})
		.appendTo(cont);

	loadAKBindings(bindings);

	popup.animate({
		marginLeft: 0
	}, 500, "easeOutCubic");
}

function setKeyBindings(bindings) {
	if (keyBindingsToSet.length > 0) {
		assignNewKeyBindingScreen(bindings);
	}
}

function addUnassignedKeyBindingsButton(bindings) {
	$(".assignBindings").remove();
	$("<paper-button class=\"assignBindings\" raised><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Assign Unassigned Key-bindings</div></paper-ripple>" +
			"<paper-shadow> <div class=\"shadow-bot\"></div><div class=\"shadow-top\"></div> </paper-shadow></paper-button>")
		.click(function (e) {
			ripplestuff($(this).children("paper-ripple")[0], e, false);
			setKeyBindings(bindings);
		})
		.appendTo(".bindinsContButtonCont");
}

function checkForKeyBindings() {
	getAllKeyBindings(function (bindings) {
		var copy = bindings;
		var i;
		var otherCopy = performBlackMagic(copy);
		var referenced = [];
		var bindingsCopy = bindings;
		var shortcuts = settings.shortcuts;
		for (i = 0; i < shortcuts.length; i++) {
			if (shortcuts[i] !== "") {
				referenced.push(shortcuts[i]);
			}
		}
		for (i = 0; i < referenced.length; i++) {
			bindingsCopy[referenced[i]] = "";
		}
		keyBindingsToSet = [];
		keyBindingsToSetNum = [];
		for (i = 1; i < bindingsCopy.length; i++) {
			if (bindingsCopy[i] !== "") {
				if (bindingsCopy[i].shortcut !== "") {
					keyBindingsToSet.push(bindingsCopy[i]);
					keyBindingsToSetNum.push(i);
				}
			}
		}
		if (keyBindingsToSet.length > 0) {
			addUnassignedKeyBindingsButton(otherCopy);
			setKeyBindings(otherCopy);
		}
	});
}

function animateGreenBorder(element) {
	var start, start2 = null;
	var progress;
	var underline = $(element).parent().children(".underline");
	var focusedUnderline = underline.children(".focused-underline");
	var unfocusedUnderline = underline.children(".unfocused-underline");

	function step2(timestamp) {
		if (!start2) {
			start2 = timestamp;
		}
		progress = timestamp - start2;
		//From rgb(92,175,80) to rgb(255,255,255)
		// r + 163
		// g + 80
		// b + 175
		focusedUnderline
			.css("background-color", "rgb" +
				"(" + (92 + (163 * Math.floor(progress / 150))) +
				"," + (175 + (80 * Math.floor(progress / 150))) +
				"," + (80 + (175 * Math.floor(progress / 150))) +
				")");
		//From rgb(92,175,80) to rgb(117,117,117)
		// r + 25
		// g - 58
		// b + 37
		unfocusedUnderline
			.css("background-color", "rgb" +
				"(" + (92 + (25 * Math.floor(progress / 150))) +
				"," + (175 - (58 * Math.floor(progress / 150))) +
				"," + (80 + (37 * Math.floor(progress / 150))) +
				")")
			.css("height", (5 - (Math.floor(4 * (progress / 150)))) + "px");
		underline
			.css("height", (7 - (Math.floor(6 * (progress / 150)))) + "px");
		if (progress < 150) {
			window.requestAnimationFrame(step2);
		}
	}

	function step(timestamp) {
		if (!start) {
			start = timestamp;
		}
		progress = timestamp - start;
		//From rgb(255,255,255) to rgb(92,175,80)
		// r - 163
		// g - 80
		// b - 175
		focusedUnderline
			.css("background-color", "rgb" +
				"(" + (255 - (163 * Math.floor(progress / 300))) +
				"," + (255 - (80 * Math.floor(progress / 300))) +
				"," + (255 - (175 * Math.floor(progress / 300))) +
				")");
		//From rgb(117,117,117) to rgb(92,175,80)
		// r - 25
		// g + 58
		// b - 37
		unfocusedUnderline
			.css("background-color", "rgb" +
				"(" + (117 - (25 * Math.floor(progress / 300))) +
				"," + (117 + (58 * Math.floor(progress / 300))) +
				"," + (117 - (37 * Math.floor(progress / 300))) +
				")")
			.css("height", (1 + (Math.floor(4 * (progress / 300)))) + "px");
		underline
			.css("height", (1 + (Math.floor(6 * (progress / 300)))) + "px");
		if (progress < 300) {
			window.requestAnimationFrame(step);
		}
		else {
			setTimeout(function () {
				window.requestAnimationFrame(step2);
			}, 500);
		}
	}

	window.requestAnimationFrame(step);
}

function removeError(element) {
	element.css("margin-bottom", "0");
	element.children("paper-input-decorator").children(".footer").remove();
	element.find(".unfocused-underline").css("background-color", "rgb(117, 117, 117)");
	element.find(".focused-underline").css("background-color", "rgb(255, 255, 255)");
}

function showError(element, error) {
	element.css("margin-bottom", "-20px").children("paper-input-decorator").children(".footer").remove();
	element.find(".underline").children().css("background-color", "rgb(255, 145, 0)");
	$("<div class=\"footer\" layout=\"\" horizontal=\"\" end-justified=\"\"><div class=\"error\" flex=\"\" layout=\"\" horizontal=\"\" center=\"\"><div class=\"error-text\" flex=\"\" auto=\"\" role=\"alert\"\
aria-hidden=\"false\">" + error + "</div><core-icon id=\"errorIcon\" class=\"error-icon\" icon=\"warning\" aria-label=\"warning\" role=\"img\"><svg \
viewBox=\"0 0 24 24\" height=\"100%\" width=\"100%\"\
preserveAspectRatio=\"xMidYMid meet\" fit=\"\" style=\"pointer-events: none; display: block;\"><g><path d=\"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z\"></path></g></svg></core-icon>\
</div><div aria-hidden=\"true\"><content select=\".counter\"></content></div></div>")
		.appendTo(element.children("paper-input-decorator"));
}

function checkBindingsForErrors(bindings, bindingElements) {
	var binding;
	if (settings.superSearch) {
		for (var i = 0; i < bindings.length; i++) {
			removeError(bindingElements[i]);
			binding = bindings[i];
			for (var j = 0; j < bindings.length; j++) {
				if (binding.indexOf(bindings[j]) === 0 && i !== j && bindings[i] !== "" && bindings[j] !== "" && bindings[i] !== bindings[j]) {
					showError(bindingElements[i], "Binding will never be triggered");
				}
				else if (bindings[i] === bindings[j] && i !== j && bindings[i] !== "" && bindings[j] !== "") {
					showError(bindingElements[i], "Binding is the same as a different binding");
				}
			}
		}
	}
}

function saveInputs(sourceElement) {
	var bindings = [];
	var websites = [];
	var bindingElements = [];
	sourceElement
		.parent()
		.children(".inputsField").each(function () {
			$(this).find(".bindingInput")
				.each(function () {
					bindings.push($(this).val());
					bindingElements.push($(this).parent().parent());
				});
		});
	sourceElement
		.parent()
		.children(".inputsField").each(function () {
			$(this).find(".rightInput")
				.each(function () {
					websites.push($(this).val());
				});
		});
	updateSettings("bindings", bindings);
	updateSettings("websites", websites);
	if (sourceElement.parent().attr("class") === "firstTimeInputs") {
		loadBindings();
	}
	sourceElement
		.find(".bindingInput, .rightInput")
		.each(function () {
			animateGreenBorder(this);
		});
	checkBindingsForErrors(bindings, bindingElements);
}

function removeField(element) {
	var parent = element.parent()[0];
	var index = -3;
	var confirmedIndex;
	//Get this item's index of all the bindings
	element
		.parent()
		.parent()
		.children()
		.each(function () {
			index++;
			if (this === parent) {
				confirmedIndex = index;
			}
		});
	var bindings = settings.bindings;
	var websites = settings.websites;
	var shortcuts = settings.shortcuts;
	var removingFirstOne = (confirmedIndex === 0 && bindings.length === 1);
	if (removingFirstOne) {
		bindings[0] = "";
		websites[0] = "";
		shortcuts[0] = "";
	}
	else {
		bindings.splice(confirmedIndex, 1);
		websites.splice(confirmedIndex, 1);
		shortcuts.splice(confirmedIndex, 1);
	}
	updateSettings("bindings", bindings);
	updateSettings("websites", websites);
	updateSettings("shortcuts", shortcuts);
	if (!removingFirstOne) {
		element.parent().remove();
	}
}

function hideShortcutInfo(elem) {
	if (elem === undefined) {
		elem = $(".bindingsContainer")[0];
	}
	$(elem)
		.find(".expanded-shadow")
		.animate({
			width: "3em",
			height: "40px",
			marginLeft: "0"
		}, 300, function () {
			$(this).attr("class", "shadow-top");
			$(this).css("margin-top", "0");
		});
	$(elem)
		.find(".shortcutInfoContainer")
		.animate({
			height: "40px",
			width: "3em",
			marginLeft: "0"
		}, 300, function () {
			$(this).parent().css("z-index", "1").children("paper-ripple").css("z-index", "1");
			$(this).remove();
		});
}

function unAssign(shortcutIndex) {
	var shortcuts = settings.shortcuts;
	shortcuts[shortcutIndex] = "";
	updateSettings("shortcuts", shortcuts);
}

function showShortcutInfo(shortcutIndex, elem) {
	$(elem)
		.css("z-index", "20")
		.children("paper-ripple")
		.css("z-index", "30");

	$(elem)
		.children("paper-shadow")
		.children(".shadow-top")
		.attr("class", "shadow-top expanded-shadow")
		.css("margin-top", "-1px")
		.stop()
		.animate({
			height: "200px",
			width: "200px",
			marginLeft: "-157px"
		}, 600);
	var shortcutInfoCont = $("<div class='shortcutInfoContainer bodyColor'></div>")
		.appendTo(elem)
		.css("width", "3em")
		.css("height", "40px")
		.css("z-index", "20")
		.css("margin-top", "-40px")
		.css("position", "absolute")
		.css("cursor", "default")
		.css("overflow", "hidden")
		.animate({
			height: "200px",
			width: "200px",
			marginLeft: "-157px"
		}, 600);

	var shortcutInfo = $("<div class='shortcutInfo'></div>")
		.css("width", "200px")
		.css("height", "200px")
		.css("padding", "10px")
		.css("text-align", "left")
		.appendTo(shortcutInfoCont);

	$("<div class='bigTxt'>Shortcut</div>")
		.appendTo(shortcutInfo);

	var keys = "";
	var shortcutSplit = settings.keyBindings[settings.shortcuts[shortcutIndex]].shortcut.split("+");
	for (var i = 0; i < shortcutSplit.length; i++) {
		if (i !== 0) {
			keys += "+";
		}
		keys += "<span class='key'>" + shortcutSplit[i] + "</span>";
	}

	$("<div class='infoTriggersOn'>Triggers upon<br>" + keys + "</div>")
		.css("font-size", "150%")
		.css("text-transform", "initial")
		.appendTo(shortcutInfo);

	$("<paper-button raised class=\"unAssignButton\"><paper-ripple><div class=\"bg\"></div>" +
			"<div class=\"waves\"></div><div class=\"button-content\">Unassign</div></paper-ripple>" +
			"<paper-shadow> <div class=\"shadow-bot\"></div><div class=\"shadow-top\">" +
			"</div> </paper-shadow></paper-button>")
		.click(function (e) {
			ripplestuff($(this).children("paper-ripple")[0], e, false);
			unAssign(shortcutIndex);
			hideShortcutInfo(elem);
			setTimeout(function () {
				loadBindings();
			}, 300);
		})
		.appendTo(shortcutInfo);
}

function toggleShortcutInfo(shortcutIndex, elem) {
	if ($(elem).find(".shortcutInfoContainer")[0]) {
		hideShortcutInfo(elem);
	}
	else {
		if ($(".shortcutInfoContainer")[0]) {
			hideShortcutInfo();
			setTimeout(function () {
				showShortcutInfo(shortcutIndex, elem);
			}, 300);
		}
		else {
			showShortcutInfo(shortcutIndex, elem);
		}
	}
}

function addLeftInputToElement(parent, inputValues) {
	return $("<paper-input class=\"settingsInput bindingsSettingsInput inputCont\"><paper-input-decorator><input class=\"actualinput bindingInput\"" + ((inputValues !== undefined) ? (" value=\"" + inputValues + "\"") : "") + "/>\
<div class=\"underline\"><div class=\"unfocused-underline\"></div><div class=\"focusedUnderline focused-underline\"></div></div></paper-input-decorator>\
</paper-input>")
		.appendTo(parent);
}

function addRightInputToElement(parent, inputValues) {
	return $("<paper-input class=\"settingsInput urlSettingsInput inputCont\"><paper-input-decorator><input class=\"actualinput rightInput\"" + ((inputValues !== undefined) ? (" value=\"" + inputValues + "\"") : "") + " />\
<div class=\"underline\"><div class=\"unfocused-underline\"></div><div class=\"focusedUnderline focused-underline\"></div></div></paper-input-decorator>\
					</paper-input>")
		.css("margin-left", "3px")
		.appendTo(parent);
}

function addShortcutButtonToElement(parent) {
	return $("<paper-button class=\"shortcutSettings\" raised><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\"><img height='20' width='20' class='keyboardImg' src='Images/keyboard.png'></div></paper-ripple><paper-shadow>\
	<div class=\"shadow-bot\"></div><div class=\"shadow-top\"></div> </paper-shadow></paper-button>")
		.appendTo(parent);
}

function addRemoveButtonToElement(parent) {
	return $("<paper-button class=\"removeInput\" raised><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">x</div></paper-ripple><paper-shadow>\
<div class=\"shadow-bot\"></div><div class=\"shadow-top\"></div> </paper-shadow></paper-button>")
		.appendTo(parent);
}

function addInputOnClicks(leftInput, rightInput, removeButton, shortcutButton, shortcutIndex) {
	leftInput
		.find(".actualinput")
		.blur(function () {
			saveInputs($(this).parent().parent().parent());
		});
	rightInput
		.find(".actualinput")
		.blur(function () {
			saveInputs($(this).parent().parent().parent());
		});
	if (shortcutIndex !== undefined) {
		shortcutButton
			.click(function () {
				toggleShortcutInfo(shortcutIndex, this);
			});
	}
	removeButton
		.click(function () {
			removeField($(this));
		});
}

function fixSpacingsOnInputs(removeButton, shortcutIndex, smallerWidth, rightInput) {
	if (shortcutIndex !== undefined) {
		removeButton.css("margin-left", "5px");
	}
	else if (smallerWidth) {
		removeButton.css("margin-left", "71px");
	}
	if (smallerWidth !== undefined && smallerWidth === true) {
		rightInput
			.css("width", "398px")
			.find(".actualinput")
			.css("width", "398px");
	}
}

function simpleAddInputField(sourceElement) {
	var input = $("<div class=\"inputsField\"></div>")
		.insertBefore(sourceElement.children().last());
	var leftInput = addLeftInputToElement(input);
	var rightInput = addRightInputToElement(input);
	rightInput.css("width", "248px");
	var removeButton = addRemoveButtonToElement(input);
	addInputOnClicks(leftInput, rightInput, removeButton);
	pushBindingToData("", "", "");
	bindstuff(sourceElement);
}

function addInputField(sourceElement, firstInputVal, secondInputVal, smallerWidth, shortcutIndex) {
	var input = $("<div class=\"inputsField\"></div>")
		.insertBefore(sourceElement.children().last());

	var leftInput = addLeftInputToElement(input, firstInputVal);
	var rightInput = addRightInputToElement(input, secondInputVal);
	var shortcutButton = $();

	if (shortcutIndex !== undefined) {
		shortcutButton = addShortcutButtonToElement(input);
	}

	var removeButton = addRemoveButtonToElement(input);

	addInputOnClicks(leftInput, rightInput, removeButton, shortcutButton, shortcutIndex);
	fixSpacingsOnInputs(removeButton, shortcutIndex, smallerWidth, rightInput);

	bindstuff(sourceElement);
}

function firstRun() {
	//First run
	updateSettings({
		"set": true,
		"colors": {
			"bg": "#3C92FF",
			"title": "#FFFFFF",
			"text": "#FFFFFF"
		},
		"bindings": [""],
		"websites": [""],
		"shortcuts": [""],
		"keyBindings": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
		"closeBinder": true,
		"superSearch": false
	});
	var fa = chrome.app.window.current();
	fa.resizeTo(700, 755);
	$(".draggablearea").css("width", "628px");
	$(".firstTimeContainer").css("display", "block");
	$(".hideSettings").css("display", "none");
	$(".toSettingsFromFirstTime").click(function () {
		loadBindings();
		$(".firstTimeContainer").css("display", "none");
		showSettings(true);
	});
	$(".hideThis").click(function () {
		loadBindings();
		$(".firstTimeContainer").css("display", "none");
		hideSettings();
	});
	$(".addInputs").click(function () {
		simpleAddInputField($(this).parent());
	});
}

function searchBinding(websites) {
	$(".actualinput").attr("placeholder", "Your search query").val("");
	searchWebsites = websites;
	searchMode = true;
}

function openWebsites(website) {
	var sites = [];
	sites = website.split(",");
	var search = false;
	//Search all of them for search things
	var i;
	for (i = 0; i < sites.length; i++) {
		if (sites[i].indexOf("%s") > -1) {
			search = true;
		}
	}
	if (search) {
		searchBinding(sites);
	}
	else {
		for (i = 0; i < sites.length; i++) {
			window.open(sites[i], "_blank");
		}
	}
	if (settings.closeBinder && !search) {
		app.resizeTo(500, 100);
		app.close();
	}
	else {
		$(".input").val("");
	}
}

function checkBinding(input, binding, website) {
	if (binding === input) {
		openWebsites(website);
	}
}

function handleSearchBinding() {
	searchMode = false;
	setTimeout(function () {
		var input = $(".input").val();
		for (var i = 0; i < searchWebsites.length; i++) {
			openWebsites(searchWebsites[i].replace("%s", input));
		}
	}, 0);
}

function searchForBinding() {
	if (searchMode) {
		handleSearchBinding();
	}
	else {
		setTimeout(function () {
			var input = $(".input").val();
			if (input !== "") {
				var bindings = settings.bindings;
				var websites = settings.websites;
				var bindingSplit;
				for (var i = 0; i < bindings.length; i++) {
					bindingSplit = [];
					bindingSplit = bindings[i].split(",");
					for (var j = 0; j < bindingSplit.length; j++) {
						checkBinding(input, bindingSplit[j], websites[i]);
					}
				}
			}
		}, 0);
	}
}

function handleOnKeyPress(e) {
	if ((settings.superSearch && !searchMode) || e.keyCode === 13) {
		searchForBinding();
	}
}

function showSettings() {
	$(".hideSettings").css("display", "inline-block");
	$(".draggablearea").css("width", "628px");
	app.resizeTo(700, 755);
	loadBindings();
}

function hideSettings() {
	$(".draggablearea").css("width", "428px");
	app.resizeTo(500, 100);
}

function toggleSettings(show) {
	if (show) {
		showSettings();
	}
	else {
		if (app.getBounds().width === 500) {
			showSettings();
		}
		else {
			hideSettings();
		}
	}
}

function setColors(change, color) {
	color = "#" + color;
	switch (change) {
		case "bg":
			$(".bgColor").css("background-color", color).css("color", color);
			$(".customColorBg").remove();
			$("<style class=\"customColorBg\" type=\"text/css\">\
body, .bodyColor { background-color: " + color + "; }</style>")
				.appendTo("head");
			break;
		case "title":
			$(".titleColor").css("background-color", color).css("color", color);
			$(".customColorTitle").remove();
			$("<style class=\"customColorTitle\" type=\"text/css\">\
#topbar { background-color: " + color + "; }</style>")
				.appendTo("head");
			break;
		case "text":
			$(".textColor").css("background-color", color).css("color", color);
			$("<style class=\"customColorTxt\" type=\"text/css\">\
body { color: " + color + "; }</style>\
paper-input-decorator .focused-underline { background-color:#FFFFFF; }</style>")
				.appendTo("head");
			break;
	}
}

function rgbToHex(r, g, b) {
	return toHex(r) + toHex(g) + toHex(b);
}

function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) {
		return "00";
	}
	n = Math.max(0, Math.min(n, 255));
	return "0123456789ABCDEF".charAt((n - n % 16) / 16)
		+ "0123456789ABCDEF".charAt(n % 16);
}

function saveColors(change, color) {
	color = "#" + color;
	var colors = settings.colors;
	colors[change] = color;
	updateSettings({ "colors": colors });
}

function showGoButton() {
	$(".goButton").css("display", "inline-block");
	$(".mainInputCont").css("width", "350px");
	$(".mainInputCont .unfocused-underline").css("width", "350px");
	$(".hideSettings").css("margin-left", "20px");
}

function hideGoButton() {
	$(".goButton").css("display", "none");
	$(".mainInputCont").css("width", "442px");
	$(".mainInputCont .unfocused-underline").css("width", "442px");
	$(".hideSettings").css("margin-left", "36px");
}

function addDefault(element) {
	var tr = element.parent().parent();
	var binding = tr.children().first().children().first().children().first().children(".actualinput").val();
	var website = $(tr.children()[1]).children().first().html();

	pushBindingToData(binding, website, "");

	loadBindings();
}

function addNewBinding() {
	var binding = $(".newBindingInput .actualinput").first().val();
	var website = $(".newBindingInput .actualinput").last().val();

	pushBindingToData(binding, website, "");
	loadBindings();
}

function addNewBindingAnimation() {
	$(".overlay, .newBindingPopup").remove();
	$("<div class=\"overlay\"></div>")
		.click(function () {
			hidePopup();
		})
		.insertBefore($("body").children().first())
		.animate({
			opacity: 1
		}, 400, "easeOutCubic");
	var newBindingEl = $("<div class=\"newBindingPopup popup bodyColor\"></div>")
		.insertBefore($("body").children().first());

	$("<div class=\"topShadowLayer\"></div>")
		.appendTo(newBindingEl);

	$("<div class=\"bottomShadowLayer\"></div>")
		.appendTo(newBindingEl);

	var cont = $("<div class=\"addNewContainer\"></div>")
		.appendTo(newBindingEl);

	$("<div class=\"newBindingTxt\">Add Binding</div>")
		.appendTo(cont);

	var input = $("<div class=\"inputsField\"></div>")
		.appendTo(cont);

	$("<paper-input class=\"newBindingInput inputCont\"><paper-input-decorator><input placeholder=\"Binding\" class=\"actualinput bindingInput\" />\
<div class=\"underline\"><div class=\"unfocused-underline\"></div><div class=\"focusedUnderline focused-underline\"></div></div></paper-input-decorator>\
</paper-input>")
		.appendTo(input);

	$("<paper-input class=\"newBindingInput inputCont\"><paper-input-decorator><input placeholder=\"Website\" class=\"actualinput rightInput\" />\
<div class=\"underline\"><div class=\"unfocused-underline\"></div><div class=\"focusedUnderline focused-underline\"></div></div></paper-input-decorator>\
					</paper-input>")
		.css("margin-left", "3px")
		.appendTo(input);

	var buttonCont = $("<div class=\"addBindingButtonCont\"></div>")
		.appendTo(cont);

	$("<div class=\"addBindingCancel\"><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Cancel</div></paper-ripple></div>")
		.click(function () {
			ripplestuff($(this).children("paper-ripple")[0], "", false);
			hidePopup();
		})
		.appendTo(buttonCont);

	$("<div class=\"addBindingAdd\"><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Add</div></paper-ripple></div>")
		.click(function () {
			ripplestuff($(this).children("paper-ripple")[0], "", false);
			addNewBinding();
			hidePopup();
			loadBindings();
		})
		.appendTo(buttonCont);

	newBindingEl.animate({
		marginLeft: 0
	}, 500, "easeOutCubic");

	bindstuff(newBindingEl);
}

function clearTextarea() {
	var textArea = $(this).parent().parent().find("textarea");
	textArea.html("");
}

function checkAndUploadSettings(obj) {
	var changes = false;
	var websiteChanges = false;
	if (!isset(obj.set)) {
		firstRun();
	}
	else {
		if (!isset(obj.colors)) {
			changes = true;
			obj.colors = {
				"bg": "#3C92FF",
				"title": "#FFFFFF",
				"text": "#FFFFFF"
			};
		}
		if (!isset(obj.bindings)) {
			changes = true;
			obj.bindings = [""];
		}
		if (!isset(obj.websites)) {
			websiteChanges = true;
			changes = true;
			obj.websites = [""];
		}
		if (!isset(obj.shortcuts)) {
			changes = true;
			obj.shortcuts = [""];
		}
		var websitesAmount = obj.websites.length;
		var bindingsAmount = obj.bindings.length;
		var shortcutsAmount = obj.shortcuts.length;
		var i;
		if (bindingsAmount > websitesAmount) {
			changes = true;
			for (i = 0; i < (bindingsAmount - websitesAmount) ; i++) {
				obj.bindings.push("");
			}
		}
		else if (bindingsAmount < websitesAmount) {
			changes = true;
			for (i = 0; i < (websitesAmount - bindingsAmount) ; i++) {
				websiteChanges = true;
				obj.websites.push("");
			}
		}
		if (shortcutsAmount !== bindingsAmount) {
			changes = true;
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
			changes = true;
			obj.closeBinder = true;
		}
		if (!isset(obj.superSearch)) {
			changes = true;
			obj.superSearch = false;
		}

		if (!isset(obj.keyBindings)) {
			changes = true;
			obj.keyBindings = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
		}
		else {
			if (obj.keyBindings.length !== 50) {
				changes = true;
				obj.keyBindings = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
			}
		}
		if (changes) {
			if (websiteChanges) {
				sendUpdateWebsitesMessage();
			}
			settings = obj;
			storage.set(obj);
		}
	}
}

function importError(suggestCheckboxChange) {
	$("<div class=\"importError\">No settings can be derived from this text" + (suggestCheckboxChange ? ", try unchecking the checkbox" : "") + "</div>")
		.insertBefore(".importingFromPrevBinder");
}

function importBindings() {
	var textArea = $(this).parent().parent().find("textarea");
	var jsonText = textArea.val();
	$(".importError").remove();
	if ($(".importFromBinderExtension").attr("on") === "true") {
		try {
			var importvar = jsonText.split(",");
			var bindings;
			var urls;
			var shortcuts;
			if (importvar[3] === "yes") {
				bindings.push("googlesearch");
				urls.push("http://wwww.google.com/search?q=%s");
				shortcuts.push("");
			}
			if (importvar[4] === "yes") {
				bindings.push("youtubesearch");
				urls.push("http://www.youtube.com/results?search_query=%s");
				shortcuts.push("");
			}
			if (importvar[5] === "yes") {
				bindings.push("bingsearch");
				urls.push("http://www.bing.com/search?setmkt=nl-NL&q=%s");
				shortcuts.push("");
			}
			if (importvar[6] === "yes") {
				bindings.push("amazonsearch");
				urls.push("http://www.amazon.com/s/ref=nb_sb_noss/175-3631512-6188805?url=search-alias%3Daps&field-keywords=%s");
				shortcuts.push("");
			}
			if (importvar[7] === "yes") {
				bindings.push("wikipediasearch");
				urls.push("http://en.wikipedia.org/w/index.php?title=Special:Search&search=%s");
				shortcuts.push("");
			}
			var urlpos;
			var rows = parseInt(importvar[1], 10) - 1;
			for (var i = 22; i < 22 + rows; i++) {
				urlpos = i + rows;
				if (importvar[i] !== "thisoneisnotsetyet" && importvar[urlpos] !== "thisoneisnotsetyet" && importvar[urkpos] !== "thisisasearchurl") {
					bindings.push(importvar[i]);
					urls.push(importvar[urlpos]);
					shortcuts.push("");
				}
			}
			var settingsObject = {
				"superSearch": (importvar[0] === 1 || importvar[0] === "1"),
				"set": true,
				"bindings": bindings,
				"websites": urls,
				"colors": {
					"bg": "#3C92FF",
					"title": "#FFFFFF",
					"text": "#FFFFFF"
				},
				"shortcuts": shortcuts,
				"keyBindings": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				"closeBinder": true
			};
			checkAndUploadSettings(settingsObject);
		} catch (e) {
			importError(true);
		}
	}
	else {
		try {
			var importedSettings = JSON.parse(jsonText);
			checkAndUploadSettings(importedSettings);
		} catch (e) {
			importError(false);
		}
	}
}

function exportBindings() {
	var textArea = $(this).parent().parent().find("textarea");
	var settingsJson = JSON.stringify(settings);
	textArea.html(settingsJson);
	textArea.select();
}

function updateInputs() {
	$(".bgColor")
		.css("background-color", settings.colors.bg)
		.css("color", settings.colors.bg)
		.ColorPicker({
			color: settings.colors.bg,
			onChange: function (hsb, hex) {
				setColors("bg", hex);
			},
			onHide: function (hsb) {
				var rgbColor = $(hsb)
					.children(".colorpicker_new_color")
					.css("background-color");
				var hexColor = rgbToHex(
					rgbColor.split(", ")[0].split("(")[1],
					rgbColor.split(", ")[1],
					rgbColor.split(", ")[2]
				);
				saveColors("bg", hexColor);
			}
		});
	$("<style class=\"customColorBg\" type=\"text/css\">\
body, .bodyColor { background-color: " + settings.colors.bg + "; }</style>")
		.appendTo("head");
	$(".inputsColor")
		.css("background-color", settings.colors.input)
		.css("color", settings.colors.input)
		.ColorPicker({
			color: settings.colors.input,
			onChange: function (hsb, hex) {
				setColors("input", hex);
			},
			onHide: function (hsb) {
				var rgbColor = $(hsb)
					.children(".colorpicker_new_color")
					.css("background-color");
				var hexColor = rgbToHex(
					rgbColor.split(", ")[0].split("(")[1],
					rgbColor.split(", ")[1],
					rgbColor.split(", ")[2]
				);
				saveColors("input", hexColor);
			}
		});
	$("<style class=\"customColorInput\" type=\"text/css\">\
input { background-color: " + settings.colors.input + "; }</style>")
		.appendTo("head");
	$(".textColor")
		.css("background-color", settings.colors.text)
		.css("color", settings.colors.text)
		.ColorPicker({
			color: settings.colors.text,
			onChange: function (hsb, hex) {
				setColors("text", hex);
			},
			onHide: function (hsb) {
				var rgbColor = $(hsb)
					.children(".colorpicker_new_color")
					.css("background-color");
				var hexColor = rgbToHex(
					rgbColor.split(", ")[0].split("(")[1],
					rgbColor.split(", ")[1],
					rgbColor.split(", ")[2]
				);
				saveColors("text", hexColor);
			}
		});
	$("<style class=\"customColorTxt\" type=\"text/css\">\
body { color: " + settings.colors.text + "; }\
paper-input-decorator .focused-underline { background-color:#FFFFFF; }</style>")
		.appendTo("head");

	$(".superSearchCheckbox").attr("on", (settings.superSearch ? "true" : "false"));
	$(".closeBinderCheckbox").attr("on", (settings.closeBinder ? "true" : "false"));
}

function createSearchEngine(name, url, sourceButton) {
	pushBindingToData(name, url, "");
	loadBindings();
	//Make that button green cause it's nice
	$(sourceButton).animate({
		backgroundColor: "#4CAF50"
	}, 250, function () {
		var elem = this;
		setTimeout(function () {
			$(elem).animate({
				backgroundColor: "rgba(0,0,0,0)"
			}, 250);
		}, 1000);
	});
}

function addImportedSearchEngine() {
	//Get URL
	var thisButton = this;
	var url = $(this).parent().children(".SEISUrl").find(".actualinput").val();
	//Ask for a name
	var askNameCont = $("<div class='askSEISURLNameCont bodyColor'></div>")
		.css("margin-left", "100%");
	$("<div class=\"overlay2\"></div>")
		.css("z-index", "25")
		.click(function () {
			$(this).animate({
				opacity: 0
			}, 250, function () {
				$(this).remove();
			});
			askNameCont.animate({
				marginLeft: "100%"
			}, 250, "easeInCubic", function () {
				$(this).remove();
			});
		})
		.insertBefore($("body").children().first())
		.animate({
			opacity: 1
		}, 400, "easeOutCubic");
	askNameCont
		.css("position", "absolute")
		.insertBefore($("body").children().first());

	$("<div class=\"topShadowLayer\"></div>")
		.appendTo(askNameCont);

	$("<div class=\"bottomShadowLayer\"></div>")
		.appendTo(askNameCont);

	var cont = $("<div class=\"askNameContainer\"></div>")
		.appendTo(askNameCont);

	$("<div class=\"bigTxt\">Assign Trigger</div>")
		.appendTo(cont);

	$("<div class='instructionTxt'>What word do you want to trigger the URL <b>" + url + "</b></div>")
		.appendTo(cont);

	var paperInput = $("<paper-input class=\"inputCont SECName\"> <paper-input-decorator> <input class=\"actualinput\" placeholder=\"Binding Name\" /> <div class=\"underline\"> <div class=\"unfocused-underline\"></div> <div class=\"focusedUnderline focused-underline\"></div> </div> </paper-input-decorator> </paper-input>")
		.appendTo(cont);

	paperInput.click(function () {
		$(this).find(".actualinput").focus();
	});

	paperInput.find(".actualinput").focus();

	var buttonCont = $("<div class=\"importSearchEnginesChooseNameButtonCont\"></div>")
		.appendTo(cont);

	$("<div class=\"SECNameCancel\"><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">CANCEL</div></paper-ripple></div>")
		.click(function (e) {
			ripplestuff($(this).children("paper-ripple")[0], e, false);
			$(".overlay2").animate({
				opacity: 0
			}, 250, function () {
				$(this).remove();
			});
			askNameCont.animate({
				marginLeft: "100%"
			}, 250, "easeInCubic", function () {
				$(this).remove();
			});
		})
		.appendTo(buttonCont);
	$("<div class=\"SECNameConfirm\"><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">ADD</div></paper-ripple></div>")
		.on("click", function (e) {
			ripplestuff($(this).children("paper-ripple")[0], e, false);
			createSearchEngine($(this).parent().parent().find(".actualinput").val(), url, thisButton);
			$(".overlay2").animate({
				opacity: 0
			}, 250, function () {
				$(this).remove();
			});
			askNameCont.animate({
				marginLeft: "100%"
			}, 250, "easeInCubic", function () {
				$(this).remove();
			});
		})
		.appendTo(buttonCont);

	askNameCont.animate({
		marginLeft: 0
	}, 500, "easeOutCubic");
}

function showSearchEngineItems(searchEngines, container) {
	var searchEngineCont;
	var currentSearchEngine;

	for (var i = 0; i < searchEngines.length; i++) {
		currentSearchEngine = searchEngines[i];
		searchEngineCont = $("<div class='searchEngineItem'></div>")
			.appendTo(container);
		$("<paper-input disabled class='SEIName'> <paper-input-decorator> <input disabled value='" + currentSearchEngine.name + "' class=\"actualinput\" /> <div class=\"underline\"> <div class=\"unfocused-underline\"></div> " +
				"<div class=\"focusedUnderline focused-underline\"></div> </div> </paper-input-decorator> </paper-input>")
			.appendTo(searchEngineCont);
		$("<paper-input disabled class='SEIUrl'> <paper-input-decorator> <input disabled value='" + currentSearchEngine.url + "' class=\"actualinput\" /> <div class=\"underline\"> <div class=\"unfocused-underline\"></div> " +
				"<div class=\"focusedUnderline focused-underline\"></div> </div> </paper-input-decorator> </paper-input>")
			.appendTo(searchEngineCont);
		$("<paper-input disabled class='SEISUrl'> <paper-input-decorator> <input disabled value='" + currentSearchEngine.searchUrl + "' class=\"actualinput\" /> <div class=\"underline\"> <div class=\"unfocused-underline\"></div> " +
				"<div class=\"focusedUnderline focused-underline\"></div> </div> </paper-input-decorator> </paper-input>")
			.appendTo(searchEngineCont);
		$("<paper-button class='addSE' raised><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Add</div></paper-ripple><paper-shadow> <div class=\"shadow-bot\"></div><div class=\"shadow-top\"></div> </paper-shadow></paper-button")
			.appendTo(searchEngineCont)
			.click(addImportedSearchEngine);
	}
}

function searchSearchBindings(searchEngines, el) {
	setTimeout(function () {
		var val = $(el).val();
		if (val !== "") {
			searchWorker.addEventListener("message", function (e) {
				//Update list
				var foundSearchEngines = $(".foundSearchEngines");
				foundSearchEngines.html("");
				showSearchEngineItems(e.data, foundSearchEngines);
				hideLoadingGif();
			});
			searchWorker.postMessage({ search: val, searchEngines: searchEngines });
		}
		else {
			showSearchEngineItems(searchEngines, $(".foundSearchEngines"));
			hideLoadingGif();
		}
	}, 0);
}

function showSearchEnginesList(searchEngines) {
	searchWorker = new Worker("searchWorker.js");
	$(".foundSearchEnginesCont").remove();
	var foundSearchEnginesCont = $("<div class=\"foundSearchEnginesCont\"></div>")
		.appendTo(".importSearchEngineCont");

	$(".searchSearchBindings").remove();
	var searchSearchBindingsCont = $("<div class='searchSearchBindings'></div>")
		.insertBefore(foundSearchEnginesCont);

	$("<div class='searchSearchBindingsTxt'>Seach Search-Bindings</div>")
		.appendTo(searchSearchBindingsCont);

	var searchSearchBindingsInput = $("<paper-input><paper-input-decorator>	<input class=\"actualinput\" /><div class=\"underline\"><div class=\"unfocused-underline\"></div><div class=\"focusedUnderline focused-underline\"></div></div></paper-input-decorator></paper-input>")
		.appendTo(searchSearchBindingsCont);

	searchSearchBindingsInput.click(function () {
		$(this).find(".actualinput").focus();
	});

	searchSearchBindingsInput.find("paper-input-decorator").click(function () {
		$(this).find(".actualinput").focus();
	});

	searchSearchBindingsInput
		.find(".actualinput")
		.keydown(function () {
			var elem = this;
			showLoadingGif();
			setTimeout(function () {
				searchSearchBindings(searchEngines, elem);
			}, 0);
		});

	$("<div class=\"SEBindingTxt\">Bindings:</div>" +
			"<div class=\"SEURLTxt\">Original URL</div>" +
			"<div class=\"SESEURLTxt\">Search URL:</div>")
		.appendTo(foundSearchEnginesCont);

	var foundSearchEngines = $("<div class='foundSearchEngines'></div>")
		.appendTo(foundSearchEnginesCont);

	showSearchEngineItems(searchEngines, foundSearchEngines);

	bindstuff(foundSearchEnginesCont);
	//bindstuff(searchSearchBindingsInput);
	hideLoadingGif();
}

function animateSeList(searchEngines) {
	$(".processSearchEngines .button-content")
		.html("Re-open");
	$(".importSearchEngineCont").stop().animate({
		marginTop: "40px"
	}, 250, function () {
		$(".importSearchEngineCont, .importSearchEngineCont .topShadowLayer, .importSearchEngineCont .bottomShadowLayer")
			.stop().animate({
				height: "695px"
			}, 150, function () {
				$(".importSearchEngineContainer textarea")
					.stop().animate({
						height: "20px"
					}, 150, function () {
						showSearchEnginesList(searchEngines);
					});
			});
	});
}

function hideSeList() {
	$(".foundSearchEnginesCont, .searchSearchBindings").remove();
	$(".processSearchEngines .button-content")
		.html("Process");
	$(".importSearchEngineCont").stop().animate({
		marginTop: "196px"
	}, 250, function () {
		$(".importSearchEngineCont, .importSearchEngineCont .topShadowLayer, .importSearchEngineCont .bottomShadowLayer")
			.stop().animate({
				height: "325px"
			}, 150, function () {
				$(".importSearchEngineContainer textarea")
					.stop().animate({
						height: "154px"
					}, 150);
			});
	});
}

function importSearchEngines(e) {
	ripplestuff($(this).children("paper-ripple")[0], e, false);
	if (searchEngineImportExpanded) {
		hideSeList();
		searchEngineImportExpanded = false;
	}
	else {
		searchEngineImportExpanded = true;
		var worker = new Worker("worker.js");
		var data = $(".importSearchBindingsTextArea").val();
		showLoadingGif();
		worker.addEventListener("message", function (e) {
			var structuredSearchEngines = e.data.searchEngines;
			$(".SEImportError").remove();
			if (structuredSearchEngines.length !== 0) {
				animateSeList(structuredSearchEngines);
			}
			else {
				hideLoadingGif();
				//Show error
				$("<div class=\"SEImportError>Could not process this data, please try and copy the data again</div>")
					.insertAfter($("importSearchBindingsInstructions"));
			}
			worker.terminate();
		});
		worker.postMessage(data);
	}
}

function searchEngineImport() {
	$("<div class=\"overlay\"></div>")
		.click(function () {
			hidePopup();
		})
		.insertBefore($("body").children().first())
		.animate({
			opacity: 1
		}, 400, "easeOutCubic");
	var importSearchEngineEl = $("<div class=\"importSearchEngineCont popup bodyColor\"></div>")
		.insertBefore($("body").children().first());

	$("<div class=\"topShadowLayer\"></div>")
		.appendTo(importSearchEngineEl);

	$("<div class=\"bottomShadowLayer\"></div>")
		.appendTo(importSearchEngineEl);

	var cont = $("<div class=\"importSearchEngineContainer\"></div>")
		.appendTo(importSearchEngineEl);

	$("<div class=\"bigTxt\">Import Search Bindings</div>")
		.appendTo(cont);

	$("<div class=\"importSearchBindingsInstructions\">" +
			"To import your search Bindings, right-click chrome's omnibar (the bar above all pages) and click \"manage search engines\". Then click on the text \"Search Engines\" on the top of this area" +
			", then press ctrl+a and after that press ctrl+c. Now come back to Binder and paste that into the box below and hit process" +
			"</div>")
		.appendTo(cont);

	$("<multiline-paper-input> <paper-input-decorator> <textarea rows=\"10\" class=\"paper-textarea importSearchBindingsTextarea\"></textarea> <div class=\"underline\"> <div class=\"unfocused-underline\"></div> <div class=\"focusedUnderline focused-underline\"></div> </div> </paper-input-decorator> </multiline-paper-input>")
		.appendTo(cont);

	var buttonCont = $("<div class=\"importSearchEnginesButtonCont\"></div>")
		.appendTo(cont);

	$("<div class=\"importSearchBindingsCancel\"><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Close</div></paper-ripple></div>")
		.click(function (e) {
			ripplestuff($(this).children("paper-ripple")[0], e, false);
			hidePopup();
		})
		.appendTo(buttonCont);

	$("<div class=\"processSearchEngines\"><paper-ripple><div class=\"bg\"></div><div class=\"waves\"></div><div class=\"button-content\">Process</div></paper-ripple></div>")
		.on("click", importSearchEngines)
		.appendTo(buttonCont);

	bindstuff(importSearchEngineEl);

	importSearchEngineEl.animate({
		marginLeft: 0
	}, 500, "easeOutCubic");
}

function bindListeners() {
	$(".input").keypress(handleOnKeyPress);
	$(".goButton").click(searchForBinding);
	$(".optionsButton").click(toggleSettings);
	$(".closeButton").click(function () {
		app.resizeTo(500, 100);
		app.close();
	});
	$(".minimizeButton").click(function () {
		app.minimize();
	});
	$(".hideSettings").click(hideSettings);
	$(".bindingInput, .rightInput").blur(function () {
		saveInputs($(this).parent().parent().parent());
	});
	$(".superSearchCheckbox").click(function () {
		var context = this;
		setTimeout(function () {
			var val = false;
			if ($(context).attr("on") === "true") {
				val = true;
				hideGoButton();
			}
			else {
				showGoButton();
			}
			updateSettings("superSearch", val);
		}, 0);
	});
	$(".closeBinderCheckbox").click(function () {
		var context = this;
		setTimeout(function () {
			var val = false;
			if ($(context).attr("on") === "true") {
				val = true;
			}
			updateSettings("closeBinder", val);
		}, 0);
	});
	$(".checkboxtext").click(function () {
		$(this).parent().children("paper-checkbox").mousedown().click();
	});
	$(".addDefaults").click(function () {
		addDefault($(this));
	});
	$(".fab").click(function () {
		ripplestuff($(this).children("paper-ripple")[0], "", true);
		addNewBindingAnimation();
	});
	$(".exportClear").click(clearTextarea);
	$(".exportExport").click(exportBindings);
	$(".importClear").click(clearTextarea);
	$(".importImport").click(importBindings);
	$(".searchEngineImport").click(searchEngineImport);
	$("body").click(hideShortcutInfo);
}

function main() {
	if (settings.superSearch) {
		$(".input").attr("size", "56");
		$(".submitButton").css("display", "none");
		hideGoButton();
	}
	else {
		bindstuff($(".submitButton"));
	}
	bindstuff($(".input"));
	app.focus();
	$(".input").focus().click();
	setTimeout(function() {
		updateInputs();
		if (app.getBounds().width !== 500 || app.getBounds().height !== 100) {
			app.resizeTo(500, 100);
		}
	}, 0);
	setTimeout(function () {
		bindstuff();
		checkAndUploadSettings(settings);
	}, 100);
}

storage.get(function (items) {
	settings = items;
	main();
});
bindListeners();