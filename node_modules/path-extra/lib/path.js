var os = require('os')
var path = require('path')

var p = {}

Object.keys(path).forEach(function(key) {
  p[key] = path[key]
})

path = p

function Darwin () {
  this.tempdir = function () {
    return '/tmp'
  }

  this.homedir = function () {
    return process.env['HOME']
  }

  this.datadir = function (appname) {
    return this.homedir() + '/Library/Application Support/' + appname
  }
}

function Linux () {
  this.tempdir = function () {
    return '/tmp'
  }

  this.homedir = function () {
    return process.env['HOME']
  }

  this.datadir = function (appname) {
    return this.homedir() + '/.config/' + appname
  }
}

function FreeBSD () {
  this.tempdir = function () {
    return '/tmp'
  }

  this.homedir = function () {
    return process.env['HOME']
  }

  this.datadir = function (appname) {
    return this.homedir() + '/.config/' + appname
  }
}

function SunOS () {
  this.tempdir = function () {
    return '/tmp'
  }

  this.homedir = function () {
    return process.env['HOME']
  }

  this.datadir = function (appname) {
    return this.homedir() + '/.config/' + appname
  }
}

function Windows () {
  this.tempdir = function () {
    return process.env['TEMP']
  }

  this.homedir = function () {
    return process.env['USERPROFILE']
  }

  this.datadir = function (appname) {
    var appData = process.env['APPDATA']
    return appData + '\\' + appname
  }
}

var ost = os.type().toLowerCase()

var OSObj = null
if (ost.indexOf('lin') === 0) {
  OSObj = new Linux()
} else if (ost.indexOf('darwin') === 0) {
  OSObj = new Darwin()
} else if (ost.indexOf('freebsd') === 0) {
  OSObj = new FreeBSD()
} else if (ost.indexOf('win') === 0) {
  OSObj = new Windows()
} else if (ost.indexOf('sunos') === 0) {
  OSObj = new SunOS()
} else {
  throw new Error('Unsupported OS: ' + ost)
}

if (path.tempdir == null) {
  path.tempdir = OSObj.tempdir
}

if (path.homedir == null) {
  path.homedir = OSObj.homedir
}

if (path.datadir == null) {
  path.datadir = OSObj.datadir
}

module.exports = path
