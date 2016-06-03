var Studio = require('studio');
var io = require('socket.io-client');
var localServices={};

var DEFAULT_NAMESPACE = '__browser';
var DEFAULT_SERVICE_CALL_EVENT_NAME = '__studio_service_call'
Studio.plugin = Studio.plugins || {};
Studio.plugin.client = function(options){
	var ip,socket;
	options = options || {};
	options.defaultNamespace = options.defaultNamespace || DEFAULT_NAMESPACE;
	options.serviceCallEventName = options.serviceCallEventName || DEFAULT_SERVICE_CALL_EVENT_NAME;
	socket = io(options.ip);
	return function(serviceListener,Studio){
		serviceListener.onStart(function(serv){localServices[serv.id] = true; });
        serviceListener.onStop( function(serv){localServices[serv.id] = false;});
		serviceListener.interceptSend(function(send,rec){
	        return function() {
	        	var args = arguments;
	        	if(localServices[rec]){
	        		return send.apply(this,args);
	        	}else{
	        		return new Studio.promise(function(resolve,reject){
	        			socket.emit(options.serviceCallEventName,JSON.stringify({
		        			service:rec,
		        			params: Array.prototype.slice.call(args)
	        			}),function(result){
	        				if(result.error){
	        					return reject(result.error);
	        				}
	        				resolve(result.response);
	        			});
	        		});
	        	}
	        };
	    });
	};
}

window.Studio = Studio;
