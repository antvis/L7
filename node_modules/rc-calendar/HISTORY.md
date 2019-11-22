# History
----
## 9.15.0 / 2019-05-26

- Support Malay locales

## 9.15.0 / 2019-06-06

- Add numeric keyboard support

## 9.14.0 / 2019-05-24

- Support Latvian locales

## 9.13.0 / 2019-04-02

- Support close onBlur

## 9.12.0 / 2019-03-16

- RangerPicker support null as start or end

## 9.11.0 / 2019-03-14

- RangerPicker can select same month

## 9.10.0 / 2019-01-02

- add `focusablePanel` prop.

## 9.9.0 / 2018-12-23

- `renderFooter(mode)` support all modes.

## 9.8.0 / 2018-11-30

- DateInput support multiple date format

## 9.7.0 / 2018-08-07

- Add clearIcon.

## 9.6.0 / 2018-02-08

- Add Picker[dropdownClassName]

## 9.5.0 / 2017-12-26

- Add Kurdish

## 9.4.0 / 2017-12-26

- Add Uyghur

## 9.2.0 / 2017-11-06

- React 16 support

## 9.1.0 / 2017-07-27
- Support control panel [#284](https://github.com/react-component/calendar/pull/284)

## 9.0.0 / 2017-07-27
- Replace react string refs with function way [#282](https://github.com/react-component/calendar/pull/282)

## 8.4.0 / 2017-05-31

- Supporting Bulgarian.
- UX: can select end date first, and then start date.

## 8.3.0 / 2017-05-18

- expose hoverValue as controlled property and onHoverChange

## 8.2.0 / 2017-05-16

- Time of `Calendar[timePicker]` & `RangeCalendar[timePicker]` could be set now
- Fix that two panels of RangeCalendar should not be the same month

## 8.1.0 / 2017-04-10

- Add locale fi_FI

## 8.0.0 / 2017-04-07

- Improve UX of RangeCalendar
- A breaking change for hidden API

## 7.8.0 / 2017-04-01

- zh-TW locale
- tr-TR locale

## 7.6.0 / 2017-01-11

- remove arrow inside year and century panel

## 7.5.0 / 2016-11-16

- add showToday for RangeCalendar

## 7.4.0 / 2016-11-01

- add monthCellContentRender/cellContentRender for MonthCalendar

## 7.3.0 / 2016-10-18

- disabledTime support type param for range-calendar

## 7.2.0 / 2016-09-23

- add week calendar example
- support renderSidebar, renderFooter prop
- add type prop to support start-end-range example
- picker remove onClose, change onOpen to onOpenChange

## 7.1.0 / 2016-09-10

- use css pseudo after: https://github.com/react-component/calendar/pull/152

## 7.0.0 / 2016-08-06

- goodbye gregorian-calendar, hello moment

## 6.0.0 / 2016-07-13

- use rc-time-picker/lib/module/panel as timepicker element
- merge date input and time input. formatter can control time part.

## 5.6.0 / 2016-06-20

- optimize keyboard, add onKeyDown for Picker children

## 5.5.0 / 2016-03-22

- support monthCellContentRender/dateCellContentRender

## 5.3.0 / 2016-01-18

- support clear for RangeCalendar

## 5.1.0 / 2015-12-25

- support dateInputPlaceholder for RangeCalendar

## 5.0.0 / 2015-12-21

- use rc-time-picker, add timePicker, disabledTime props
- remove showTime props
- remove bootstrap style

## 4.0.0 / 2015-11-18

- refactor!
- support input inside rc-calendar
- change MonthCalendar to require('rc-calendar/lib/MonthCalendar')
- change Picker to require('rc-calendar/lib/Picker')
- change Picker's orient to placement and align as rc-trigger
- add RangeCalendar: require('rc-calendar/lib/RangeCalendar')
- add FullCalendar: require('rc-calendar/lib/FullCalendar')

## 3.16.0 / 2015-08-25

-- add Calendar.MonthCalendar component

## 3.15.0 / 2015-08-24

-- add onChange prop

## 3.14.0 / 2015-08-21

-- remove renderCalendarToBody. defaults to true

## 3.13.0 / 2015-08-15

- support controlled open prop for Picker
- add onOpen/onClose callback for Picker

## 3.12.0 / 2015-07-30

use rc-animate & rc-align (css change)

## 3.11.0 / 2015-07-20

support disabled prop for picker

## 3.10.1 / 2015-07-02

add adjustOrientOnCalendarOverflow prop for picker

## 3.10.0 / 2015-07-01

`new` support picker animation [#39](https://github.com/react-component/calendar/issues/39)

## 3.9.0 / 2015-06-11

`improved` fix by #33 #34 #35

## 3.8.0 / 2015-06-03

`improved` refactor by split components

## 3.7.0 / 2015-06-01

`improved` move nextDecade and prevDecade button to YearPanel body, optimize disable style for ant-design

## 3.5.0 / 2015-05-26

`new` publish transformed es5 code to npm

## 3.4.0 / 2015-05-19

`new` [#21](https://github.com/react-component/calendar/issues/21) add trigger prop for DatePicker

## 3.3.0 / 2015-05-13

use jsx as extension name

## 3.2.0 / 2015-05-11

add ant-design theme(index.css).

## 3.1.1 / 2015-04-21

fix ie broken focus

## 3.1.0 / 2015-03-23

`improved` [#17](https://github.com/react-component/calendar/issues/17) support today button to select

## 3.0.0 / 2015-03-13

upgrade to react 0.13 and es6

## 2.1.0 / 2015-03-10

`new` [#16](https://github.com/react-component/calendar/issues/16) support clear button

## 2.0.0 / 2015-03-04

`new` [#15](https://github.com/react-component/calendar/issues/15) support defaultValue
`improved` upgrade gregorian-calendar and gregorian-calendar-format to 3.x

## 1.5.0 / 2015-01-22

`new` [#13](https://github.com/react-component/calendar/issues/13) support DatePicker

## 1.4.0 / 2015-01-05

`new` [#12](https://github.com/react-component/calendar/issues/12) support time select   ([@yiminghe](https://github.com/yiminghe))

`new` [#11](https://github.com/react-component/calendar/issues/11) support prefixCls   ([@yiminghe](https://github.com/yiminghe))

`new` [#10](https://github.com/react-component/calendar/issues/10) support nextMonth previousMonth in calendar panel   ([@yiminghe](https://github.com/yiminghe))

## 1.3.0 / 2014-12-30

`new` [#9](https://github.com/react-component/calendar/issues/9) support className prop   ([@yiminghe](https://github.com/yiminghe))

`new` [#8](https://github.com/react-component/calendar/issues/8) support orient prop   ([@yiminghe](https://github.com/yiminghe))

## 1.2.4 / 2014-12-26

`new` [#7](https://github.com/react-component/calendar/issues/7) release 1.2.4   ([@yiminghe](https://github.com/yiminghe))
