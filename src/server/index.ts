import { IReactronServiceDefinition } from '@schirkan/reactron-interfaces';
import { CalendarService } from './services/CalendarService';

// export interfaces
export * from '../common/interfaces/ICalendarService';
export * from '../common/interfaces/ICalendarServiceOptions';

// export reactron service definition
export const services: IReactronServiceDefinition[] = [{
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