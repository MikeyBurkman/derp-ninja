derp-ninja
==========

Hybrid Chat/Messaging Program

==========

To Install

Install Vagrant and Oracle Virtualbox.

Make sure they're on your path. They will be automatically on Linux and OSX. On Windows you'll have to add them manually.

Make sure that ssh is on your path as well. Again, this will be by default on Linux and OSX. 
SSH is included with Git, so if on Windows, adding the Git bin directory to your path should be sufficient.

Do `vagrant up`
This will download/start the VM and install all NPM/Bower dependencies. It may take 10-15 minutes.

Do `vagrant ssh`. This will SSH into the VM. Now start both frontend and backend servers by doing `gulp serve:all`.

From a browser, go to `http://localhost:3000`. Bam. App.

To view logs as they come, `tail -f logs/derp-ninja-messaging.log | bunyan`
