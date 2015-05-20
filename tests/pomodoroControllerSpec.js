describe('PomodoroCtrl', function(){
	var scope; //we'll use this scope in our tests
	var ctrl;
	var theInterval;
	var mockPomodoroService={
		startPomodoro:function(){
			scope.$emit('focNewPomodoroStarted','task',25);
		},
		getStatus:function(){
			return 'task';
		},
		getStatusDuration:function(){
			return 25;
		},
		foo:'bar'

	};
	// mock Application to allow us to inject our own dependencies
	beforeEach(angular.mock.module('foc-pomodoro'));
	//mock the controller for the same reason and include $rootScope and $controller
	beforeEach(angular.mock.inject(function($rootScope, $controller,$interval){
		theInterval=$interval;
		//create an empty scope
		scope = $rootScope.$new();
		//declare the controller and inject our empty scope
		ctrl=$controller('PomodoroCtrl', {$scope: scope,$interval:$interval,focPomodoroService:mockPomodoroService});
	}));
 
	// tests start here
	it('Starst a timer on count', function(){
		spyOn(mockPomodoroService, 'startPomodoro').and.callThrough();
		ctrl.start();
		expect(mockPomodoroService.startPomodoro).toHaveBeenCalled();
		theInterval.flush(1200);

		expect(ctrl.minutes).toEqual(0);
		expect(ctrl.seconds).toEqual(1);
	});

	it('Stops counting when the minute limit is reached',function(){
		ctrl.start();
		var duration=mockPomodoroService.getStatusDuration();
		theInterval.flush(duration*1000*60+200);
		expect(ctrl.seconds).toEqual(0);
		expect(ctrl.minutes).toEqual(duration);
	});
	// it('Starts counting when a new event is triggered ',function(){

	// });
	// it('Stops the count when it\'s cancelled',function(){
		
	// });

	
});