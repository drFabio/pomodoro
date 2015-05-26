var TASK_STATUS='task';
var SHORT_BREAK_STATUS='short_break';
var LONG_BREAK_STAUS='long_break';
var AUTO_BEHAVIOUR='auto_behaviour';
var ASK_BEHAVIOUR='ask_behaviour';
var NEW_POMODORO_EVENT='focNewPomodoroStarted';
var POMODORO_FINISHED_EVENT='focPomodoroEnded';
var POMODORO_CANCELLED_EVENT='focPomodoroCancelled'
function pomodoroController($scope,$interval,focPomodoroService){
	var self=this;
	this.minutes=0;
	this.seconds=0;
	this.status;
	this.statusDuration;
	var unbindList=[];
	var unbind;
	unbind=$scope.$on(NEW_POMODORO_EVENT,function(){
		self.startCount();
	});	
	unbindList.push(unbind);
	var stop;
	this.start=function(){
		focPomodoroService.startPomodoro();
	};
	this.startCount=function(){
		self.status=focPomodoroService.getStatus();
		self.minutes=focPomodoroService.getEllapsedMinutes();
		self.seconds=focPomodoroService.getEllapsedSeconds();
		self.statusDuration=focPomodoroService.getStatusDuration();
		stop = $interval(function() {
		self.seconds++;
		if(self.seconds>=60){
			self.seconds=0;
			self.minutes++;
		}
		if(self.minutes>=self.statusDuration){
			self.stopCount();
		}
	  }, 1000);
	};
   this.stopCount = function() {
	  if (angular.isDefined(stop)) {
		$interval.cancel(stop);
		stop = undefined;
	  }
	};
	$scope.$on("$destroy", function() {
        self.stopCount();
        unbindList.map(function(u){
        	u();
        })
    });
}
function PomodoroService($rootScope,$timeout){
	this.currentStatus=TASK_STATUS;
	this.durations={};
	this.durations[TASK_STATUS]=25;
	this.durations[SHORT_BREAK_STATUS]=5;
	this.durations[LONG_BREAK_STAUS]=15;
	this.pomodoroCount=0;
	this.behaviour=AUTO_BEHAVIOUR;
	this._scope=$rootScope;
	this._timeout=$timeout;
	this._timer;
	this._timePomodoroStarted;
}
PomodoroService.prototype.getEllapsedSeconds = function() {
	var ellapsedSeconds=Math.round((new Date().getTime()-this._timePomodoroStarted)/1000);
	return ellapsedSeconds%60;
};
PomodoroService.prototype.getEllapsedMinutes = function() {
	var ellapsedSeconds=Math.round((new Date().getTime()-this._timePomodoroStarted)/1000);
	return Math.round(ellapsedSeconds/60);
};
PomodoroService.prototype.cancelPomodoro = function() {
	this.cancelTimer();
	var ellapsedSeconds=(new Date().getTime()-this._timePomodoroStarted)/1000;
	this._scope.$broadcast(POMODORO_CANCELLED_EVENT,this.getStatus(),this.getStatusDuration(),ellapsedSeconds);
};
PomodoroService.prototype.startPomodoro = function() {
	this.startCounting();
	this._scope.$broadcast(NEW_POMODORO_EVENT,this.getStatus(),this.getStatusDuration());
};
PomodoroService.prototype.startCounting = function() {
	this.cancelTimer();
	this._timePomodoroStarted=new Date().getTime();
	var self=this;
	this._timer=this._timeout(function(){
		self._timerFinished();
	},this.getStatusDuration()*60*1000);
};
PomodoroService.prototype._startNewEvent = function() {
	this.nextStatus();
	this.startPomodoro();
};
PomodoroService.prototype._timerFinished = function() {
	this._scope.$broadcast(POMODORO_FINISHED_EVENT,this.getStatus(),this.getStatusDuration());
	if(this.behaviour==AUTO_BEHAVIOUR){
		this._startNewEvent();
	}
};
PomodoroService.prototype.cancelTimer = function() {
	if (angular.isDefined(this._timer)) {
		this._timeout.cancel(this._timer);
		this._timer = undefined;
	}
};
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
PomodoroService.prototype.setDurations = function(durations) {
	var allowedDurations=[TASK_STATUS,SHORT_BREAK_STATUS,LONG_BREAK_STAUS];
	var self=this;
	allowedDurations.forEach(function(a){
		self.durations[a]=durations[a];
	});
};
angular.module('foc-pomodoro', [])
.service('focPomodoroService',['$rootScope','$timeout',PomodoroService])
.controller('TasksCtrl', function($scope) {})
.directive('pomodoroTimer', [function() {
								return {
									templateUrl:'/templates/timer.html',
									restrict: 'E',
									controllerAs:'pomodoroCtrl',
									controller:['$scope','$interval','focPomodoroService',pomodoroController]
								};
							}]
);