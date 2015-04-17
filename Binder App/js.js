/// <reference path="~/Scripts/jquery-2.0.3.min.js" />
/// <reference path="~/Scripts/jquery-2.0.3.min.js" />
/// <reference path="~/Scripts/jquery-2.0.3.min.js" />
/// <reference path="~/Scripts/polymer.js" />
var storage = chrome.storage.sync;
var app = chrome.app.window.current();
var settings = {};
var searchWebsites = [];
var searchMode = false;

function isset(dataToCheck) {
	if (dataToCheck === undefined || dataToCheck === null) {
		return false;
	}
	return true;
}

function updateSettings(key, data) {
	var obj = {};
	if (typeof key === "object") {
		for (objKey in key) {
			if (key.hasOwnProperty(objKey)) {
				obj = {};
				obj[objKey] = key[objKey];
				storage.set(obj);
				settings[objKey] = key[objKey];
			}
		}
	}
	else {
		obj[key] = data;
		storage.set(obj);
		settings[key] = data;
		console.log(settings);
	}
}

function loadBindings() {
	$(".bindingsContainer").html('');
	$('<div class="bindingTxt">Bindings:</div>\
				<div class="URLTxt">Websites:</div>')
		.appendTo($(".bindingsContainer"));
	var bindings = settings.bindings;
	var websites = settings.websites;
	$('<paper-button class="addInputs" raised><paper-ripple><div class="bg"></div><div class="waves"></div><div class="button-content">Add Inputs</div></paper-ripple>' +
			'<paper-shadow> <div class="shadow-bot"></div><div class="shadow-top"></div> </paper-shadow></paper-button>')
		.click(function() {
			addInputField($(this).parent());
		})
		.appendTo($(".bindingsContainer"));
	console.log(bindings.length);
	if (bindings.length > 0) {
		console.log("in");
		addInputField($(".bindingsContainer"), false, true, bindings[0], websites[0]);
		for (var i = 1; i < bindings.length; i++) {
			addInputField($(".bindingsContainer"), false, false, bindings[i], websites[i]);
		}
	}
}

function animateGreenBorder(element) {
	var start = null;
	function step2(timestamp) {
		if (!start) start = timestamp;
		var progress = timestamp - start;
		element.style.border = "3px solid rgba(0,124,0," + (1 - Math.min(progress/500, 200)) + ")";
		if (progress < 500) {
			window.requestAnimationFrame(step2);
		}
	}
	function step(timestamp) {
		if (!start) start = timestamp;
		var progress = timestamp - start;
		element.style.border = "3px solid rgba(0,124,0," + Math.min(progress/100, 200) + ")";
		if (progress < 100) {
			window.requestAnimationFrame(step);
		}
		else {
			start = null;
			setTimeout(function() {
				window.requestAnimationFrame(step2);
			}, 1000);
		}
	}
	window.requestAnimationFrame(step);
}

function removeError(element) {
	element.css("margin-bottom", "0px");
	element.find(".unfocused-underline").css("background-color", "rgb(117, 117, 117)");
	element.find(".focused-underline").css("background-color", "rgb(255, 255, 255)");
}

function showError(element, error) {
	element.css("margin-bottom", "-20px").children("paper-input-decorator").children(".footer").remove();
	element.find(".underline").children().css("background-color", "rgb(255, 145, 0)");
	$('<div class="footer" layout="" horizontal="" end-justified=""><div class="error" flex="" layout="" horizontal="" center=""><div class="error-text" flex="" auto="" role="alert"\
aria-hidden="false">'  + error + '</div><core-icon id="errorIcon" class="error-icon" icon="warning" aria-label="warning" role="img"><svg \
viewBox="0 0 24 24" height="100%" width="100%"\
preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg></core-icon>\
</div><div aria-hidden="true"><content select=".counter"></content></div></div>')
		.appendTo(element.children("paper-input-decorator"));
}

