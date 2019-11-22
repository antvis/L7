## master

## 1.0.0 (January 15, 2017)
* Add **prefixDefault** prop
  **true**: add langKey on all pages, including default

  **false**: omit langKey in url when page lang is the default. 
    Ex: when `langKeyDefault` is `en`, `blog/first-post.en.md` and `blog/first-post.pt.md` will have the following urls:
    - `/blog/first-post` 
    - `/pt/blog/first-post`

  Default: **true**

## 0.4.0 (December 03, 2017)

* Add redirectTo prop to return obj from getSlugAndLang.

## 0.3.0 (November 15, 2017)

* Add isInPagesPaths.
* Add getPagesPaths.
* Add folktale to dependencies.

## 0.2.5 (November 15, 2017)

* Fix getSlugAndLang for index pages.

## 0.2.4 (November 15, 2017)

* Allow getSlugAndLang to work with custom pages.
* Replace first param `defaultLangKey` with pluginOptions. (It still works in the old way, No breaking changes).
* Partial fix for:
  - https://github.com/angeloocana/gatsby-plugin-i18n/issues/6
  - https://github.com/angeloocana/gatsby-plugin-i18n/issues/10

## 0.2.3 (November 13, 2017)

* Makes getSlugAndLang work with nodes not in the pages dir.

## 0.2.2 (October 12, 2017)

* redirectToHome: Check if window is undefined.

## 0.2.1 (October 12, 2017)

* Fix getValidLangKey when null langKey.

## 0.2.0 (October 12, 2017)

* Add redirectToHome.
* Add getBrowserLanguage.
* Add getValidLangKey.

## 0.1.2 (September 15, 2017)

* Run tests before build.

## 0.1.1 (September 15, 2017)

* Fix getCurrentLangKey.

## 0.1.0 (September 09, 2017)

* Remove defaults.

## 0.0.6 (September 09, 2017)

* Initial public release.
