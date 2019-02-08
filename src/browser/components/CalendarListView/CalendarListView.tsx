import { IReactronComponentContext, topicNames } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import * as React from 'react';
import { ICalendarService, ICalendarData, IAppointment } from 'src/common/interfaces/ICalendarService';

import './CalendarListView.scss';

interface ICalendarListViewProps {
  showHeader: boolean;
  headerText: string;
  url: string;
}

interface ICalendarListViewState {
  loading: boolean;
  data?: ICalendarData;
  error?: any;
}

export class CalendarListView extends React.Component<ICalendarListViewProps, ICalendarListViewState> {
  public context: IReactronComponentContext;

  constructor(props: ICalendarListViewProps) {
    super(props);
    this.state = { loading: false };
    this.loadData = this.loadData.bind(this);
  }

  public componentDidMount() {
    this.context.topics.subscribe(topicNames.refresh, this.loadData);
    this.loadData();
  }

  public componentWillUnmount() {
    this.context.topics.unsubscribe(topicNames.refresh, this.loadData);
  }

  public componentDidUpdate(prevProps: any) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.loadData();
    }
  }

  private async loadData() {
    const service = await this.context.getService<ICalendarService>('CalendarService');
    if (service) {
      this.setState({ loading: true });

      try {
        const data = await service.getCalendarEntries(this.props.url);
        this.setState({ data, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }
  }

  private renderAppointment(item: IAppointment) {
    return item.title;
  }

  private renderCalendar() {
    if (!this.state.data) {
      return null;
    }

    return (
      <div>
        {this.state.data.entries.map(x => this.renderAppointment(x))}
      </div>
    );
  }

  private renderHeader() {
    if (!this.props.showHeader) {
      return null;
    }
    return (
      <h2>
        {this.props.headerText}
        {(this.state.loading) && this.context.renderLoading(undefined, '1x', { display: 'inline-block', marginLeft: '8px' })}
      </h2>
    );
  }

  public render() {
    if (this.state.error) {
      return 'Error: ' + this.state.error;
    }

    if (!this.props.url) {
      return <div>No calendar URL specified!</div>;
    }

    return (
      <section className="CalendarListView">
        {this.renderHeader()}
        {this.renderCalendar()}
      </section>
    );
  }
}
