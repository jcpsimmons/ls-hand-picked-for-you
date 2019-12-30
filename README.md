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

## Why not use React?

I decided to write this application without React (and specifically create-react-app) in order to better understand **build pipelines** and **lifecycle hooks**.

### Build Pipelines

I've used Gulp and Babel before but haven't had much exposure to Webpack. create-react-app's build pipeline is great, but doesn't really aid learning of these tools. Setting up Webpack for this project, and using plugins to extend its functionality allowed me to much better understand how to use this tool.

### Lifecycle Hooks

I'm very familiar with React's lifecycle hooks - they're a great code-shortcut and highly efficient. Writing my own (loading state in my code) to handle application state gave me a much better appreciation for what's actually going on behind the scenes in React.

## Next Time

If I were to rebuild this app, I'd likely just use create-react-app since this would greatly simplify the code through modularizing it. Now that I'm more confident with tweaking and customizing build tools in this sort of project layout I'd feel confident spitting all of the code out to a single file for easy interfacing with the CMS.
