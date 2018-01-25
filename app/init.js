webApp = angular.module('WebApp', []);


webApp.config(['$httpProvider', function($httpProvider) {

	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var param=function(k){var b="",c,f,d;for(c in k){var a=k[c];if(a instanceof Array)for(d=0;d<a.length;++d){var g=a[d];var h=c+"["+d+"]";var e={};e[h]=g;b+=param(e)+"&"}else if(a instanceof Object)for(f in a)g=a[f],h=c+"["+f+"]",e={},e[h]=g,b+=param(e)+"&";else void 0!==a&&null!==a&&(b+=encodeURIComponent(c)+"="+encodeURIComponent(a)+"&")}return b.length?b.substr(0,b.length-1):b};

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];

}]);




webApp.run(['$rootScope', function($rootScope) {
	
	// callback for FB authentication
	$window.statusChangeCallback = function(response) {
		return false;
		var accessToken = response && response.authResponse && response.authResponse.accessToken ? 
			response.authResponse.accessToken : false;
		
		$rootScope.$apply(function() {
			if (response.status === 'connected') {
				
				// temporarily set the logged in user
				$rootScope.loggedInUser = true;
				
				// update the access token on the server side
				$http({
					method: 'post', 
					url: 'api/set_access_token.php',
					data: {
						access_token: accessToken
					}
				}).then(function(res) {
					$rootScope.hasRestrictedAccess = res.data.has_restricted_access;
				}, function() {
					alert('could not authenticate the server');
				});
				
				// get logged in user details
				FB.api('/me', function(response) {
					$rootScope.$apply(function() {
						$rootScope.loggedInUser = response;
					});
				});
				
			} else {
				$rootScope.loggedInUser = false;
			}
			
			$rootScope.loginInProcess = false;
		});
	};
	
	$window.fbAsyncInit = function() {
		return false;
		FB.init({
			appId: '1464574370233315',
			cookie: true,
			xfbml: true,
			version: 'v2.8'
		});
		
		FB.AppEvents.logPageView();
		
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	};

	(function(d, s, id) {
		return false;
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
}]);


