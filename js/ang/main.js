var app = angular.module("app", ["angular-loading-bar", "ngRoute", "ngFileUpload"]);

app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }]);

//var host = "http://localhost:8080/billapp-service";
var host = "https://payperbill.in:8443/billapp";
var root = host + "/user/";
var rootAdmin = host + "/admin/"
var rootCustomer = host + "/customer/"
//var projectRoot = host + "/projectService"
//var rootAdmin = host + "/adminService";


// Initialize Firebase
var config = {
    apiKey: "AIzaSyAZdyvqPoQfyyBc6gouksAD8y515IJofHE",
    authDomain: "billapp-9b729.firebaseapp.com",
    databaseURL: "https://billapp-9b729.firebaseio.com",
    projectId: "billapp-9b729",
    storageBucket: "billapp-9b729.appspot.com",
    messagingSenderId: "440243964879"
};
firebase.initializeApp(config);



app.service('userService', function ($http, $q) {

    var response = {};

    this.callService = function ($scope, method) {
        var defer = $q.defer();
        var url = root + method;
        var res = $http.post(url, $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);

        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            console.log("Error :" + status + ":" + JSON.stringify(data) + ":" + JSON.stringify(headers))
        });

        response = defer.promise;
        return $q.when(response);
    }

    this.callCustomerService = function ($scope, method) {
        var defer = $q.defer();
        var url = rootCustomer + method;
        var res = $http.post(url, $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);

        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            console.log("Error :" + status + ":" + JSON.stringify(data) + ":" + JSON.stringify(headers))
        });

        response = defer.promise;
        return $q.when(response);
    }

    this.logout = function () {

    }


});





app.config(function ($routeProvider) {
    $routeProvider
        .when("/invoice/:id", {
            controller: "invoice",
            templateUrl: "PPB_Payment.html"
        }) //For HDFC
        .when("/hdfc/invoice/:id", {
            controller: "invoice",
            templateUrl: "PPB_Payment_hdfc.html"
        })
        .when("/atom/invoice/:id", {
            controller: "invoice",
            templateUrl: "PPB_Payment_atom.html"
        })
        .when("/cashfree/invoice/:id", {
            controller: "invoice",
            templateUrl: "PPB_Payment_cashfree.html"
        })
        .when("/login", {
            controller: "login",
            templateUrl: "login.html"
        })
        .when("/payment/:status/:vendor/:amount/:id", {
            controller: "payment",
            templateUrl: "payment_result.html"
        })
        .when("/invoice/status/:id", {
            controller: "paymentResult",
            templateUrl: "payment_result_offers.html"
        })
        .when("/verifyCoupon", {
            controller: "verifyCoupon",
            templateUrl: "coupon_verify.html"
        })
        .when("/:phone/customer", {
            controller: "customerInfo",
            templateUrl: "customer_data_entry.html"
        })

});



/*app.run(function ($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var user = JSON.parse(localStorage.erpUser);
        
        if (user != null && user.name != null) {
            // no logged user, we should be going to #login
            if (user.status == 'P') {
                if (next.templateUrl != "password_reset.html") {
                    //window.location.href = "#changePassword";
                    $location.path("/changePassword");
                }
            } else if (user.company == null && user.loginType != 'Employee') {
                if (next.templateUrl != "company_details.html") {
                    //window.location.href = "#companyDetails";
                    $location.path("/companyDetails");
                }
            }
        }
    });
});*/

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
