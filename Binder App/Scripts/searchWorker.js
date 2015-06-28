var currentSearch = null;

function SearchQuery(query, data) {
	this.active = true;
	var thisFunction = this;

	this.search = function() {
		var matchingData = [];
		var currentData;
		for (var i = 0; i < data.length && thisFunction.active; i++) {
			currentData = data[i];
			if (currentData.name.indexOf(query) > -1) {
				matchingData.push(currentData);
			}
		}
		postMessage(matchingData);
	}();

	this.stop = function() {
		this.active = false;
	}
}

self.addEventListener('message', function(e) {
	var data = e.data;
	if (currentSearch !== null) {
		currentSearch.stop();
	}
	currentSearch = new SearchQuery(data.search, data.data);
}, false);