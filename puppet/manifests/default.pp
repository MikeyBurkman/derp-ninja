
$as_vagrant   = 'sudo -u vagrant -H bash -l -c'

Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin']
}

# --- Memcached ----------------------------------------------------------------

#class { 'memcached': }

# --- Packages -----------------------------------------------------------------

package { 'curl':
  ensure => installed
}

package { 'git':
  ensure => latest
}

package { 'make':
  ensure => installed
}

package { 'automake':
  ensure => installed
}

package { 'mongodb': 
  ensure => latest
}

package { 'npm':
  ensure => latest
}


exec { "install_bower":
	command => "npm install -g bower",
	cwd => "/vagrant",
	logoutput => true,
	require => Package['npm']
}

exec { "install_gulp":
	command => "npm install -g gulp",
	cwd => "/vagrant",
	logoutput => true,
	require => Package['npm']
}

exec { "install_sass":
	# Note: Gem was installed because Puppet already requires Ruby
	command => "gem install sass --no-rdoc --no-ri",
	cwd => "/vagrant",
	logoutput => true
}

exec { "install_bower_deps":
	command => "bower install --config.interactive=false",
	cwd => "/vagrant",
	logoutput => true,
	user => 'vagrant', # This can't be run as root!
	require => [
		Exec['install_bower'],
		Package['git']
	]
}

exec { "install_gulp_deps":
	command => "npm install",
	cwd => "/vagrant",
	logoutput => true,
	require => Exec['install_gulp']
}
