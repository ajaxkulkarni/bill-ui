angular.module("app").controller('customerInfo', function ($scope, userService, $routeParams, $location) {

    console.log("Customer profile loaded .." + $routeParams.phone);
    $scope.root = root;
    $scope.user = {};
    $scope.adminRoot = rootAdmin;

    $scope.smsSent = false;



    //window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    //console.log(" ..Loaded ..");



    $scope.onSignInSubmit = function () {
        console.log($scope.user.phone);
        if($scope.user.phone == null || $scope.user.phone.length < 10) {
            $scope.phoneError = true;
            return;
        }
        $scope.phoneError = false;
        var phoneNumber = $scope.user.phone;
        if (phoneNumber.indexOf("+91") < 0) {
            phoneNumber = "+91" + phoneNumber;
        }
        var appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                console.log("Result => " + confirmationResult);
                $scope.smsSent = true;
                $scope.$apply();
            }).catch(function (error) {
                // Error; SMS not sent
                // ...
            });
    }

    $scope.verifyNumber = function () {

        confirmationResult.confirm($scope.user.code).then(function (result) {
            // User signed in successfully.
            var user = result.user;
            console.log(user);
            $scope.customer = {
                phone: user.phoneNumber
            };
            localStorage.customer = JSON.stringify($scope.customer);
            $scope.$apply();
            // ...
        }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            // ...
        });
    }

    $scope.resend = function () {
        $scope.onSignInSubmit
    }

    //

    $scope.loadBusinessItems = function () {
        $scope.dataObj = {
            business: $scope.vendor.currentBusiness
        }
        userService.callService($scope, "loadBusinessItems").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.items = response.items;
            }
        });
    }

    //getCustomerProfile

    $scope.getCustomer = function () {
        $scope.dataObj = {
            user: $scope.customer
        }
        userService.callService($scope, "getCustomerProfile").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.customer = response.user;
            }
        });
    }

    if (localStorage.customer != null) {
        try {
            $scope.customer = JSON.parse(localStorage.customer);
            $scope.user = {
                phone: $scope.customer.phone
            };
        } catch (e) {
            console.log(e);
        }

    }

    $scope.loadProfile = function () {
        $scope.dataObj = {
            user: {
                phone: $routeParams.phone
            }
        }
        userService.callService($scope, "loadProfile").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.vendor = response.user;
                if ($scope.vendor.status == 'A') {
                    $scope.validBusiness = true;
                    if ($scope.customer != null && $scope.customer.id != null) {
                        $scope.loadBusinessItems();
                        $scope.getCustomer();
                    }
                }
                if ($scope.customer == null || $scope.customer.phone == null) {
                    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
                        'size': 'normal',
                        'callback': function (response) {
                            // reCAPTCHA solved, allow signInWithPhoneNumber.
                            // ...
                            console.log("Done ...");
                        },
                        'expired-callback': function () {
                            // Response expired. Ask user to solve reCAPTCHA again.
                            // ...
                            console.log("Done!");
                        }
                    });
                }

                console.log("Captcha loaded ..");
            } else {
                alert("Vendor profile not found!");
            }
        });

    }

    $scope.address = {};
    
    $scope.submit = function (validation) {
        $scope.submitted = true;
        if(!validation) {
            return;
        }
        if($scope.address != null) {
            $scope.user.address = $scope.address.flat + "," + $scope.address.building + "," + $scope.address.pincode + "," + $scope.address.details;
        }
        console.log($scope.user.address);
        $scope.dataObj = {
            user: $scope.user,
            business: $scope.vendor.currentBusiness,
            requestType: "CUSTOMER"
        }
        console.log($scope.dataObj);
        userService.callService($scope, "updateCustomer").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                alert("Saved!");
                localStorage.customer = JSON.stringify(response.user);
                $scope.customer = response.user;
                $scope.loadBusinessItems();
            } else {
                alert(response.response);
            }
        });
    }

    $scope.selectedItem = {};

    $scope.add = function () {
        //
        $scope.selectedItem.quantity = 1;
        $scope.dataObj = {
            user: $scope.customer,
            item: $scope.selectedItem
        };
        userService.callService($scope, "updateCustomerItem").then(function (response) {
            console.log(response);
            $scope.selectedItem = {};
            if (response.status == 200) {
                $scope.getCustomer();
                alert("Saved Successfully!");
            }
        });

    }

    $scope.subItem = {};
    $scope.days = {};

    $scope.changeDays = function (item) {
        $scope.subItem = item;
        if ($scope.subItem.weekDays == null) {
            $scope.sun = true;
            $scope.mon = true;
            $scope.tue = true;
            $scope.wed = true;
            $scope.thu = true;
            $scope.fri = true;
            $scope.sat = true;
            $scope.sun = true;
            console.log("Days set");
        } else {
            if ($scope.subItem.weekDays.indexOf("1") >= 0) {
                $scope.sun = true;
            }
            if ($scope.subItem.weekDays.indexOf("2") >= 0) {
                $scope.mon = true;
            }
            if ($scope.subItem.weekDays.indexOf("3") >= 0) {
                $scope.tue = true;
            }
            if ($scope.subItem.weekDays.indexOf("4") >= 0) {
                $scope.wed = true;
            }
            if ($scope.subItem.weekDays.indexOf("5") >= 0) {
                $scope.thu = true;
            }
            if ($scope.subItem.weekDays.indexOf("6") >= 0) {
                $scope.fri = true;
            }
            if ($scope.subItem.weekDays.indexOf("7") >= 0) {
                $scope.sat = true;
            }
        }
        $("#changeDays").modal('show');
    }

    $scope.days = function (item) {
        if (item.weekDays == null) {
            return "ALL";
        }
        var i = 1;
        for (i = 1; i < 8; i++) {
            if (item.weekDays.indexOf(i) < 0) {
                return "SOME";
            }
        }
        return "ALL";
    }

    $scope.saveDays = function () {
        var days = "";
        if ($scope.sun) {
            days = days + "1,";
        }
        if ($scope.mon) {
            days = days + "2,";
        }
        if ($scope.tue) {
            days = days + "3,";
        }
        if ($scope.wed) {
            days = days + "4,";
        }
        if ($scope.thu) {
            days = days + "5,";
        }
        if ($scope.fri) {
            days = days + "6,";
        }
        if ($scope.sat) {
            days = days + "7,";
        }

        $scope.dataObj = {
            user: $scope.customer,
            item: {
                id: $scope.subItem.id,
                weekDays: days
            }
        };
        userService.callService($scope, "updateCustomerItem").then(function (response) {
            console.log(response);
            $scope.selectedItem = {};
            if (response.status == 200) {
                $scope.getCustomer();
                alert("Saved Successfully!");
            }
            $("#changeDays").modal('hide');
        });
    }

    $scope.addScheme = function (item) {
        $scope.subItem = item;
        $("#addScheme").modal('show');
    }

    $scope.saveScheme = function () {
        $scope.dataObj = {
            user: $scope.customer,
            item: {
                id: $scope.subItem.id,
                price: $scope.schemePrice,
                priceType: 'MONTHLY'
            }
        };
        userService.callService($scope, "updateCustomerItem").then(function (response) {
            console.log(response);
            $scope.selectedItem = {};
            if (response.status == 200) {
                $scope.getCustomer();
                alert("Saved Successfully!");
            }
            $("#addScheme").modal('hide');
        });
    }


    $scope.logout = function () {
        localStorage.customer = null;
        $scope.customer = null;
        window.location.reload();
    }

    $scope.loadProfile();




});
