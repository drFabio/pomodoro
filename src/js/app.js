// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('foc-app', ['ionic','foc-pomodoro'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		$stateProvider

	// setup an abstract state for the tabs directive
		.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})
		.state('tab.pomodoro', {
		url: '/pomodoro',
		views: {
			'tab-pomodoro': {
				templateUrl: 'templates/pomodoro.html',
				controller: 'PomodoroCtrl as ctrl'
			}
		}
	})
	.state('tab.tasks', {
		url: '/tasks',
		views: {
			'tab-tasks': {
				templateUrl: 'templates/tasks.html',
				controller: 'TasksCtrl as ctrl'
			}
		}
	})
		$urlRouterProvider.otherwise('/tab/pomodoro');

}]);