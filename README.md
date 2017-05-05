# www.benjanes.com
* My attempt at a static site generator for a react/redux blog

To install dependencies: `npm install`

This project has two content types: `posts` and `projects`. Posts are written as markdown with some self-explantory front matter and stored at `./_posts`. Projects are also written as markdown (front matter only) and stored at `./projects`.

To build the project's content into JSON: `npm run build:content`

To work on the client-side code on a local dev server (port 8080): `npm run dev`

A couple of extra steps need to be taken to host this as-is as a github page. First, the `index.html` file must live in the root directory. Second, a `404.html` page has been included in the root along with a script to handle redirects in `index.html`. This facilitates deep linking from outside of the app. See https://github.com/rafrex/spa-github-pages for more info (this was super helpful!).

To copy the `index.html` file from src to the root and update its pathing: `npm run build:moveHtml`

To package the whole thing up for distribution: `npm run build`

And then push that sucker up.
