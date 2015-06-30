var pageLoadSettings = {};

function colorDefault(type) {
	switch (type) {
		case 'bg':
			return '#3C92FF';
			break;
		case 'title':
		case 'text':
			return '#FFFFFF';
			break;
		case 'shadow':
			return 'rgba(0,0,0,0.37)';
			break;
	}
}

function checkColor(color, type) {
	if (!color) {
		return colorDefault(type);
	}
	if (type === 'shadow' && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
		//Shadow and rgb, convert
		var bgColorsSplit = color.split('#')[1];
		var bgR = parseInt(bgColorsSplit.slice(0, 1), 16) * 16 + parseInt(bgColorsSplit.slice(1, 2), 16);
		var bgG = parseInt(bgColorsSplit.slice(2, 3), 16) * 16 + parseInt(bgColorsSplit.slice(3, 4), 16);
		var bgB = parseInt(bgColorsSplit.slice(4, 5), 16) * 16 + parseInt(bgColorsSplit.slice(5, 6), 16);
		var rgbColors = {
			'R': bgR,
			'G': bgG,
			'B': bgB
		};
		return 'rgba(' + bgR + ', ' + bgG + ', ' + bgB + ', 0.35)';
	}
	if (type === 'shadow' && /rgb\(([0-9])*,([0-9])*,([0-9])*\)/.test(color)) {
		var split = color.split('rgb(')[1].split(')')[0].split(',');
		split.push('0.37')
		return 'rgba(' + split.join(',') + ')'
	}
	if ((type === 'shadow' && !/rgb\(([0-9])*,([0-9])*,([0-9])*\)|rgba\(([0-9])*,([0-9])*,([0-9])*,0.([0-9])*\)/ .test(color)) || type !== 'shadow' && !/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
		return colorDefault(type);
	}
	return color;
}

chrome.storage.sync.get(function(items) {
	pageLoadSettings.superSearch = items.superSearch || false;
	
	//Check the theme string
	if (items.theme !== 'none' && items.theme !== 'blue' && items.theme !== 'black' && items.theme !== 'white' && items.theme !== 'red') {
		pageLoadSettings.theme = 'none';
	}
	else {
		pageLoadSettings.theme = items.theme;
	}

	//Check the colors object
	items.colors.bg = checkColor(items.colors.bg, 'bg');
	items.colors.title = checkColor(items.colors.title, 'title');
	items.colors.text = checkColor(items.colors.text, 'text');
	console.log(items.colors.shadow);
	items.colors.shadow = checkColor(items.colors.shadow, 'shadow');
	console.log(items.colors.shadow);

	pageLoadSettings.colors = items.colors;
});

function launchBinder() {
	var urlToLoad = (pageLoadSettings.superSearch ? 'html/withSuperSearch' : 'html/withoutSuperSearch');
	if (pageLoadSettings.theme !== 'none' && pageLoadSettings.theme !== 'blue') {
		urlToLoad += '.' + pageLoadSettings.theme;
	}
	urlToLoad += '.html';
	console.log(urlToLoad);
	chrome.app.window.create(urlToLoad, {
		bounds: {
			width: 500,
			height: 100,
			left: 100,
			top: 500
		},
		id: 'mainwindow',
		minWidth: 500,
		minHeight: 60,
		maxWidth: 1000,
		maxHeight: 755,
		frame: 'none',
		resizable: false
	}, function (createdWindow) {
		console.log(pageLoadSettings.colors);
		createdWindow.contentWindow.interfaceColors = pageLoadSettings.colors;
		createdWindow.contentWindow.superSearch = pageLoadSettings.superSearch;
		createdWindow.contentWindow.theme = pageLoadSettings.theme;
	});
}

chrome.app.runtime.onLaunched.addListener(function () {
	launchBinder();
});

function launchWebsite(command, websites, shortcuts) {
	var bindingNum = command.split('launch_binding_')[1];
	bindingNum = parseInt(bindingNum, 10);
	var websitesArray = websites[shortcuts.indexOf(bindingNum)].split(',');
	websitesArray.forEach(function(item) {
		window.open(item, '_blank');
	});
}

chrome.commands.onCommand.addListener(function (command) {
	switch (command) {
		case 'launch_binder':
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
	console.log(message);
	switch (message.cmd) {
		case 'getKeyBindings':
			chrome.commands.getAll(function (commands) {
				if (commands.length > 0) {
					chrome.runtime.sendMessage({ "keyBindings": commands });
				}
			});
			break;
		case 'updateVal':
			console.log('updating');
			pageLoadSettings[message.type] = message.val;
			break;
		case 'updateValFromStorage':
			chrome.storage.sync.get(function (items) {
				pageLoadSettings.superSearch = items.superSearch || false;

				//Check the theme string
				if (items.theme !== 'none' && items.theme !== 'blue' && items.theme !== 'black' && items.theme !== 'white' && items.theme !== 'red') {
					pageLoadSettings.theme = 'none';
				}
				else {
					pageLoadSettings.theme = items.theme;
				}

				//Check the colors object
				items.colors.bg = checkColor(items.colors.bg, 'bg');
				items.colors.title = checkColor(items.colors.title, 'title');
				items.colors.text = checkColor(items.colors.text, 'text');
				items.colors.shadow = checkColor(items.colors.shadow, 'shadow');

				pageLoadSettings.colors = items.colors;
			});
			break;
	}
});