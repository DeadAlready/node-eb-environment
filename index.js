'use strict';

var fs = require('fs');

var testKeys = [
    'nodejs.env',
    'optionsettings.aws:elasticbeanstalk:application:environment'
];

function copy(arr) {
    if(!Array.isArray(arr)) {
        return;
    }
    arr.forEach(function (keyVal) {
        var i = keyVal.indexOf('=');
        var key = keyVal.substr(0, i);
        var val = keyVal.substr(i + 1);
        process.env[key] = val;
    });
    return true;
}

function look(obj, key) {
    var next;
    var lvl = key;
    var dotIndex = key.indexOf('.');
    if(dotIndex !== -1) {
        lvl = key.substr(0, dotIndex);
        next = key.substr(dotIndex + 1);
    }
    if(!obj[lvl]) {
        return;
    }
    if(next) {
        return look(obj[lvl], next);
    }
    return obj[lvl];
}

try {
    var json = fs.readFileSync('/opt/elasticbeanstalk/deploy/configuration/containerconfiguration');
    var envConf = JSON.parse(json);
    if (!envConf) {
        return;
    }

    testKeys.some(function (key) {
        var arr = look(envConf, key);
        if(arr) {
            return copy(arr);
        }
    });
} catch (e) {

}