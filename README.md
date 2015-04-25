derp-ninja
==========

Hybrid Chat/Messaging Program

==========

To Install

Install Vagrant and Oracle Virtualbox.

Make sure they're on your path. They will be automatically on Linux and OSX. On Windows you'll have to add them manually.

Make sure that ssh is on your path as well. Again, this will be by default on Linux and OSX. 
SSH is included with Git, so if on Windows, adding the Git bin directory to your path should be sufficient.

Navigate to this folder. Do `vagrant up`
This will download the VM and install all NPM/Bower dependencies. It may take 10-15 minutes.

Do `vagrant ssh`. This will SSH into the VM. From here, navigate to /vagrant: `cd /vagrant`. Now start the server: `gulp serve`.

From a browser, go to `http://localhost:3000`. Bam.

To view logs, `tail -f logs/derp-ninja-messaging.log | bunyan`
