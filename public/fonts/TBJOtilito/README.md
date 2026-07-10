# TBJOtilito font files

Put your font files in this folder:

- TBJOtilito-Light.woff2
- TBJOtilito-Regular.woff2
- TBJOtilito-Bold.woff2
- (optional fallback) .woff files with same names

Recommended path to use in CSS:

- /fonts/TBJOtilito/TBJOtilito-Light.woff2
- /fonts/TBJOtilito/TBJOtilito-Regular.woff2
- /fonts/TBJOtilito/TBJOtilito-Bold.woff2

Example @font-face:

@font-face {
  font-family: 'TBJOtilito';
  src: url('/fonts/TBJOtilito/TBJOtilito-Regular.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
