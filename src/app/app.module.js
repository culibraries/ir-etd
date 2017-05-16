
angular
    .module('searchApp', []);

angular
    .module('searchApp')
    .factory('disciplineService', disciplineService)
    .component('disciplineSearch', {
        templateUrl: 'app/disciplineSearch.html',
        controller: DisciplineController
    });

    DisciplineController.$inject = ['disciplineService'];

    function DisciplineController(disciplineService) {
        var vm = this;
        vm.disciplines = [];
        vm.search = '';
        vm.enterDiscipline = enterDiscipline;
        vm.name = 'test';

        activate();

        function activate() {
            disciplineService.getDisciplines()
            .then(function(res) {
                vm.disciplines = res.data;
            });
        }

        function enterDiscipline(discipline) {
            $('#dialog').dialog('close');
            $('#' + id).val(discipline);
        }
    }

    function disciplineService($http) {
        return {
            getDisciplines: getDisciplines
        };

        function getDisciplines() {
            return $http({
                method: 'GET',
                url: 'modules/archive/archive.php',
                params: {
                    action: 'getDisciplines'
                }
            })
            .catch(function(error) {
                console.log(error);
                return $q.reject(error);
            });
        }
    }
