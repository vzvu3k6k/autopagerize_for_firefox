var simpleStorage = require('sdk/simple-storage').storage

if (simpleStorage.settings) {
    // remove obsolete settings.
    var mysettings = JSON.parse(simpleStorage.settings)
    if (mysettings.loading_html || mysettings.error_html) {
        delete mysettings.loading_html
        delete mysettings.error_html
        simpleStorage.settings = JSON.stringify(mysettings)
    }
}
else {
    var defaultSettings = {
        // iframe can not load "self.data.url('')" on Firefox.
        // extension_path: self.data.url(''),
        display_message_bar: true,
        exclude_patterns: simpleStorage.exclude_patterns || ''
    }
    simpleStorage.settings = JSON.stringify(defaultSettings)
}

exports.settings = {
    get: function (key) {
        return this.getAll()[key]
    },
    getAll: function () {
        return JSON.parse(simpleStorage.settings)
    },
    set: function (key, newValue) {
        var settings = this.getAll()
        if (this.callbacks[key]) {
            this.callbacks[key].forEach(function (cb) {
                cb(key, newValue)
            })
        }
        settings[key] = newValue
        simpleStorage.settings = JSON.stringify(settings)
    },
    on: function (key, listener) {
        if (!this.callbacks[key]) {
            this.callbacks[key] = []
        }
        this.callbacks[key].push(listener)
    },
    callbacks: { }
}
