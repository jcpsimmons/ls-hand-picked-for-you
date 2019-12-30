# Hand Picked for You

Webpage on the Living Spaces website that generates product suggestions for a user based on their browsing data on the site. View the page live: https://www.livingspaces.com/inspiration/hand-picked-items-for-you

## Project Structure/Build Pipeline

Source code is in the `src/` directory and contains:

- `layout.html` contains the page banner, CSS, and ID'd divs for easy DOM interaction from the script.
- `generatorScript.js` contains the constructor that runs the page's logic, as well as various state management functions.

### Building

In order to support most customers on LivingSpaces.com, and be easy to deploy in our CMS - the final output file must be one HTML snippet with inline CSS and JS. JavaScript should be compatible down to IE9 as many of our site visitors still use it.

Originally I wrote a simple git pre-commit hook to run the relevant npm commands to make the build, but this added complexity as I was working across multiple machines and the hooks wouldn't sync upon cloning the repo to a new machine. I am now using the awesome [pre-commit](https://www.npmjs.com/package/pre-commit) npm package that installs hooks automatically through npm, eliminating the need to manually sync hooks or create some kind of proprietary hook-installer.

pre-commit, `npm run build` is invoked which in turn runs `./node_modules/.bin/webpack-cli --mode production` Webpack grabs the `generatorScript.js` and runs it through Babel for IE9 compatibility (polyfill imported in-script). `HTMLWebpackPlugin` and `HtmlWebpackInlineSourcePlugin` are then used to add the Babel'd JavaScript as an inline script to the HTML. This makes for a very easy deploy to any area of our CMS - as the entirety of `build/index.html` can be copy-pasted anywhere that accepts HTML.
