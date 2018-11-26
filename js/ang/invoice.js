angular.module("app").controller('invoice', function ($scope, userService, $routeParams, $location) {

    //console.log("Invoice loaded .." + $routeParams.id);
    $scope.root = root;

    var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    $scope.dataObj = {
        invoice: {
            id: $routeParams.id
        }
    }

    $scope.getInvoice = function () {
        userService.callService($scope, "sendInvoice").then(function (response) {
            //console.log(response);
            if (response.status == 200) {
                $scope.invoice = response.invoice;
                $scope.user = response.user;
                $('#redirectForm').attr('action', $scope.invoice.cashFreePaymentUrl);
                $("#paytmForm").attr('action', $scope.invoice.paytmUrl);
                //
            } else {
                alert(response.response);
            }
        });

    }


    $scope.submitHdfc = function () {
        document.redirect.submit();
    }

    $scope.getMonth = function (number) {
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

    if ($routeParams.vendor != null) {
        vendor = $routeParams.vendor.split("+").join(" ");
    }


    if ($routeParams.status == 'Credit') {
        $scope.status = "Successful";
        $scope.message = "Your payment of Rs. " + $routeParams.amount + " to the vendor " + vendor + " is completed successfully!";
    } else {
        $scope.status = "Failed";
        $scope.message = "Your payment of Rs. " + $routeParams.amount + " to the vendor " + vendor + " is failed! Please contact our customer support for more info and mention the given Payment ID for reference.";
    }



});

angular.module("app").controller('paymentResult', function ($scope, userService, $routeParams, $location) {

    console.log("Payment result loaded .." + $routeParams.id);
    $scope.root = root;

    $scope.message = "";

    $scope.getSchemes = function () {
        $scope.dataObj = {
            invoice: {
                id: $routeParams.id
            }
        }
        userService.callCustomerService($scope, "getSchemes").then(function (response) {
            console.log(response);
            $scope.invoice = response.invoice;

            if ($scope.invoice != null) {
                $scope.user = response.user;
                if ($scope.invoice.status == 'Credit') {
                    $scope.message = "Your payment of Rs. " + $scope.invoice.paidAmount + " to the vendor " + response.user.currentBusiness.name + " is completed successfully!";
                } else {
                    $scope.message = "Your payment of Rs. " + $scope.invoice.paidAmount + " to the vendor " + response.user.currentBusiness.name + " is failed! Please contact our customer support for more info and mention the given Payment ID for reference.";
                }
            }

            if (response.status == 200) {
                $scope.errorMsg = null;
                $scope.schemes = response.schemes;
            } else {
                $scope.schemes = [];
                $scope.errorMsg = response.response;
            }
            $scope.scheme = response.scheme;
        });

    }

    $scope.confirmAccept = function (scheme) {
        $scope.scheme = scheme;
        $("#confirmAccept").modal('show');
    }

    $scope.acceptScheme = function () {
        $scope.dataObj = {
            user: {
                id: $scope.user.id
            },
            invoice: {
                id: $routeParams.id
            },
            scheme: {
                id: $scope.scheme.id
            }
        }
        $("#confirmAccept").modal('hide');
        userService.callCustomerService($scope, "acceptScheme").then(function (response) {
            console.log(response);
            $scope.invoice = response.invoice;

            if (response.status == 200) {
                $scope.resultMsg = "The coupon details have been mailed to your email " + $scope.user.email + " and also sent over SMS on " + $scope.user.phone;
            } else {
                $scope.resultMsg = response.response;
            }
            $scope.getSchemes();
            $("#resultModal").modal('show');
        });

    }

    $scope.getSchemes();

});

angular.module("app").controller('verifyCoupon', function ($scope, userService) {

    console.log("Verify coupon loaded ..");
    $scope.root = root;

    $scope.message = "";

    $scope.verify = function () {
        if($scope.couponCode == null || $scope.phone == null) {
            alert("Coupon code and phone number are mandatory!");
            return;
        }
        $scope.dataObj = {
            scheme: {
                couponCode: $scope.couponCode
            },
            user: {
                phone: $scope.phone
            },
            requestType : "Verify"
        }
        userService.callCustomerService($scope, "redeemScheme").then(function (response) {
            console.log(response);

            if (response.status == 200) {
                $scope.scheme = response.scheme;
                $scope.user = response.user;
            } else {
                alert(response.response);
                $scope.scheme = null;
                $scope.user = null;
            }
        });

    }

    $scope.confirmRedeem = function () {
        $("#confirmRedeem").modal('show');
    }

    $scope.redeemScheme = function () {
        $scope.dataObj = {
            scheme: {
                couponCode: $scope.couponCode
            },
            user: {
                phone: $scope.phone
            },
            requestType : "Redeem"
        }
        $("#confirmRedeem").modal('hide');
        userService.callCustomerService($scope, "redeemScheme").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.resultMsg = "Coupon was redeemed successfully!";
            } else {
                $scope.resultMsg = response.response;
            }
            $("#resultModal").modal('show');
        });

    }


});
