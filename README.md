# Plinth

A solid and simple base for front-end web projects using Sass, JavaScript, task automation and linting.


### Installing

On a Mac, launch Terminal (or your preferred alternative) and install the Xcode Command Line Tools:

```
$ xcode-select --install
```

If you've recently installed Xcode you might need to launch it and accept the terms and conditions.

Install Node.js by running the Node Version Manager (NVM) install script:

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```

If you're using [Z shell](https://www.zsh.org/), replace `bash` with `zsh` in the above install script.

Follow the instructions for restarting Terminal or using NVM straight away.

Check to see what version of Node.js is installed:

```
$ nvm list
```

Check the latest stable version of Node.js available for download:

```
$ nvm ls-remote --lts | grep Latest
```

To install to the latest version if you want / need to:

```
$ nvm install --lts
```

Check that the expected Node.js version is installed and active:

```
$ node -v
```

Update the Node.js Package Manager, NPM:

```
$ npm install -g npm
```

Install the Gulp command line utility:

```
$ npm install --g gulp-cli
```

Install all of Plinth's required packages:

```
$ npm install
```


### Usage

Run 'gulp' to start in development mode and watch for Sass and JavaScript changes.

```
$ gulp
```

Run 'gulp prod' to minify CSS and JavaScript ready for production.

```
$ gulp prod
```


## Built with

* [Sass Boilerplate](https://github.com/HugoGiraudel/sass-boilerplate) - A boilerplate for Sass projects
* [Gulp](http://gulpjs.com/) - Automate and enhance your workflow
* [include-media](http://include-media.com/) - Simple, elegant and maintainable media queries in Sass
* [Modular Scale](https://www.modularscale.com/) - Setting type to levels in a scale
* [Stylelint](https://stylelint.io/) - A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.
* [ESLint](https://eslint.org/) - The pluggable linting utility for JavaScript and JSX
