angular.module("app").controller('invoice', function ($scope, userService, $routeParams, $location) {

    //console.log("Invoice loaded .." + $routeParams.id);
    $scope.root = root;

    var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    $scope.dataObj = {
        invoice: {
            id: $routeParams.id
        }
    }

    $scope.getInvoice = function() {
        userService.callService($scope, "sendInvoice").then(function (response) {
            //console.log(response);
            if (response.status == 200) {
                $scope.invoice = response.invoice;
                $scope.user = response.user;
                //
            } else {
                alert(response.response);
            }
        });

    }


    $scope.submitHdfc = function() {
        document.redirect.submit();
    }
    
    $scope.getMonth = function(number) {
        return months[number - 1];
    }

    $scope.getInvoice();

});

angular.module("app").controller('payment', function ($scope, userService, $routeParams, $location) {

    console.log("Payment loaded .." + $routeParams.id);
    $scope.root = root;

    $scope.message = "";
    $scope.status = "";
    $scope.paymentId = $routeParams.id;
    
    var vendor = "";
    
    if($routeParams.vendor != null) {
       vendor = $routeParams.vendor.split("+").join(" "); 
    }
    
    
    if($routeParams.status == 'Credit') {
        $scope.status = "Successful";
        $scope.message = "Your payment of Rs. " + $routeParams.amount + " to the vendor " + vendor  + " is completed successfully!";
    } else {
        $scope.status = "Failed";
        $scope.message = "Your payment of Rs. " + $routeParams.amount + " to the vendor " + vendor + " is failed! Please contact our customer support for more info and mention the given Payment ID for reference.";
    }
    
    

});

