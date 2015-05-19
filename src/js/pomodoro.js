var TASK_STATUS='task';
var SHORT_BREAK_STATUS='short_break';
var LONG_BREAK_STAUS='long_break';
function pomodoroController($scope,$interval,focPomodoroService){
	var self=this;
	this.minutes=0;
	this.seconds=0;
	this.status=focPomodoroService.getStatus();
	this.statusDuration=focPomodoroService.getStatusDuration();
	var stop;

	this.startCount=function(){
		stop = $interval(function() {
		self.seconds++;
		if(self.seconds>=60){
			self.seconds=0;
			self.minutes++;
		}
		if(self.minutes>=self.statusDuration){
			self.status=focPomodoroService.nextStatus();
			self.seconds=0;
			self.minutes=0;
		}
	  }, 1000);
	};
   this.stopCount = function() {
	  if (angular.isDefined(stop)) {
		$interval.cancel(stop);
		stop = undefined;
	  }
	};
}
function PomodoroService(){
	this.currentStatus=TASK_STATUS;
	this.durations={};
	this.durations[TASK_STATUS]=25;
	this.durations[SHORT_BREAK_STATUS]=5;
	this.durations[LONG_BREAK_STAUS]=15;
	this.pomodoroCount=0;
}
PomodoroService.prototype.getStatus=function(){
	return this.currentStatus;
};
PomodoroService.prototype._setStatus=function(status){
	this.currentStatus=status;
};
PomodoroService.prototype.getStatusDuration=function(){
	return this.durations[this.getStatus()];
};
PomodoroService.prototype.nextStatus=function(){
	switch(this.getStatus()) {
		case TASK_STATUS:
			this.pomodoroCount++;
			if(this.pomodoroCount>=4){
				this.pomodoroCount=0;
				this._setStatus(LONG_BREAK_STAUS);
			}
			else{
				this._setStatus(SHORT_BREAK_STATUS);
			}
		break;
		case LONG_BREAK_STAUS:
		case SHORT_BREAK_STATUS:
			this._setStatus(TASK_STATUS);
		break;
	}
	return this.getStatus();
};
angular.module('foc-pomodoro', [])
.service('focPomodoroService',PomodoroService)
.controller('PomodoroCtrl', ['$scope','$interval','focPomodoroService',pomodoroController])
.controller('TasksCtrl', function($scope) {})