function checkBindingsForErrors(bindings, websites, bindingElements, websiteElements) {
	var binding;
	if (settings.superSearch) {
		for (var i = 0; i < bindings.length; i++) {
			removeError(bindingElements[i]);
			binding = bindings[i];
			for (var j = 0; j < bindings.length; j++) {
				if (binding.indexOf(bindings[j]) === 0 && i !== j) {
					showError(bindingElements[i], "Binding will never be triggered");
				}
			}
		}
	}
}

function saveInputs(sourceElement) {
	var bindings = [];
	var websites = [];
	var bindingElements = [];
	var websiteElements = [];
	sourceElement
		.parent()
		.children(".inputsField").each(function() {
			$(this).find(".bindingInput")
				.each(function() {
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
					websiteElements.push($(this).parent().parent());
				});
		});
	updateSettings("bindings",bindings);
	updateSettings("websites",websites);
	if (sourceElement.parent().attr("class") === "firstTimeInputs") {
		loadBindings();
	}
	sourceElement
		.find(".bindingInput, .rightInput")
		.each(function() {
			animateGreenBorder(this);
		});
	checkBindingsForErrors(bindings, websites, bindingElements, websiteElements);
}

function removeField(element) {
	var parent = element.parent();
	var index = 0;
	var confirmedIndex;
	//Get this item's index of all the bindings
	element
		.parent()
		.parent()
		.children()
		.each(function() {
			index++;
			if ($(this) === parent) {
				confirmedIndex = index;
			}
		});
	var bindings = settings.bindings;
	var websites = settings.websites;
	bindings.splice(confirmedIndex,1);
	websites.splice(confirmedIndex,1);
	updateSettings("bindings",bindings);
	updateSettings("websites",websites);
	element.parent().remove();
}

function addInputField(sourceElement, dontAddNew, noRemoveButton, firstInputVal, secondInputVal) {
	console.log(sourceElement);
	var input = $('<div class="inputsField"></div>')
		.insertBefore(sourceElement.children().last());

	var leftInput = $('<paper-input class="settingsInput inputCont"><paper-input-decorator><input class="actualinput bindingInput"' + ((firstInputVal !== undefined) ? (' value="' + firstInputVal + '"') : "") + '/>\
<div class="underline"><div class="unfocused-underline"></div><div class="focusedUnderline focused-underline"></div></div></paper-input-decorator>\
</paper-input>')
		.appendTo(input);

	leftInput
		.find(".actualinput")
		.blur(function() {
			saveInputs($(this).parent().parent().parent());
		});

	var rightInput = $('<paper-input class="settingsInput inputCont"><paper-input-decorator><input class="actualinput rightInput"' + ((secondInputVal !== undefined) ? (' value="' + secondInputVal + '"') : "") + ' />\
<div class="underline"><div class="unfocused-underline"></div><div class="focusedUnderline focused-underline"></div></div></paper-input-decorator>\
					</paper-input>')
		.css("margin-left", "3px")
		.appendTo(input);

	rightInput
		.find(".actualinput")
		.blur(function() {
			saveInputs($(this).parent().parent().parent());
		});

	if (noRemoveButton === false || noRemoveButton === undefined) {
		$('<paper-button class="removeInput" raised><paper-ripple><div class="bg"></div><div class="waves"></div><div class="button-content">x</div></paper-ripple><paper-shadow>\
<div class="shadow-bot"></div><div class="shadow-top"></div> </paper-shadow></paper-button>')
			.click(function() {
				removeField($(this));
			})
			.appendTo(input);
	}

	if (dontAddNew === undefined) {
		var bindings = settings.bindings;
		var websites = settings.websites;
		bindings.push("");
		websites.push("");
		console.log(bindings);
		console.log(websites);
		updateSettings("bindings", bindings);
		updateSettings("websites", websites);
	}
	bindstuff();
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
		"closeBinder": true,
		"superSearch": false
	});
	var fa = chrome.app.window.current();
	fa.resizeTo(700, 755);
	$(".draggablearea").css("width", "628px");
	$(".firstTimeContainer").css("display", "block");
	$(".hideSettings").css("display", "none");
	$(".toSettingsFromFirstTime").click(function () {
		console.log("deze?");
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
		addInputField($(this).parent());
	});
}

