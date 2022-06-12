/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/'use strict';

(function (Drupal, drupalSettings) {
    var shouldShowOnThisPage = function shouldShowOnThisPage() {
      var pages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var negate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  
      if (pages.length === 0) {
        return true;
      }
  
      var pagePathMatches = false;
      var currentPath = window.location.pathname;
  
      for (var i = 0; i < pages.length; i++) {
        var baseUrl = drupalSettings.path.baseUrl.slice(0, -1);
        var page = baseUrl + pages[i];
  
        if (page.charAt(page.length - 1) === '*') {
          if (currentPath.startsWith(page.substring(0, page.length - 1))) {
            pagePathMatches = true;
            break;
          }
        } else if (page === currentPath) {
          pagePathMatches = true;
          break;
        }
      }
  
      return negate ? !pagePathMatches : pagePathMatches;
    };
  
    var alertWasDismissed = function alertWasDismissed(alert) {
      if (!('alert-dismissed-' + alert.uuid in window.localStorage)) {
        return false;
      }
  
      var dismissedAtTimestamp = Number(window.localStorage.getItem('alert-dismissed-' + alert.uuid));
  
      if (dismissedAtTimestamp < alert.dismissalIgnoreBefore) {
        return false;
      }
  
      return true;
    };
  
    var dismissAlert = function dismissAlert(alert) {
      window.localStorage.setItem('alert-dismissed-' + alert.uuid, String(Math.round(new Date().getTime() / 1000)));
      var alertElement = document.querySelector('[data-uuid="' + alert.uuid + '"]');
      alertElement.remove();
    };
  
    var initAlert = function initAlert(alert) {
      var alertElement = document.createElement('div');
  
      alertElement.setAttribute('data-uuid', alert.uuid);
      alertElement.classList.add('sitewide-alert', 'alert', alert.styleClass);
  
      var textElement = document.createElement('span');
      textElement.innerHTML = alert.message;
  
      alertElement.appendChild(textElement);
  
      if (alert.dismissible) {
        var dismissalButton = document.createElement('button');
        dismissalButton.classList.add('close');
        dismissalButton.setAttribute('aria-label', 'close');
        dismissalButton.addEventListener('click', function () {
          return dismissAlert(alert);
        });
  
        var dismissalSpan = document.createElement('span');
        dismissalSpan.innerHTML = '&times;';
        dismissalSpan.setAttribute('aria-hidden', 'true');
  
        dismissalButton.appendChild(dismissalSpan);
  
        alertElement.appendChild(dismissalButton);
      }
  
      return alertElement;
    };
  
    var fetchAlerts = function fetchAlerts() {
      var alerts = fetch(window.location.origin + drupalSettings.path.baseUrl + drupalSettings.path.pathPrefix + 'sitewide_alert/load').then(function (res) {
        return res.json();
      }).then(function (result) {
        return result.sitewideAlerts;
      }, function (error) {
        console.error(error);
      });
      return alerts;
    };
  
    var removeStaleAlerts = function removeStaleAlerts(alerts) {
      var root = document.getElementById('sitewide-alert');
      var existingAlerts = root.querySelectorAll('[data-uuid]');
  
      var alertsToBeRemoved = Array.from(existingAlerts).filter(function (alert) {
        return !alerts.includes(alert.getAttribute('data-uuid'));
      });
  
      alertsToBeRemoved.forEach(function (alert) {
        return alert.remove();
      });
    };
  
    var initAlerts = function initAlerts() {
      var root = document.getElementById('sitewide-alert');
  
      fetchAlerts().then(function (alerts) {
        removeStaleAlerts(alerts);
        alerts.forEach(function (alert) {
          var dismissed = alertWasDismissed(alert);
  
          var showOnThisPage = shouldShowOnThisPage(alert.showOnPages, alert.negateShowOnPages);
  
          var existingAlertElement = root.querySelector('[data-uuid="' + alert.uuid + '"]');
  
          if (showOnThisPage && !dismissed) {
            var renderableAlertElement = initAlert(alert);
  
            existingAlertElement ? root.replaceChild(renderableAlertElement, existingAlertElement) : root.appendChild(renderableAlertElement);
            return;
          }
  
          if ((dismissed || !showOnThisPage) && existingAlertElement) {
            existingAlertElement.remove();
          }
        });
      });
    };
  
    Drupal.behaviors.sitewide_alert_init = {
      attach: function attach(context, settings) {
        initAlerts();
  
        if (drupalSettings.sitewideAlert.automaticRefresh === true) {
          var interval = setInterval(function () {
            return initAlerts();
          }, drupalSettings.sitewideAlert.refreshInterval < 1000 ? 1000 : drupalSettings.sitewideAlert.refreshInterval);
  
          if (!drupalSettings.sitewideAlert.automaticRefresh) {
            clearInterval(interval);
          }
        }
      }
    };
  })(Drupal, drupalSettings);;
  Drupal.behaviors.toggleLanguageswitcher={attach:function(context){jQuery(".languageswitcher__toggle",context).once("attach_toggle_languageswitcher").each(function(index,element){if(window.location.pathname.split("/")[1]&&jQuery("a[data-localization=\"/"+window.location.pathname.split("/")[1]+"\"]").length){var menuItem=jQuery("a[data-localization=\"/"+window.location.pathname.split("/")[1]+"\"]:eq(0)");menuItem.addClass("is-active"),menuItem.closest(".languageswitcher__regions-item").addClass("is-active");var toggleIcon=jQuery(element).find("svg");jQuery(element).text((menuItem.parent().find("strong").length?menuItem.parent().find("strong").text():"Global")+" /"+menuItem.text()).prepend(toggleIcon)}else{var menuItem=jQuery("a[data-localization=\"/en\"]:eq(0)");menuItem.addClass("is-active")}jQuery(this).on("click",function(e){jQuery(this).toggleClass("languageswitcher__toggle--open"),e.preventDefault(),jQuery(".languageswitcher__wrapper").slideToggle("fast",function(){null!==this.offsetParent&&this.scrollIntoView()})})}),jQuery(".languageswitcher__regions-item > a",context).once("attach_toggle_languageswitcher_region").each(function(){jQuery(this).on("click",function(e){e.preventDefault();var me=jQuery(this).siblings(".languageswitcher__region");jQuery(this).parent().parent().find(".languageswitcher__region").not(me).slideUp(),jQuery(this).parent().parent().find(".languageswitcher__regions-item").not(me.parent()).removeClass("is-active"),jQuery(this).siblings(".languageswitcher__region").slideToggle(),jQuery(this).parent().toggleClass("is-active")})})}},Drupal.behaviors.clickLanguageMenuItem={attach:function(){jQuery("a[data-localization]").once("attach_click_languagemenuitem").each(function(){jQuery(this).on("click",function(){var cookieExpireDate=new Date;cookieExpireDate.setFullYear(cookieExpireDate.getFullYear()+1),document.cookie="axis_localization = "+jQuery(this).data("localization")+"; expires="+cookieExpireDate+"; path=/; domain=.axis.com"})})}};;
  