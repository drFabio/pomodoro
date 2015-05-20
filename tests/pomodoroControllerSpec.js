describe('PomodoroCtrl', function(){
	var scope; //we'll use this scope in our tests
	var ctrl;
	var theInterval;
	// mock Application to allow us to inject our own dependencies
	beforeEach(angular.mock.module('foc-pomodoro'));
	//mock the controller for the same reason and include $rootScope and $controller
	beforeEach(angular.mock.inject(function($rootScope, $controller,$interval){
		theInterval=$interval;
		//create an empty scope
		scope = $rootScope.$new();
		//declare the controller and inject our empty scope
		ctrl=$controller('PomodoroCtrl', {$scope: scope,$interval:$interval});
	}));
 
	// tests start here
	it('should have be able to start a timer', function(done){
		ctrl.startCount();
		theInterval.flush(1200);
		expect(ctrl.minutes).toEqual(0);
		expect(ctrl.seconds).toEqual(1);
		done();
	});
	describe('Default config',function(){
		beforeEach(function(){
			ctrl.startCount();
		});

		it('Should start on a task pomodoro',function(done){
			expect(ctrl.status).toEqual('task');
			done();
		});
		it('Should proceed to a short break automatically after a pomodoro',function(done){
			var pomodoroDuration=25;
			theInterval.flush(pomodoroDuration*60*1000+200);
			expect(ctrl.status).toEqual('short_break');
			done();
			
		});
		it('Should proceed to a long break after 4 pomodoros',function(done){
			var pomodoroDuration=25;
			var shortBreakDuration=5;
			var time=pomodoroDuration*60*1000*4+shortBreakDuration*60*1000*3;
			theInterval.flush(time);
			expect(ctrl.status).toEqual('long_break');
			done();
		});
	});
	
});