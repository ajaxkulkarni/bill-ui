angular.module("app").controller('invoice', function ($scope, userService, $routeParams, $location) {

    //console.log("Invoice loaded .." + $routeParams.id);
    $scope.root = root;

    var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



    $scope.getInvoice = function () {
        $scope.dataObj = {
            invoice: {
                id: $routeParams.id
            }
        }
        userService.callService($scope, "sendInvoice").then(function (response) {
            //console.log(response);
            if (response.status == 200) {
                $scope.invoice = response.invoice;
                $scope.user = response.user;
                $('#redirectForm').attr('action', $scope.invoice.cashFreePaymentUrl);
                $("#paytmForm").attr('action', $scope.invoice.paytmUrl);

                if (localStorage.customerSkip != 'Y' && ($scope.user.email == null || $scope.user.email.trim().length == 0 || $scope.user.email.indexOf("payperbill.in") > 0)) {
                    //No email found for user
                    $("#userInfoModal").modal('show');
                }

                //
            } else {
                alert(response.response);
            }
        });

    }

    $scope.skipCustomerDetails = function () {
        if ($scope.skipCustomerInfo) {
            localStorage.customerSkip = 'Y';
        }

        $("#userInfoModal").modal('hide');
    }

    $scope.saveCustomer = function () {
        console.log("Inside save customer!");
        $scope.dataObj = {
            user: {
                currentSubscription: {
                    id: $scope.user.id
                },
                phone: $scope.user.phone,
                email: $scope.customerEmail
            }
        }

        userService.callService($scope, "updateCustomer").then(function (response) {
            //console.log(response);
            $("#userInfoModal").modal('hide');
            if (response.status == 200) {
                $scope.getInvoice();
            } else {
                alert(response.response);
            }
        });

    }

    $scope.showBillDetails = function (user) {
        if (user == null || user.currentBusiness == null) {
            return true;
        }
        if (user.showBillDetails == 'N') {
            return false;
        }
        if (user.currentBusiness.showBillDetails == 'N') {
            if (user.showBillDetails != 'Y') {
                return false;
            } else {
                return true;
            }

        }
        return true;
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
        if ($scope.couponCode == null || $scope.phone == null) {
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
            requestType: "Verify"
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
            requestType: "Redeem"
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
