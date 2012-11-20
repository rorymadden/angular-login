'use strict';

/* Directives */


angular.module('myApp.directives', [])
  // .directive('opendialog', function() {
  //     var openDialog = {
  //       link :   function(scope, element, attrs) {
  //         function openDialog() {
  //           var element = angular.element('#myModal');
  //           var ctrl = element.controller();
  //           ctrl.setModel(scope.blub);
  //           element.modal('show');
  //         }
  //         element.bind('click', openDialog);
  //       }
  //     };
  //   return openDialog;
  // })
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('mpValueCopy', function($parse) {
    return function(scope, element, attrs) {
      if (attrs.ngModel) {

          if (element[0].type === "radio") {
              if (element[0].checked === true) {
                  $parse(attrs.ngModel).assign(scope, element.val());
              }
          } else {
              $parse(attrs.ngModel).assign(scope, element.val());
          }
      }
    };
  });
  // angular ui
  // .directive('uiModal', ['$timeout', function($timeout) {
  //   return {
  //     restrict: 'EAC',
  //     require: 'ngModel',
  //     link: function(scope, elm, attrs, model) {
  //       //helper so you don't have to type class="modal hide"
  //       elm.addClass('modal hide');
  //       elm.on( 'shown', function() {
  //         elm.find( "[autofocus]" ).focus();
  //       });
  //       scope.$watch(attrs.ngModel, function(value) {
  //         elm.modal(value && 'show' || 'hide');
  //       });
  //       //If bootstrap animations are enabled, listen to 'shown' and 'hidden' events
  //       elm.on(jQuery.support.transition && 'shown' || 'show', function() {
  //         $timeout(function() {
  //           model.$setViewValue(true);
  //         });
  //       });
  //       elm.on(jQuery.support.transition && 'hidden' || 'hide', function() {
  //         $timeout(function() {
  //           model.$setViewValue(false);
  //         });
  //       });
  //     }
  //   };
  // }])
  // // http://jsfiddle.net/mVSPC/7/
  // .directive('bsDialog', function($templateCache, $document, $compile) {
  //   return {
  //     terminal: true,
  //     link: function(scope, element, attrs) {
  //       var dialogElement,
  //           dialogBodyElement,
  //           dialogScope,
  //           dialogBodyScope,
  //           dialogBodyTemplate = element.contents();

  //       element.remove();

  //       scope.$watch(attrs.when, function(show) {
  //         if (show) {
  //           dialogScope = scope.$new(); // maybe even use $rootScope instead
  //           dialogBodyScope = scope.$new(); // must be child of scope => no need to export model

  //           angular.extend(dialogScope, {
  //             title: attrs.title,
  //             primaryLabel: attrs.primaryLabel || 'OK',
  //             secondaryLabel: attrs.secondaryLabel || 'Cancel',
  //             closeDialog: function() {
  //               dialogElement.modal('hide');
  //             },
  //             primaryAction: function() {
  //               this.closeDialog();
  //               dialogBodyScope.$eval(attrs.primaryAction);
  //             },
  //             secondaryAction: function() {
  //               this.closeDialog();
  //               dialogBodyScope.$eval(attrs.secondaryAction);
  //             }
  //           });

  //           dialogElement = $($templateCache.get('dialog-template'));
  //           $document.append(dialogElement);
  //           $compile(dialogElement)(dialogScope);
  //           dialogBodyElement = dialogElement.find('.modal-body');
  //           dialogBodyElement.append(dialogBodyTemplate);
  //           $compile(dialogBodyElement)(dialogBodyScope);

  //           dialogElement.modal('show');
  //           dialogElement.bind('hidden', function() {
  //             scope.$apply(function() {
  //               dialogScope.$destroy();
  //               dialogBodyScope.$destroy();
  //               dialogElement.remove();
  //               dialogElement = null;
  //               scope.$eval(attrs.when+" = false");
  //               // scope[attrs.when] = false; //hack, the model might be on a upper scope or might be a fn
  //             });
  //           });
  //         } else {
  //           if (dialogElement) {
  //             dialogElement.modal('hide');
  //           }
  //         }
  //       });
  //     }
  //   };
  // });