
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

package { 'node':
  ensure => latest
}

package { 'mongodb': 
  ensure => latest
}

package { 'npm':
  ensure => latest
}

# sudo npm install -g gulp
# sudo gem install sass
# npm install
# gulp serve
# Still get an error