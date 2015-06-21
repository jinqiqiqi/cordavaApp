var app = angular.module("sportsStore", ["customFilters", "cart", "ngRoute"]);
app
.config(function($routeProvider) {
	$routeProvider
	.when("/complete", {
		templateUrl: "./views/thankYou.html"
	})
	.when("/placeorder", {
		templateUrl: "./views/placeOrder.html"
	})
	.when("/checkout", {
		templateUrl: "./views/checkoutSummary.html"
	})
	.when("/products", {
		templateUrl: "./views/productList.html"
	})
	.otherwise({
		templateUrl: "./views/productList.html"
	});
})
.constant('dataUrl', "http://sportstore:5500/products")
.constant('orderUrl', "http://sportstore:5500/orders")
.controller('sportsStoreCtrl', ['$scope', '$http', '$location', 'dataUrl', 'orderUrl', 'cart', function($scope, $http, $location, dataUrl, orderUrl, cart){
	$scope.data = {};

	$http.get(dataUrl)
	.success(function(data){
		$scope.data.products = data;
	})
	.error(function(error, status) {
		$scope.data.error = error;
		$scope.data.status = status;
	});

	$scope.sendOrder = function(shippingDetails) {
		var order = angular.copy(shippingDetails);
		order.products = cart.getProducts();
		
		$http.post(orderUrl, order)
		.success(function(data){
			$scope.data.orderId = data.id;
			cart.getProducts().length = 0;
		})
		.error(function(error) {
			$scope.data.orderError = error;
		})
		.finally(function() {
			$location.path("/complete");
		});
	}

}]);
