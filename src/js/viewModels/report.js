define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojdatetimepicker',
  'ojs/ojselectcombobox', 'ojs/ojtimezonedata', 'ojs/ojlabel', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojtoolbar'
],
  function (oj, ko, $) {

    function ReportViewModel() {
      var self = this;
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      self.dateValueStart = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
      // self.dateValueStart = ko.observable(new Date());
      self.datePickerStart = {
        changeMonth: 'none',
        changeYear: 'none'
      };
      let testDay = new Date();
      testDay.setDate(testDay.getDate() + 4);
      self.dateValueEnd = ko.observable(oj.IntlConverterUtils.dateToLocalIso(testDay));
      self.datePickerEnd = {
        changeMonth: 'none',
        changeYear: 'none'
      };
      //Note that Combobox's value is always encapsulated in an array

      self.dateConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
        pattern: "MMM dd, yyyy"
      }));
      // console.log(self.dateValueStart());
      // console.log(self.dateValueEnd());
      /* toggle button variables */
      self.stackValue = ko.observable('off');
      self.orientationValue = ko.observable('vertical');

      self.dateRange = ko.observableArray();
      self.barSeries = ko.observableArray();
      self.barSeriesValue = ko.observableArray(self.barSeries());

      createSeries = (context, length) => {
        context.retArray = ko.observableArray();
        for (var i = 0; i < length; ++i) {
          context.retArray().push({
            name: context.dateRange()[i].toString(),
            items: [Math.random() * (100 - 15) + 15, Math.random() * (100 - 15) + 15]
          });
        }
        return context.retArray();
      };
      // createSeries(self, self.dateRange().length)

      generateReport = (context) => {
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
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dateArray;
        }

        context.dateRange(getDates(oj.IntlConverterUtils.isoToDate(self.dateValueStart()), oj.IntlConverterUtils.isoToDate(self.dateValueEnd())));

        worklogTime = new Array();
        /* chart data */
        $.getJSON('/js/viewModels/worklog.json', (data) => {
          $.each(data, (index, obj) => {
            if (obj.authorKey === 'ttthien@apcs.vn') {
              if (oj.IntlConverterUtils.isoToDate(obj.started) < oj.IntlConverterUtils.isoToDate(self.dateValueEnd()) && oj.IntlConverterUtils.isoToDate(obj.started) > oj.IntlConverterUtils.isoToDate(self.dateValueStart())) {
                let tmp = oj.IntlConverterUtils.isoToDate(obj.started);
                let date = days[tmp.getDay()] + ', ' + months[tmp.getMonth()] + ' '  + tmp.getDate()+ ', ' + tmp.getFullYear();
                worklogTime.push({
                  "date": date,
                  "timeSpent": obj.timeSpentSeconds
                });
              }
            }
          });
        });
        uniqueWorkLogDate = new Array();
        for (let i = 0; i < worklogTime.length; ++i){
          for (let j = 1; j < i; ++j){
            if (worklogTime[i]["date"] === worklogTime[j]["date"]){
              uniqueWorkLogDate.push({
                "date": worklogTime[i]["date"],
                "timeSpent": 0
              });
            }
          }
        }
        console.log(uniqueWorkLogDate);

        context.barSeries(createSeries(context, context.dateRange().length));
        context.barSeriesValue(context.barSeries());
      };

      self.generateButtonClicked = () => {
        generateReport(self);
      }

      self.connected = function () { };
      self.disconnected = function () { };
      self.transitionCompleted = function () { };
    }

    return new ReportViewModel();
  }
);