function searchBinding(websites) {
	$(".actualinput").attr("placeholder","Your search query").val("");
	searchWebsites = websites;
	searchMode = true;
}

function openWebsites(website) {
	var sites = [];
	sites = website.split(",");
	var search = false;
	//Search all of them for search things
	for (var i = 0; i < sites.length; i++) {
		if (sites[i].indexOf("%s") > -1) {
			search = true;
		}
	}
	if (search) {
		searchBinding(sites);
	}
	else {
		for (var i = 0; i < sites.length; i++) {
			window.open(sites[i],"_blank");
		}
	}
	if (settings.closeBinder) {
		app.close();
	} else {
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
	setTimeout(function() {
		var input = $(".input").val();
		for (var i = 0; i < searchWebsites.length; i++) {
			openWebsites(searchWebsites[i].replace("%",input));
		}
	},0);
}

function searchForBinding(){
	if (searchMode) {
		handleSearchBinding();
	}
	else {
		setTimeout(function(){
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
		},0);
	}
}

function handleOnKeyPress() {
	if (settings.superSearch && !searchMode) {
		searchForBinding();
	}
}

function showSettings() {
	$(".hideSettings").css("display","inline-block");
	$(".draggablearea").css("width","628px");
	app.resizeTo(700, 755);
}

function hideSettings() {
	$(".draggablearea").css("width","428px");
	app.resizeTo(500, 100);
}

function toggleSettings(show) {
	if (show === true) {
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
			$(".bgColor").css("background-color",color).css("color",color);
			$(".customColorBg").remove();
			$('<style class="customColorBg" type="text/css">\
body { background-color: '  + color + '; }</style>')
				.appendTo("head");
		break;
		case "title":
			$(".titleColor").css("background-color",color).css("color",color);
			$(".customColorTitle").remove();
			$('<style class="customColorTitle" type="text/css">\
#topbar { background-color: '  + color + '; }</style>')
				.appendTo("head");
		break;
		case "text":
			$(".textColor").css("background-color",color).css("color",color);
			$('<style class="customColorTxt" type="text/css">\
body { color: ' + color + '; }</style>\
paper-input-decorator .focused-underline { background-color:#FFFFFF; }</style>')
				.appendTo("head");
		break;
	}
}

function rgbToHex(r, g, b) {
	 return toHex(r) + toHex(g) + toHex(b)
}

function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) return "00";
	n = Math.max(0, Math.min(n, 255));
	return "0123456789ABCDEF".charAt((n - n % 16) / 16)
		+ "0123456789ABCDEF".charAt(n % 16);
}

function saveColors(change, color) {
	color = "#" + color;
	var colors = settings.colors;
	colors[change] = color;
	updateSettings({"colors":colors});
}

function showGoButton(){
	$(".goButton").css("display", "inline-block");
	$(".mainInputCont").css("width", "350px");
	$(".mainInputCont .unfocused-underline").css("width", "350px");
	$(".hideSettings").css("margin-left", "20px");
}

function hideGoButton() {
	$(".goButton").css("display", "none");
	$(".mainInputCont").css("width", "442px");
	$(".mainInputCont .unfocused-underline").css("width", "442px");
	$(".hideSettings").css("margin-left","36px");
}

function addDefault(element) {
	var tr = element.parent().parent();
	var binding = tr.children().first().children().first().children().first().children(".actualinput").val();
	var website = $(tr.children()[1]).children().first().html();

	var bindings = settings.bindings;
	var websites = settings.websites;

	bindings.push(binding);
	websites.push(websites);

	updateSettings("bindings", bindings);
	updateSettings("Websites", websites);

	loadBindings();
}

