# Elevar

### Common Information

#### Project Team

    - Oleksii Glovliuk

##### Frontend

- NODEJS: v10.15.3
- NPM: v6.4.1
- Webpack 4+
- SCSS v3.1.0
- [Editorconfig](.editorconfig)

### Frontend instructions

#### Installation
- Install [node](http://nodejs.org) -- if not yet installed
- go to the root of the project theme
- run `npm install` or `yarn`

#### Running
- go to the root of the project
- development build:
    - `npm run dev` or `yarn dev`
- production/final build (optimization, minification, etc):
    - `npm run build` or `yarn build`
- run dev build and watcher:
    - `npm run watch` or `yarn watch`

all settings can be viewed in webpack.config.js at the root directory

#### Style Files:
- main scss file:
    - `\src\scss\main.scss`
- typography settings:
    - `\src\scss\elements\_typography.scss`
- scss variables:
    - `\src\scss\core\_variables.scss`, etc
- scss mixins:
    - `\src\scss\core\_mixins.scss`

#### Main Mixins, Extends & Help Classes:
- Vertical & Horizontal alignments: `@mixin xycenter;`
- Vertical alignment: `@mixin ycenter;`
- Horizontal alignment: `@mixin xcenter;`
- Placeholder: `@mixin placeholder;`
- Font@face: `@mixin font-face;`
- Lists reset: `@extend %listreset;`
- Available classes (for toggling content across viewport breakpoints.) like in [Bootstrap 3.*](https://getbootstrap.com/docs/3.3/css/#responsive-utilities-classes): `scss/helpers/_responsive-utilities.scss & _responsive-visibility.scss`

#### Breakpoints (used [Include Media library v1.4.9](https://include-media.com/)):

- phone: 530px
- phablet: 576px
- tablet: 768px
- desktop: 992px
- widescreen: 1200px
- superscreen: 1800px
- largescreen: 1440px
- megascreen: 2100px

Examples: `@include media('>=tablet') {}, @include media('<tablet') {}`

#### CSS
- svg icons save to folder
    - `\src\images\svg-icons`
- mobile-first for media queries, if possible
