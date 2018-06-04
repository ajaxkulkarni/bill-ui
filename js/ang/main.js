var app = angular.module("app", ["angular-loading-bar", "ngRoute", "ngFileUpload"]);

app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }]);

var root = host + "/user/";
//var projectRoot = host + "/projectService"
//var rootAdmin = host + "/adminService";




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

    this.logout = function () {

    }


});



app.config(function ($routeProvider) {
    $routeProvider
        .when("/invoice/:id", {
            controller: "invoice",
            templateUrl: "PPB_Payment.html"
        })
        .when("/login", {
            controller: "login",
            templateUrl: "login.html"
        })
        .when("/payment/:status/:vendor/:amount/:id", {
            controller: "payment",
            templateUrl: "payment_result.html"
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
