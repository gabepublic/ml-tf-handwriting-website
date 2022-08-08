# ml-tf-handwriting-website

Digit handwriting recognition using ML tensorflow javascript library.
The ML model has been pre-trained and stored in the `src/models` folder.

## Prerequisite

- [Node.js & NPM](https://digitalcompanion.gitbook.io/home/setup/node.js)


## Setup

- Clone this repo

- Note: the ML models has been pre-trained and stored in `models` folder

- Note: the `src` folder contains a very simple web site that will be served
  by the simple http-server


## Develop
  
- Run the Http server
```
npx serve src -l 8000
```

## Deploy

- Register an account with [Render.com](https://render.com/)

- Render documentation for [Static Sites](https://render.com/docs/static-sites)

- Deployment by linking this Github repo to Render

- Note: Static sites on Render are free, with no cost at all unless the
  traffics go above 100 GB of bandwidth per month.


## References

- npm [serve](https://www.npmjs.com/package/serve)

- [JSDELVR - @tensorflow/tfjs](https://www.jsdelivr.com/package/npm/@tensorflow/tfjs)