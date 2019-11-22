
7.5.1 / 2019-08-27
==================

**fixes**
  * [[`ed14802`](http://github.com/eggjs/eslint-config-egg/commit/ed1480222dd6a8f77121cbe679fe59fbf757662d)] - fix: no need to lint empty interface and params (#47) (吖猩 <<whxaxes@gmail.com>>)

7.5.0 / 2019-08-23
==================

**features**
  * [[`302b736`](http://github.com/eggjs/eslint-config-egg/commit/302b736be4888a38a16c76785c7f31d55819322c)] - feat: support typescript (#46) (吖猩 <<whxaxes@gmail.com>>)

**others**
  * [[`585d2b3`](http://github.com/eggjs/eslint-config-egg/commit/585d2b3a52a4f5c640f8e1afc863615fd1820dc6)] - chore: Update .travis.yml (#45) (TZ | 天猪 <<atian25@qq.com>>)

7.4.1 / 2019-05-06
==================

**fixes**
  * [[`491fee8`](http://github.com/eggjs/eslint-config-egg/commit/491fee8366d4b029c71eeb9d9f8cad3925aafb45)] - fix: ignore linebreak-style at win (#43) (TZ | 天猪 <<atian25@qq.com>>)

7.4.0 / 2019-05-06
==================

**features**
  * [[`5f86efe`](http://github.com/eggjs/eslint-config-egg/commit/5f86efee0f9d1421a75fa0697c6ac7c95b275630)] - feat: linebreak-style at win (#42) (TZ | 天猪 <<atian25@qq.com>>)

7.3.1 / 2019-03-27
==================

**fixes**
  * [[`34ca417`](http://github.com/eggjs/eslint-config-egg/commit/34ca4179f1e4e20ef34acdc502488f1422977920)] - fix: remove check-example rule (#41) (吖猩 <<whxaxes@qq.com>>)

7.3.0 / 2019-03-26
==================

**features**
  * [[`e1935e3`](http://github.com/eggjs/eslint-config-egg/commit/e1935e38bca406fc8b981620a93cd6f5fd050b28)] - feat: jsdoc improvement (#40) (吖猩 <<whxaxes@qq.com>>)

**others**
  * [[`e4c222b`](http://github.com/eggjs/eslint-config-egg/commit/e4c222b3bb4f81634c367744a7eca2e508c10385)] - chore: add contributors on README (#39) (fengmk2 <<fengmk2@gmail.com>>)

7.2.0 / 2019-03-11
==================

**features**
  * [[`ba9a317`](http://github.com/eggjs/eslint-config-egg/commit/ba9a317f7a5e9f81fcfe337eb15a6a7f60d74638)] - feat: add prefer promise reject errors (#38) (Yiyu He <<dead_horse@qq.com>>)

7.1.0 / 2018-08-25
==================

**features**
  * [[`9e21077`](http://github.com/eggjs/eslint-config-egg/commit/9e21077c1b3ef7784b2c61a7fec54635f5571c76)] - feat: upgrade to es2018 support object rest/spread properties (#37) (Haoliang Gao <<sakura9515@gmail.com>>)

**others**
  * [[`c01647f`](http://github.com/eggjs/eslint-config-egg/commit/c01647f493c6234ddbfdcb3f7e273519c6098ff9)] - docs: update dependencies version in README (#36) (萨波 <<bowei.jbw@gmail.com>>)
  * [[`bd881c5`](http://github.com/eggjs/eslint-config-egg/commit/bd881c5bbb32f84e27d9f106664fd8e9676c147c)] - test: add node 10 (#35) (薛定谔的猫 <<hh_2013@foxmail.com>>)

7.0.0 / 2018-02-24
==================

  * feat: add eslint-plugin-eggache && drop support 4.x (#34)

6.0.0 / 2017-12-26
==================

**others**
  * [[`503d872`](http://github.com/eggjs/eslint-config-egg/commit/503d87239183d9abed36a4b3253cb148b45029c6)] - deps: upgrade babel-eslint (#33) (Haoliang Gao <<sakura9515@gmail.com>>)

5.1.1 / 2017-09-04
==================

**fixes**
  * [[`3142d5b`](http://github.com/eggjs/eslint-config-egg/commit/3142d5b0f821fee9d4a7e284ad7d7b75ca46887c)] - fix: disable functions options in comma-dangle (#32) (Haoliang Gao <<sakura9515@gmail.com>>)

5.1.0 / 2017-08-25
==================

  * feat: disable browser env on node (#31)

5.0.0 / 2017-06-28
==================

  * feat: upgrade eslint-plugin-jsx-a11y (#30)
  * feat: BREAKING_CHANGE upgarde eslint-plugin-react (#29)

4.2.1 / 2017-06-12
==================

  * fix: remove unused ecmaFeatures, compatible with eslint4 (#28)

4.2.0 / 2017-05-25
==================

  * feat: disable forbid-prop-types and require-default-props (#26)

4.1.0 / 2017-05-09
==================

  * deps: peerDeps to deps (#24)

4.0.0 / 2017-05-06
==================

  * feat: support es8 by default (#23)
  * feat: add React rules (#22)

3.2.0 / 2016-11-03
==================

  * feat: disable no-useless-escape (#21)
  * doc: reference about trailing commas (#19)

3.1.0 / 2016-07-13
==================

  * doc: add more usage in readme (#18)
  * feat: sourceType, no-extra-parens, brace-style, no-console (#17)

3.0.3 / 2016-07-12
==================

  * fix: should work with eslint 3 (#16)

3.0.2 / 2016-07-12
==================

  * fix: change rules that should not use (#15)

3.0.1 / 2016-07-08
==================

  * fix: miss legacy (#13)

3.0.0 / 2016-07-08
==================

  * refactor: refactor all rules based on eslint-config-airbnb and old ones, and classify them by category. (#11)

2.1.0 / 2016-03-11
==================

  * docs: update README.md
  * deps: add peerDependencies

2.0.0 / 2016-03-04
==================

  * feat: enable ecmaVersion 6
  * feat: remove consistent-return
  * upgrade eslint to 2.0.0

1.0.3 / 2016-01-11
==================

  * ignore @return when function is not returnd

1.0.2 / 2015-12-18
==================

  * allow foo == undefined
  * reflect: 修改switch-case 的缩进策略

1.0.0 / 2015-11-13
==================

First Version
