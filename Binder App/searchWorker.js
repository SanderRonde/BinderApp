function searchData(query, data) {
	var matchingData = [];
	var currentData;
	for (var i = 0; i < data.length; i++) {
		currentData = data[i];
		if (currentData.name.indexOf(query) > -1) {
			matchingData.push(currentData);
		}
	}
	postMessage(matchingData);
}

self.addEventListener('message', function(e) {
	var data = e.data;
	searchData(data.search, data.searchEngines);
}, false);