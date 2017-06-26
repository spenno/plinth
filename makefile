HR = \n---------------------------------------------
BUILD := build

BREW = $(shell which brew)
SASS = $(shell which sass)
SASSLINT = $(shell which scss_lint)
YARN = $(shell which yarn)
GULP = $(shell which gulp)
NODE = $(shell which node)
XCODE = $(shell pkgutil --pkg-info=com.apple.pkg.CLTools_Executables)

build:

	@ echo "${HR}\nInstalling XCode Command Line Tools...${HR}\n"
ifeq (${XCODE}, )
	xcode-select --install
else
	@ echo "Command line tools are already installed."
endif

	@ echo "${HR}\nInstalling Homebrew and its dependencies...${HR}\n"
ifeq (${BREW}, )
	ruby -e "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
	@ echo "Homebrew v$(shell brew --version) is already installed.\n"
endif

	@ echo "${HR}\nInstalling Sass and its dependencies...${HR}\n"
ifeq (${SASS}, )
	@ gem install sass
else
	@ echo "$(shell sass --version) is already installed.\n"
endif

	@ echo "${HR}\nInstalling SCSS-Lint...${HR}\n"
ifeq (${SASSLINT}, )
	@ sudo gem install scss_lint
else
	@ echo "$(shell scss_lint --version) is already installed.\n"
endif

	@ echo "${HR}\nInstalling Node & NPM...${HR}\n"
ifeq (${NODE}, )
	brew install node
	npm install -g npm
else
	@ echo "Node $(shell node --version) is already installed."
endif
	@ echo "\n${CHECK} Done"

	@ echo "${HR}\nInstalling Yarn and its dependencies...${HR}\n"
ifeq (${YARN}, )
	@ brew install yarn
else
	@ echo "Yarn v$(shell yarn --version) is already installed."
endif
	@ yarn install
	@ echo "\n${CHECK} Done"

	@ echo "${HR}\nInstalling Gulp and its libraries...${HR}\n"
ifeq (${GULP}, )
	@ npm install -g gulp-cli
else
	@ echo "Gulp is already installed.\n"
endif
	@ sudo npm install
	@ echo "\n${CHECK} Done"

	@ echo "Run 'gulp' to start in development mode and watch for Sass and JavaScript changes."
	@ echo "Run 'gulp --prod' to minify CSS and JavaScript ready for production."
