System.register(['@schirkan/reactron-interfaces', 'react'], function (exports, module) {
    'use strict';
    var topicNames, Component, createElement;
    return {
        setters: [function (module) {
            topicNames = module.topicNames;
        }, function (module) {
            Component = module.Component;
            createElement = module.createElement;
        }],
        execute: function () {

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

            function styleInject(css, ref) {
              if ( ref === void 0 ) ref = {};
              var insertAt = ref.insertAt;

              if (!css || typeof document === 'undefined') { return; }

              var head = document.head || document.getElementsByTagName('head')[0];
              var style = document.createElement('style');
              style.type = 'text/css';

              if (insertAt === 'top') {
                if (head.firstChild) {
                  head.insertBefore(style, head.firstChild);
                } else {
                  head.appendChild(style);
                }
              } else {
                head.appendChild(style);
              }

              if (style.styleSheet) {
                style.styleSheet.cssText = css;
              } else {
                style.appendChild(document.createTextNode(css));
              }
            }

            var css = "";
            styleInject(css);

            class CalendarListView$1 extends Component {
                constructor(props) {
                    super(props);
                    this.state = { loading: false };
                    this.loadData = this.loadData.bind(this);
                }
                componentDidMount() {
                    this.context.topics.subscribe(topicNames.refresh, this.loadData);
                    this.loadData();
                }
                componentWillUnmount() {
                    this.context.topics.unsubscribe(topicNames.refresh, this.loadData);
                }
                componentDidUpdate(prevProps) {
                    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
                        this.loadData();
                    }
                }
                loadData() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const service = yield this.context.getService('CalendarService');
                        if (service) {
                            this.setState({ loading: true });
                            try {
                                const data = yield service.getCalendarEntries(this.props.url);
                                this.setState({ data, loading: false });
                            }
                            catch (error) {
                                this.setState({ error, loading: false });
                            }
                        }
                    });
                }
                renderAppointment(item) {
                    return item.title;
                }
                renderCalendar() {
                    if (!this.state.data) {
                        return null;
                    }
                    return (createElement("div", null, this.state.data.entries.map(x => this.renderAppointment(x))));
                }
                renderHeader() {
                    if (!this.props.showHeader) {
                        return null;
                    }
                    return (createElement("h2", null,
                        this.props.headerText,
                        (this.state.loading) && this.context.renderLoading(undefined, '1x', { display: 'inline-block', marginLeft: '8px' })));
                }
                render() {
                    if (this.state.error) {
                        return 'Error: ' + this.state.error;
                    }
                    if (!this.props.url) {
                        return createElement("div", null, "No calendar URL specified!");
                    }
                    return (createElement("section", { className: "CalendarListView" },
                        this.renderHeader(),
                        this.renderCalendar()));
                }
            } exports('CalendarListView', CalendarListView$1);

            const components = exports('components', [{
                    component: CalendarListView$1,
                    name: 'DepartureMonitor',
                    description: 'Public Transport Departure Monitor',
                    displayName: 'Public Transport Departure Monitor',
                    fields: [{
                            displayName: 'iCal URL',
                            name: 'url',
                            valueType: 'string',
                        }, {
                            displayName: 'Header text',
                            name: 'headerText',
                            valueType: 'string',
                            defaultValue: 'Calendar',
                        }, {
                            displayName: 'Show header',
                            name: 'showHeader',
                            valueType: 'boolean',
                            defaultValue: true,
                        }] // TODO: Columns
                }]);

        }
    };
});
//# sourceMappingURL=bundle.browser.js.map
