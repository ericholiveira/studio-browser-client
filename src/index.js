var Studio = require('studio');
var io = require('socket.io-client');
var localServices={};

var DEFAULT_NAMESPACE = '__browser';
var DEFAULT_SERVICE_CALL_EVENT_NAME = '__studio_service_call';
Studio.plugin = Studio.plugins || {};
/**
 * Plugin for socketio browser access
 * @constructor
 * @author Erich Oliveira
 * @public
 * @param {Object} options
 * @param {String} options.defaultNamespace the module name which will prepend the service automatically instantiated for browser access. Defaults to __browser
 * @param {String} options.serviceCallEventName The name of the channel used to communicate the services. Defaults to __studio_service_call
 * @param {String} options.ip Server address (format: http://SOMEADDRESS:SOMEPORT/). Defaults to socket.io default
 * @param {String} options.io socket io client object (add this if you dont want to pass ip:port)
 * @default {
		defaultNamespace:'__browser',
		serviceCallEventName:'__studio_service_call'
 	}
 * @example 
   Studio.use(Studio.plugin.client({ip:'http://localhost:3000/'}));
 */
function BrowserClient(options){
	var ip,socket;
	options = options || {};
	options.defaultNamespace = options.defaultNamespace || DEFAULT_NAMESPACE;
	options.serviceCallEventName = options.serviceCallEventName || DEFAULT_SERVICE_CALL_EVENT_NAME;
	socket = options.io || io(options.ip);
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
Studio.plugin.client = BrowserClient;

window.Studio = Studio;
