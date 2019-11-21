## master

## 1.0.1 (January 27, 2019)

* Fix warnings generated for markup pages.

## 1.0.0 (January 15, 2019)
* Add **prefixDefault** prop
  **true**: add langKey on all pages, including default

  **false**: omit langKey in url when page lang is the default. 
    Ex: when `langKeyDefault` is `en`, `blog/first-post.en.md` and `blog/first-post.pt.md` will have the following urls:
    - `/blog/first-post` 
    - `/pt/blog/first-post`

  Default: **true**

## 0.4.2 (April 04, 2018)

* Fix 404 page. Thanks @ChrisBoon ! https://github.com/angeloocana/gatsby-plugin-i18n/pull/37

## 0.4.1 (December 03, 2017)

* Fix contentful pages. Issue: https://github.com/angeloocana/gatsby-plugin-i18n/issues/16

## 0.4.0 (November 16, 2017)

* Add `pagesPaths` to plugin options.

## 0.3.5 (November 01, 2017)

* Ignore files outside `pages` folder. Fix https://github.com/angeloocana/gatsby-plugin-i18n/issues/9

## 0.3.4 (October 26, 2017)

* Fix deletePage. https://github.com/angeloocana/gatsby-plugin-i18n/issues/8

## 0.3.3 (October 11, 2017)

* Made ptz-i18n required dependency.

## 0.3.2 (October 04, 2017)

* 100% test coverage.
* Upgrade dependencies.

## 0.3.1 (October 04, 2017)

* Add layout option to markdownPages.

## 0.3.0 (October 04, 2017)

* Add useLangKeyLayout option.

## 0.2.0 (September 23, 2017)

* Make MarkdownRemark optional.

## 0.1.1 (September 09, 2017)

* Move tags to gatsby-plugin-i18n-tags.
* Move getSlugAndLangKey() to ptz-i18n.

## 0.0.5 (August 30, 2017)

* Add options.
