# History
----

## 2.4.10 / 2019-11-09

- There should not be any lifecycle warning now!

## 2.4.0 / 2018-12-21

- Field option add `preserve` to enable you keep value even if field removed.

## 2.3.0 / 2018-12-17

- `createForm` add `name` prop. It will be as prefix with `fieldNameProp`

## 2.2.1 / 2018-07-11

- `validateFieldsAndScroll` should ignore `input[type=hidden]` [#169](https://github.com/react-component/form/pull/169) [@HsuTing](https://github.com/HsuTing)
- `mapPropsToFields` and so on support field with `null` value [#159](https://github.com/react-component/form/pull/159) [@normanrz](https://github.com/normanrz)

## 2.2.0 / 2018-04-04

- Support callback in setFieldsValue [#144](https://github.com/react-component/form/pull/144)
- Expose formShape [#154](https://github.com/react-component/form/pull/154) [@sylvainar](https://github.com/sylvainar)
- Fix bug with disordered array [#143](https://github.com/react-component/form/pull/143)

## 2.1.0 / 2017-11-22

- Support switching from different components with same field name. [#117](https://github.com/react-component/form/pull/117)

## 2.0.0 / 2017-11-07

- Remove `option.exclusive` of `getFieldProps` and `getFieldDecorator`, just use something like [`antd.Radio.Group`](https://ant.design/components/radio/#components-radio-demo-radiogroup) or [`antd.Checkbox.Group`](https://ant.design/components/checkbox/#components-checkbox-demo-group) as workaround.
- Add `createFormField`, and you must use it to wrap field data in `option.mapPropsToFields` of `createForm` or `createDOMForm`:
  Before rc-form@2.0.0:
  ```jsx
  import { createForm } from 'rc-form';
  createFrom({
    mapPropsToFields() {
      return {
        name: { value: 'rc-form' },
      };
    },
  })
  ```
  After rc-form@2.0.0:
  ```jsx
  import { createForm, createFormField } from 'rc-form';
  createFrom({
    mapPropsToFields() {
      return {
        name: createFormField({ value: 'rc-form' }),
      };
    },
  })
  ```
- Deprecate `form.isSubmitting` and `form.submit`, just handle submit status in your own code.


## 1.4.0 / 2017-06-13

- support wrappedComponentRef and deprecate withRef [#87](https://github.com/react-component/form/pull/87)

## 1.3.0 / 2017-01-07

- support touch checking: https://github.com/react-component/form/pull/56

## 1.2.0 / 2017-01-05

- support onValuesChange: https://github.com/react-component/form/pull/55

## 1.1.0 / 2016-12-28

- support nested field: https://github.com/react-component/form/pull/48

## 1.0.0 / 2016-08-29

- support getFieldDecorator. stable.

## 0.17.0 / 2016-06-12

- support checkbox radio https://github.com/react-component/form/pull/21
- add exclusive config

## 0.16.0 / 2016-05-19

- move instance to this.instances

## 0.15.0 / 2016-03-28

- add getValueFromEvent/getValueProps


## 0.14.0 / 2016-02-27

- remove refComponent prop.(defaults to true), so you must use getFieldInstance method to get instance instead of ref

## 0.13.0 / 2016-02-14

- support rc-form/lib/createDOMForm

## 0.12.0 / 2016-02-02

- support refComponent/mapProps option for createForm to scroll error fields into view.

## 0.11.0 / 2016-02-02

- support validateMessages of createForm option.

## 0.10.0 / 2016-01-27

- support setFieldsInitialValue/submit/isFieldsValidating/isSubmitting method for this.props.form

## 0.9.0 / 2016-01-18

- support force, force to revalidate.

```
this.props.validateFields(['xx'], {force: true}).
```

## 0.8.0 / 2016-01-13

- support validate/validateFirst option for getFieldProps

## 0.7.0 / 2015-12-29

- support this.props.form.resetFields

## 0.6.0 / 2015-12-28

- support normalize in getFieldProps option
