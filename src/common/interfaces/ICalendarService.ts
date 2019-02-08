import { IReactronService } from "@schirkan/reactron-interfaces";

export interface IAppointment {
  title: string;
  body: string;
  location: string;
  start: number;
  end: number;
  allDay: boolean;
  participants: string[]; // TODO
}

export interface ICalendarData {
  entries: IAppointment[];
}

export interface ICalendarService extends IReactronService {
  getCalendarEntries(url: string): Promise<ICalendarData>;
}