echo "Adding puppet repo"
rpm -ivh http://yum.puppetlabs.com/puppetlabs-release-fedora-20.noarch.rpm
echo "installing puppet"
yum install puppet -y
echo "ensure puppet service is running"
puppet resource service puppet ensure=running enable=true
#echo "ensure puppet service is running"
#sudo puppet resource service puppetmaster ensure=running enable=true

#echo "ensure puppet service is running for standalone install"
#sudo puppet resource cron puppet-apply ensure=present user=root minute=30 command='/usr/bin/puppet apply $(puppet apply --configprint manifest)'