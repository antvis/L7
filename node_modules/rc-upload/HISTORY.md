# History
----

### 2.9.0

- Support `method`. #197

### 2.8.0

- `multiple` will works on drag upload.

### 2.7.0

- Support `transformFile` props to handle file before upload.

### 2.6.5

- fix `openFileDialogOnClick={false}` not to prevent on Enter event.

### 2.6.0 / 2018-09-21

- Add `openFileDialogOnClick`.

### 2.5.0 / 2018-06-12

- Support upload directory. [#114](https://github.com/react-component/upload/pull/114)
- Support `action={(file) => Promise}`. [#97](https://github.com/react-component/upload/pull/97)
- Fix a bluebird promise warning. [#110](https://github.com/react-component/upload/pull/110)

### 2.4.0 / 2017-07-15

- Add XHR for onSuccess callback by @xiangkaiy [!85](https://github.com/react-component/upload/pull/85)

### 2.3.8 / 2017-06-21

- fix issue #80 & #81 [#82](https://github.com/react-component/upload/pull/82)

### 2.3.5 / 2017-05-01

- Fix prop-types and create-react-class warning [!67](https://github.com/react-component/upload/pull/67)

### 2.3.4 / 2017-03-10

- disable upload progress listener in request if onPress is not set [!65](https://github.com/react-component/upload/pull/65)

### 2.3.3 / 2017-02-20

- beforeUpload add empty catch function when promise passed, fix [#64](https://github.com/react-component/upload/issues/64)

### 2.3.2 / 2016-12-30

- Fix crash if customRequest does not call onSuccess() / onError() [!60](https://github.com/react-component/upload/pull/60)

### 2.3.0 / 2016-12-12

- expose file list as argument to `beforeUpload` [!57](https://github.com/react-component/upload/pull/57)

### 2.2.0 / 2016-10-13

- support custom request option [!53](https://github.com/react-component/upload/pull/53)

### 2.1.1 / 2016-09-23

- support Blob file upload [!52](https://github.com/react-component/upload/pull/52)

### 2.1.0 / 2016-09-20

- add `className` prop

### 2.0.0 / 2016-08-10

- add abort api
- props.onStart's argument is always a single File
- add disabled prop

### 1.14.1 / 2016-07-19

- fix ajax multiple load

### 1.14.0 / 2016-07-19

- add component/style prop

### 1.13.0 / 2016-06-02

- add disabled state
- https://github.com/react-component/upload/issues/37

### 1.12.0 2016-05-10

- add supportServerRender prop

### 1.11.0 2016-05-03

- Allow all 2xx status as success status, not only 200. fix #34
- When `headers['X-Requested-With'] = null` , request do not set X-Requested-With as XMLHttpRequest , fix #33

### 1.9.0 2016-03-23

- pass file to data if data's type is function

### 1.8.1 2016-03-16

- fix InvalidStateError in IE 10
- fix #30

### 1.8.0 2016-01-14

- support custom XHR headers

### 1.7.2 2016-01-13

- add prop withCredentials config

### 1.7.0 2015-10-27

- react 0.14 support
- remove superagent

### 1.6.6 2015-09-29

- feat: add beforeUpload support, [#19](https://github.com/react-component/upload/pull/19)

### 1.5.2 2015-09-18

- fix: Fixed bug calling wrong method name [#13](https://github.com/react-component/upload/pull/13)

### 1.5.0 2015-09-16

- feat: add getFormContainer prop to decide container where form to be inserted.

### 1.4.4 2015-09-16

- feat: Added aria role and keyboard navigation, pr[#9](https://github.com/react-component/upload/pull/9)

### 1.4.2 2015-09-15

- fix: IframeUpload move form to body [#8](https://github.com/react-component/upload/pull/8)

### 1.4.0 2015-09-09

- onStart file argument change to a array when multiple files uploaded

### 1.3.0 2015-08-12

- onError arguments change to `err, responce, file`

### 1.2.3 2015-07-17

- support file drop

### 1.2.2 2015-06-25

- `fix` pr[#2](https://github.com/react-component/upload/pull/2)

### 1.2.1 2015-06-24

- `feat` Finish basic funcion
