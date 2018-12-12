define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojdatetimepicker',
    'ojs/ojselectcombobox', 'ojs/ojtimezonedata', 'ojs/ojlabel', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojtoolbar'
  ],
  function (oj, ko, $) {

    function ReportViewModel() {
      var self = this;

      self.dateValueStart = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
      // self.dateValueStart = ko.observable(new Date());
      self.datePickerStart = {
        changeMonth: 'none',
        changeYear: 'none'
      };
      self.dateValueEnd = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
      self.datePickerEnd = {
        changeMonth: 'none',
        changeYear: 'none'
      };
      //Note that Combobox's value is always encapsulated in an array

      self.dateConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
        pattern: "MMM dd, yyyy"
      }));
      console.log(self.dateValueStart());
      console.log(self.dateValueEnd());
      /* toggle button variables */
      self.stackValue = ko.observable('off');
      self.orientationValue = ko.observable('vertical');

      Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      }

      function getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
          dateArray.push(new Date(currentDate));
          currentDate = currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
      }

      self.dateRange = ko.observableArray();
      self.dateRange(getDates(oj.IntlConverterUtils.isoToDate(self.dateValueStart()), oj.IntlConverterUtils.isoToDate(self.dateValueEnd())));

      /* chart data */

      self.barSeries = ko.observableArray();
      for (var i =0; i < self.dateRange().length; i++){
        self.barSeries.push({
          name: self.dateRange()[i].toString(),
          items: [Math.random() * (100-15) + 15, Math.random() * (100-15) + 15]
        })
      }

      var barGroups = ["Group A", "Group B"];

      self.barSeriesValue = ko.observableArray(self.barSeries());
      self.barGroupsValue = ko.observableArray(barGroups);

      self.connected = function () {};
      self.disconnected = function () {};
      self.transitionCompleted = function () {};
    }

    return new ReportViewModel();
  }
);