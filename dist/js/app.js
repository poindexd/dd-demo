var dd = angular.module('dd', ['ngAnimate', 'ngSanitize']);

dd.controller('controller', ['$scope', '$filter', '$timeout', '$sce',
 function($scope, $filter, $timeout, $sce) {

 	//Helper function that grabs data from Firebase and updates scope
	$scope.grab = function(what, callback){
		$scope.ref.child(what).on('value', function(snapshot) {
			$scope[what] = [];
			$scope.$apply(function () {
				angular.forEach(snapshot.val(), function(value, key){
					$scope[what].push(value);
				});
				console.log($scope[what]);
				if (callback)
					callback($scope[what]);
			});
		});
	}

	//Initialize slides and render slides[0]
	$scope.init = function(){
		$scope.grab('slides',function(slides){
			$scope.showSlide($scope.index = 0);
		});
		$scope.grab('surveys');
	};

	//Render a slide, play audio, and set duration if applicable
	$scope.showSlide = function(index){
		
		if (index >= $scope.slides.length)
			return;

		$scope.slide = $scope.slides[index];
		$scope.progress = (($scope.index+1) / $scope.slides.length) * 100 + '%';

		if ($scope.slide.audio){
			$scope.busy = true;
			var audio = new Audio('http://sb.webhook.org' + $scope.slide.audio.url);
			audio.onended = function(){
				$scope.$apply(function(){
					$scope.busy = false;
					$scope.advanceSlide();
				});
			}
			audio.play();
		}

		if ($scope.slide.duration){
			$scope.busy = true;
			$timeout(function(){
				$scope.busy = false;
				$scope.advanceSlide();
			}, $scope.slide.duration*1000);
		}
	}

	//Check if the current slide is likert, if not implies multi choice
	$scope.isLikert = function(){
		if (!$scope.slide.options || $scope.slide.options.length < 5)
			return false;

		var ret = true;
		angular.forEach($scope.slide.options, function(option){
			if (option.correct == true)
				ret = false;
		});
		return ret;
	}

	//Show the next slide
	$scope.advanceSlide = function(){
		if(!$scope.busy)
			$scope.showSlide(++$scope.index);
	}

	$scope.trustAsHtml = function(snippet){
		return $sce.trustAsHtml(snippet)
	}

	$scope.ref = new Firebase('https://webhook.firebaseio.com/buckets/sb/e9a4ff1d-eb5e-4fbd-8950-ceceab335e94/dev/data');
	$scope.init();

}]);

function unique(value, index, self) { 
	if (value) return self.indexOf(value) === index;
}

function combine(pre, cur) {
	return pre.concat(cur);
}

function p(name){
	return (function(name, obj){
		if (obj)
			return obj[name];
	}).bind(null, name);
}