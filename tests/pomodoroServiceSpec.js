describe('Pomodoro Service',function(){
	var pomodoroService;
	beforeEach(angular.mock.module('foc-pomodoro'));
	beforeEach(angular.mock.inject(function(focPomodoroService){
		pomodoroService=focPomodoroService;
	}));
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
});