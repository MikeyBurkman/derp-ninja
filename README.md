derp-ninja
==========

An in-progress hybrid Chat/Messaging Program  
  
# Installation on Mac:  
1. Make sure Xcode is installed  
2. Install [nvm](https://github.com/creationix/nvm) (Node version manager)  
3. Install Node 0.8.20  
	3.1. `nvm install 0.8.20`  
4. Install [postgres.app](http://postgresapp.com/) (Standalone app for Postgres database development)  
5. Install required libraries using npm (Node package manager) -- npm should have been installed when you installed node  
	5.1. `cd derp-ninja`  
	5.2. `npm install`  
6. You're good to go!  
  
# Running the app in development mode:  
1. Start the postgres.app application  
2. Navigate to the root directory  
	2.1. `cd derp-ninja`  
3. Start the app:  
	3.1. `node app.js`  
4. The app should start, building all the required database tables first  
	4.1. You may see an error in the logs due to the tables not existing. You can ignore this error. If you restart the app, you shouldn't see this error a second time.  
5. Navigate to [http://localhost:3000](http://localhost:3000) to access the app!  
