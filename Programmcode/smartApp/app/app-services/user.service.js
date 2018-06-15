(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.getUserInformation = getUserInformation;
        service.getTasks = getTasks;
        service.completeTasks = completeTasks;
        service.setReminder=setReminder;
        service.createSumTask=createSumTask;
        service.createSubtasks=createSubtasks;

        return service;

        function getUserInformation(id, token){
            return $http.get('/getUserInformation/'+id+'/'+token).then(handleSuccess, handleError);
        }

        function getTasks(id, token, listid){
            return $http.get('/getTasks/'+id+'/'+token+'/'+listid).then(handleSuccess, handleError);
        }

        function completeTasks(id, token, taskid, revision){
            return $http.post('/completeTasks/'+id+'/'+token+'/'+taskid+'/'+revision).then(handleSuccess, handleError);
        }

        function createSumTask(id, token, listid,sum){
            return $http.post('/createSumTask/'+id+'/'+token+'/'+listid+'/'+sum).then(handleSuccess, handleError);
        }

        function createSubtasks(id, token, taskid, ctasks, dataset){
            return $http.post('/createSubtasks/'+id+'/'+token+'/'+taskid+'/'+ctasks+'/'+dataset).then(handleSuccess, handleError);
        }

       /*  function completeTasks(id, token, taskid, revision,title){
            return $http.post('/completeTasks/'+id+'/'+token+'/'+taskid+'/'+revision+'/'+title).then(handleSuccess, handleError);
        } */

        function setReminder(id, token, taskid,completedTime){
            return $http.post('/setReminder/'+id+'/'+token+'/'+taskid+'/'+completedTime).then(handleSuccess, handleError);
        }

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
