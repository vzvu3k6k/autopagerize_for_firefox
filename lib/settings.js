var simpleStorage = require('sdk/simple-storage').storage

if (simpleStorage.settings) {
    // previously simpleStorage.settings was JSON string.
    if (typeof simpleStorage.settings == 'String') {
        var mysettings = JSON.parse(simpleStorage.settings)

        // remove obsolete settings.
        if (mysettings.loading_html || mysettings.error_html) {
            delete mysettings.loading_html
            delete mysettings.error_html
        }
        simpleStorage.settings = mysettings
    }
}
else {
    var defaultSettings = {
        // iframe can not load "self.data.url('')" on Firefox.
        // extension_path: self.data.url(''),
        display_message_bar: true,
        exclude_patterns: simpleStorage.exclude_patterns || ''
    }
    simpleStorage.settings = defaultSettings
}

exports.settings = {
    get: function (key) {
        return simpleStorage.settings[key]
    },
    getAll: function () {
        return JSON.parse(JSON.stringify(simpleStorage.settings))
    },
    set: function (key, newValue) {
        if (this.callbacks[key]) {
            this.callbacks[key].forEach(function (cb) {
                cb(key, newValue)
            })
        }
        simpleStorage.settings[key] = newValue
    },
    on: function (key, listener) {
        if (!this.callbacks[key]) {
            this.callbacks[key] = []
        }
        this.callbacks[key].push(listener)
    },
    callbacks: { }
}
