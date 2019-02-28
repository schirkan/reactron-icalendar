'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var request = require('request-promise-native');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var ical = require('node-ical');
class CalendarService {
    constructor(context) {
        this.context = context;
        this.cache = {};
    }
    setOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.options = options;
        });
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options;
        });
    }
    getCalendarEntries(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getOrCreate(url, () => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.getResponseInternal('get', url);
                return new Promise((resolve, reject) => {
                    ical.parseICS(response, (err, data) => {
                        if (err) {
                            this.context.log.error(err);
                            reject(err);
                        }
                        else {
                            const result = CalendarService.mapToCalendar(data);
                            resolve(result);
                        }
                    });
                });
            }));
        });
    }
    static mapToCalendar(data) {
        return data; // TODO
    }
    getResponseInternal(method, url, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.log.debug('fetch', url);
            requestOptions = Object.assign({}, requestOptions, { rejectUnauthorized: false, resolveWithFullResponse: true });
            try {
                let response;
                switch (method) {
                    case "get":
                        response = yield request.get(url, requestOptions);
                        break;
                    case "post":
                        requestOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
                        response = yield request.post(url, requestOptions);
                        break;
                }
                if (!response) {
                    throw new Error('response is undefined');
                }
                if (response.statusCode !== 200) {
                    this.context.log.error(response.statusMessage, response.body);
                    throw new Error(response.statusMessage);
                }
                return response.body;
            }
            catch (error) {
                this.context.log.error(error);
                throw error;
            }
        });
    }
    getOrCreate(key, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);
            // check timestamp
            if (this.cache[key] && this.cache[key].timestamp < validCacheTime) {
                delete (this.cache[key]);
            }
            if (!this.cache[key]) {
                this.cache[key] = {
                    timestamp: now,
                    result: creator()
                };
            }
            else {
                this.context.log.debug('cache hit');
            }
            return this.cache[key].result;
        });
    }
}

// export reactron service definition
const services = [{
        name: 'CalendarService',
        description: 'CalendarService',
        displayName: 'CalendarService',
        service: CalendarService,
        fields: [{
                defaultValue: 5,
                description: 'Cache duration in minutes',
                displayName: 'Cache duration (min)',
                name: 'cacheDuration',
                valueType: 'number',
                minValue: 0,
                maxValue: 60,
                stepSize: 1
            }],
    }];

exports.services = services;
//# sourceMappingURL=bundle.server.js.map