function addNewBinding() {
	var binding = $(".newBindingInput .actualinput").first().val();
	var website = $(".newBindingInput .actualinput").last().val();

	var bindings = settings.bindings;
	var websites = settings.websites;
	bindings.push(binding);
	websites.push(website);

	updateSettings("bindings", bindings);
	updateSettings("websites", websites);
	//addInputField();
	loadBindings();
}

function hideNewBindingAnimation() {
	$(".overlay").animate({
		opacity: 0
	}, 200, "easeInCubic");
	$(".newBindingPopup").animate({
		marginLeft: "100%"
	}, 250, "easeInCubic", function() {
		$(this).remove();
		$(".overlay").remove();
	});
}

function addNewBindingAnimation() {
	$('<div class="overlay"></div>')
		.click(function() {
			hideNewBindingAnimation();
		})
		.insertBefore($("body").children().first())
		.animate({
			opacity: 1
		}, 400, "easeOutCubic");
	var newBindingEl = $('<div class="newBindingPopup"></div>')
		.insertBefore($("body").children().first());

	$('<div class="topShadowLayer"></div>')
		.appendTo(newBindingEl);

	$('<div class="bottomShadowLayer"></div>')
		.appendTo(newBindingEl);

	var cont = $('<div class="addNewContainer"></div>')
		.appendTo(newBindingEl);

	$('<div class="newBindingTxt">Add Binding</div>')
	.appendTo(cont);

	var input = $('<div class="inputsField"></div>')
		.appendTo(cont);

	$('<paper-input class="newBindingInput inputCont"><paper-input-decorator><input placeholder="Binding" class="actualinput bindingInput" />\
<div class="underline"><div class="unfocused-underline"></div><div class="focusedUnderline focused-underline"></div></div></paper-input-decorator>\
</paper-input>')
		.appendTo(input);

	$('<paper-input class="newBindingInput inputCont"><paper-input-decorator><input placeholder="Website" class="actualinput rightInput" />\
<div class="underline"><div class="unfocused-underline"></div><div class="focusedUnderline focused-underline"></div></div></paper-input-decorator>\
					</paper-input>')
		.css("margin-left", "3px")
		.appendTo(input);

	var buttonCont = $('<div class="addBindingButtonCont"></div>')
		.appendTo(cont);

	$('<div class="addBindingCancel"><paper-ripple><div class="bg"></div><div class="waves"></div><div class="button-content">Cancel</div></paper-ripple></div>')
		.click(function () {
			ripplestuff($(this).children("paper-ripple")[0], "", false);
			hideNewBindingAnimation();
		})
		.appendTo(buttonCont);

	$('<div class="addBindingAdd"><paper-ripple><div class="bg"></div><div class="waves"></div><div class="button-content">Add</div></paper-ripple></div>')
		.click(function () {
			ripplestuff($(this).children("paper-ripple")[0], "", false);
			addNewBinding();
		})
		.appendTo(buttonCont);

	newBindingEl.animate({
		marginLeft: 0
	}, 500, "easeOutCubic", function () {
		addNewBinding();
	});
}

function clearTextarea() {
	var textArea = $(this).parent().parent().find("textarea");
	textArea.html("");
}

function checkAndUploadSettings(obj) {
	console.log(obj);
	var changes = false;
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
			changes = true;
			obj.websites = [""];
		}
		var websitesAmount = obj.websites.length;
		var bindingsAmount = obj.bindings.length;
		if (bindingsAmount > websitesAmount) {
			changes = true;
			for (var i = 0; i < (bindingsAmount - websitesAmount) ; i++) {
				obj.bindings.push("");
			}
		}
		else if (bindingsAmount < websitesAmount) {
			changes = true;
			for (var i = 0; i < (websitesAmount - bindingsAmount) ; i++) {
				obj.websites.push("");
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
	}
	console.log(obj);
	if (changes) {
		updateSettings(JSON.stringify(obj));
	}
}

function importError() {
	$(".importError").remove();
	$('<div clas="importError">No settings can be derived from this text</div>')
		.insertBefore(".importButtonsCont");
}

