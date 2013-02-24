derp-ninja
==========

Hybrid Chat/Messaging Program

Installation on Mac:
1) Make sure Xcode is installed
2) Install nvm (Node version manager)
	https://github.com/creationix/nvm
3) Install Node 0.8.20
	nvm install 0.8.20
4) Install postgres.app (Standalone app for Postgres database development)
	http://postgresapp.com/
5) Install required libraries using npm (Node package manager)
	cd ninja-derp
	npm install
6) Good to go!

Running the app in development mode:
1) Start the postgres.app application
2) Navigate to the root directory
	cd ninja-derp
3) Start the app:
	node app.js
4) The app should start, building all the required database tables first
	You may see an error in the logs due to the tables not existing.
	You can ignore this error. If you restart the app, you shouldn't
		see this error a second time.
5) Navigate to http://localhost:3000 to access the app!
