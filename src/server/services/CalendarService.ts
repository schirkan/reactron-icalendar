import { IReactronServiceContext } from '@schirkan/reactron-interfaces';
import * as request from 'request-promise-native';
import { ICalendarServiceOptions } from 'src/common/interfaces/ICalendarServiceOptions';
import { ICalendarService, ICalendarData } from 'src/common/interfaces/ICalendarService';
var ical = require('node-ical');

interface ICacheItem {
  timestamp: number;
  result: Promise<any>;
}

export class CalendarService implements ICalendarService {
  private options: ICalendarServiceOptions;
  private cache: { [url: string]: ICacheItem } = {};

  constructor(private context: IReactronServiceContext) { }

  public async setOptions(options: ICalendarServiceOptions): Promise<void> {
    this.options = options;
  }

  public async getOptions(): Promise<Readonly<ICalendarServiceOptions>> {
    return this.options;
  }

  async getCalendarEntries(url: string): Promise<ICalendarData> {
    return this.getOrCreate<ICalendarData>(url, async () => {
      const response = await this.getResponseInternal('get', url);
      return new Promise((resolve, reject) => {
        ical.parseICS(response, (err: any, data: any) => {
          if (err) {
            this.context.log.error(err);
            reject(err);
          } else {
            const result = CalendarService.mapToCalendar(data);
            resolve(result);
          }
        });
      });
    });
  }

  public static mapToCalendar(data: any): ICalendarData {
    return data; // TODO
  }

  private async getResponseInternal<TResponse>(method: 'get' | 'post', url: string,
    requestOptions?: request.RequestPromiseOptions): Promise<TResponse> {
    this.context.log.debug('fetch', url);
    requestOptions = { ...requestOptions, rejectUnauthorized: false, resolveWithFullResponse: true };

    try {
      let response: request.FullResponse | undefined;
      switch (method) {
        case "get":
          response = await request.get(url, requestOptions);
          break;
        case "post":
          requestOptions.headers!["Content-Type"] = "application/x-www-form-urlencoded";
          response = await request.post(url, requestOptions);
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
    } catch (error) {
      this.context.log.error(error);
      throw error;
    }
  }

  private async getOrCreate<TResponse>(key: string, creator: () => Promise<TResponse>): Promise<TResponse> {
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
    } else {
      this.context.log.debug('cache hit');
    }

    return this.cache[key].result;
  }
}