function importBindings() {
	var textArea = $(this).parent().parent().find("textarea");
	var JSONText = textArea.val();
	try {
		var importedSettings = JSON.parse(JSONText);
		checkAndUploadSettings(importedSettings);
	}
	catch (e) {
		importError();
	}
}

function exportBindings() {
	var textArea = $(this).parent().parent().find("textarea");
	var settingsJSON = JSON.stringify(settings);
	textArea.html(settingsJSON);
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
	$('<style class="customColorBg" type="text/css">\
body { background-color: '  + settings.colors.bg + '; }</style>')
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
	$('<style class="customColorInput" type="text/css">\
input { background-color: '  + settings.colors.input + '; }</style>')
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
	$('<style class="customColorTxt" type="text/css">\
body { color: '  + settings.colors.text + '; }\
paper-input-decorator .focused-underline { background-color:#FFFFFF; }</style>')
		.appendTo("head");

	$(".superSearchCheckbox").attr("on", (settings.superSearch ? "true" : "false"));
	$(".closeBinderCheckbox").attr("on", (settings.closeBinder ? "true" : "false"));
	bindstuff();
}

function reOpenSearchEngineImportInput() {

}

function showSearchEnginesList(searchEngines) {
	//HIERZO
	//TODO HIERZO
	var foundSearchEnginesCont = $('<div class="foundSearchEnginesCont"></div>')
		.appendTo(".importSearchEngineCont");

	$('<div class="SEBindingTxt">Bindings:</div>' +
			'<div class="SEURLTxt">Original URL</div>' +
			'<div class="SESEURLTxt">Search URL:</div>')
		.appendTo($(".bindingsContainer"));
}

function animateSEList(searchEngines) {
	$(".processSearchEngines .button-content")
		.html("Re-open")
		.off("click", importSearchEngines)
		.on("click", reOpenSearchEngineImportInput);
	$(".importSearchEngineCont").animate({
		marginTop: "40px"
	}, 250, function() {
		$(".importSearchEngineCont, .importSearchEngineCont .topShadowLayer, .importSearchEngineCont .bottomShadowLayer")
			.animate({
				height: "650px"
			}, 150, function() {
				$('.importSearchEngineContainer textarea')
					.animate({
						height: "20px"
					}, 150, function() {
						showSearchEnginesList(searchEngines);
					});
			});
	});
}

function importSearchEngines() {
	ripplestuff($(this).children("paper-ripple")[0], "", false);
	var data = $(".importSearchBindingsTextArea").html();
	data = data.split("\n");
	var searchEngines = {searchEngines: []};
	var bindingName;
	var bindingUrl;
	var searchBindingUrl;

	bindingName = data[4];
	bindingUrl = data[5];
	searchBindingUrl = data[6];

	var o = 8;
	var obj = {};
	while (bindingName !== "" && bindingUrl !== "" && searchBindingUrl !== "") {
		bindingName = data[o];
		o++;
		bindingUrl = data[o];
		o++;
		searchBindingUrl = data[o];
		o += 2;

		if (bindingUrl === "" && searchBindingUrl !== "") {
			//We are past the first box
			o -= 2;
			bindingName = data[o];
			o++;
			bindingUrl = data[o];
			o++;
			searchBindingUrl = data[o];
			o += 2;
		}
		else if (bindingUrl === "" && searchBindingUrl === "") {
			//The end of the search engines
			break;
		}

		obj = {
			name: bindingName,
			url: bindingUrl,
			searchUrl: searchBindingUrl
		};
		searchEngines.searchEngines.push(obj);
	}
	animateSEList(searchEngines);
}

function hideSearchEngineImport() {
	ripplestuff($(this).children("paper-ripple")[0], "", false);
	$(".overlay").animate({
		opacity: 0
	}, 200, "easeInCubic");
	$(".importSearchEngineCont").animate({
		marginLeft: "100%"
	}, 250, "easeInCubic", function() {
		$(this).remove();
		$(".overlay").remove();
	});
}

