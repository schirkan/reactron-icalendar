import { IReactronComponentDefinition } from '@schirkan/reactron-interfaces';
import { CalendarListView } from './components/CalendarListView/CalendarListView';

export * from './components/CalendarListView/CalendarListView';

export const components: IReactronComponentDefinition[] = [{
  component: CalendarListView,
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
  }]// TODO: Columns
}];