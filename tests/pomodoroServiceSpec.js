describe('Pomodoro Service',function(){
	var pomodoroService;
	var scope;
	var timeout;
	describe('Default config',function(){
		beforeEach(function(){
			angular.mock.module('foc-pomodoro');
			angular.mock.inject(function($rootScope,$timeout,$injector,focPomodoroService){
				scope = $rootScope;
				timeout=$timeout;
				pomodoroService=focPomodoroService;
			});
		});
		it('Starts as a task state ',function(){
			expect(pomodoroService.getStatus()).toEqual('task');
		});
		it('Have the default task duration of 25 minutes ',function(){
			pomodoroService._setStatus('task');
			expect(pomodoroService.getStatusDuration()).toEqual(25);
		});

		it('Have the default long break duration of 15 minutes ',function(){
			pomodoroService._setStatus('long_break');
			expect(pomodoroService.getStatusDuration()).toEqual(15);
		});
		it('Have the default short break duration of 5 minutes ',function(){
			pomodoroService._setStatus('short_break');
			expect(pomodoroService.getStatusDuration()).toEqual(5);
		});
		it('Follows the cycle as Task,Short,Short,Short,Break',function(){
			var expectedResults=['task','short_break','task','short_break','task','short_break','task','long_break'];
			var expectedStatus;
			var actualStatus;
			for(var j=0;j<2;j++){
				for(var i=0;i<expectedResults.length;i++){
					expectedStatus=expectedResults[i];
					actualStatus=pomodoroService.getStatus();
					expect(actualStatus).toEqual(expectedStatus);
					pomodoroService.nextStatus();
				}
			}
		});
		describe('Timers and events',function(){
			it('Start a timer for the pomodoro and communicate it when it\'s started and finished ',function(){
				spyOn(scope, '$emit');
				pomodoroService.startPomodoro();
				timeout.flush(25*60*1000+200);
				expect(scope.$emit).toHaveBeenCalledWith('focNewPomodoroStarted','task',25);
				expect(scope.$emit).toHaveBeenCalledWith('focPomodoroEnded','task',25);
			});
			it('Automatically starts a new timer when the other ends ',function(){
				spyOn(scope, '$emit');
				pomodoroService.startPomodoro();
				timeout.flush(25*60*1000+200);
				expect(scope.$emit).toHaveBeenCalledWith('focNewPomodoroStarted','short_break',5);
			});
			it('get cancelled',function(){
				spyOn(scope, '$emit');
				pomodoroService.startPomodoro();
				timeout.flush(15*60*1000);
				pomodoroService.cancelPomodoro();
				var lastArgs=scope.$emit.calls.mostRecent().args;
				expect(lastArgs[0]).toEqual('focPomodoroCancelled');
				expect(lastArgs[1]).toEqual('task');
				expect(lastArgs[2]).toEqual(25);
				
			});
			it('When cancelled doesn\'t emit a new event even if it\'s on auto behaviou',function(){
				spyOn(scope, '$emit');
				pomodoroService.startPomodoro();
				timeout.flush(15*60*1000);
				pomodoroService.cancelPomodoro();
				timeout.flush(10*60*1000+200);
				expect(scope.$emit).not.toHaveBeenCalledWith('focNewPomodoroStarted','short_break',5);
			});
		});	
	});
	
});