function searchEngineImport() {
	$('<div class="overlay"></div>')
		.click(function () {
			importSearchEngines();
		})
		.insertBefore($("body").children().first())
		.animate({
			opacity: 1
		}, 400, "easeOutCubic");
	var importSearchEngineEl = $('<div class="importSearchEngineCont"></div>')
		.insertBefore($("body").children().first());

	$('<div class="topShadowLayer"></div>')
		.appendTo(importSearchEngineEl);

	$('<div class="bottomShadowLayer"></div>')
		.appendTo(importSearchEngineEl);

	var cont = $('<div class="importSearchEngineContainer"></div>')
		.appendTo(importSearchEngineEl);

	$('<div class="bigTxt">Import Search Bindings</div>')
		.appendTo(cont);

	$('<div class="importSearchBindingsInstructions">' +
			'To import your search Bindings, right-click chrome\'s omnibar (the bar above all pages) and click "manage search engines". Then click on the text "Search Engines" on the top of this area' +
			', then press ctrl+a and after that press ctrl+c. Now come back to Binder and paste that into the box below and hit process' +
			'</div>')
		.appendTo(cont);

	$('<multiline-paper-input> <paper-input-decorator> <textarea class="importSearchBindingsTextArea" spellcheck="false" rows="10" class="paper-textarea"></textarea> <div class="underline"> <div class="unfocused-underline"></div> <div class="focusedUnderline focused-underline"></div> </div> </paper-input-decorator> </multiline-paper-input>')
		.appendTo(cont);

	var buttonCont = $('<div class="importSearchEnginesButtonCont"></div>')
		.appendTo(cont);

	$('<div class="importSearchBindingsCancel"><paper-ripple><div class="bg"></div><div class="waves"></div><div class="button-content">Cancel</div></paper-ripple></div>')
		.on("click",hideSearchEngineImport)
		.appendTo(buttonCont);

	$('<div class="processSearchEngines"><paper-ripple><div class="bg"></div><div class="waves"></div><div class="button-content">Process</div></paper-ripple></div>')
		.click(importSearchEngines)
		.appendTo(buttonCont);

	importSearchEngineEl.animate({
		marginLeft: 0
	}, 500, "easeOutCubic", function () {
		addNewBinding();
	});
}

function bindListeners() {
	$(".input").keypress(handleOnKeyPress);

	$(".submitButton").click(searchForBinding);

	$(".optionsButton").click(toggleSettings);

	$(".closeButton").click(function () {
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
		setTimeout(function() {
			var val = false;
			if ($(context).attr("on") === "true") {
				val = true;
			}
			updateSettings("superSearch", val);
		},0);
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

	$(".checkboxtext").click(function() {
		$(this).parent().children("paper-checkbox").mousedown().click();
	});

	$(".addDefaults").click(function () {
		addDefault($(this))
	});

	$(".fab").click(function (e) {
		ripplestuff($(this).children("paper-ripple")[0], "", true);
		addNewBindingAnimation();
	});

	$(".exportClear").click(clearTextarea);

	$(".exportExport").click(exportBindings);

	$(".importClear").click(clearTextarea);

	$(".importImport").click(importBindings);

	$(".searchEngineImport").click(searchEngineImport);
}

function main() {
	$(document).ready(function () {
		//Set to proper dimensions
		if (app.getBounds().width !== 500 || app.getBounds().height !== 100) {
			app.resizeTo(500, 100);
		}
		checkAndUploadSettings(settings);

		if (settings.superSearch) {
			$(".input").attr("size","56");
			$(".submitButton").css("display","none");
		}

		loadBindings();

		updateInputs();

		console.log(settings);

		if (settings.superSearch) {
			hideGoButton();
		}

		setTimeout(function() {
			app.focus();
			$(".input").focus().click();
		}, 0);
	});
}

storage.get(function(items) {
	settings = items;
	main();
});

bindListeners();