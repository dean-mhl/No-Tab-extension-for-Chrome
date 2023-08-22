function blockRequest(details) {
   return {cancel: true};
}

function getToggle(callback) { 
  chrome.storage.local.get('toggle', function(data){
	if(data.toggle === undefined) {
	  callback(true); 
	} else {
	  callback(data.toggle);
	}
  });
}

function setToggle(value, callback){ 
  chrome.storage.local.set({toggle : value}, function(){
	if(chrome.runtime.lastError) {
	  throw Error(chrome.runtime.lastError);
	} else {
	  callback();
	}
  });
}	

function setIcon(value){
  var path = (value)?"tab32.png":"no-tab32.png";
  chrome.browserAction.setIcon({path: path});
}
	
chrome.browserAction.onClicked.addListener( function(tab) {
  getToggle(function(toggle){
    toggle = !toggle;
    setToggle(toggle, function(){
      if(toggle){
		chrome.browserAction.setIcon({path: "no-tab32.png"});
		chrome.browserAction.setTitle({title :"Chat tab is disabled. Click to enable"});
		chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: ["*://*.libanswers.com/load_chat.php?hash=890831122dfeb065f892b6e00120952b","*://*.libanswers.com/load_chat.php?hash=2a486de8fad66de103e89c641ee2cf9d"]}, ['blocking']);
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
	  } else {
		chrome.browserAction.setIcon({path: "tab32.png"});
		chrome.browserAction.setTitle({title :"Chat tab is enabled. Click to disable."});
		chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
      }
    });
  });
});  
	