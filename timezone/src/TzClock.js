import React, { Component } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css'
import 'semantic-ui-css/semantic.min.css'


function calculateTime(offset) {
  const currentTime = new Date();
  const currentOffset = currentTime.getTimezoneOffset()
  const offsetMilli = (currentOffset - offset) * 60 * 1000
  currentTime.setTime(currentTime.getTime() + offsetMilli);
  return currentTime;
}

export default class TzClock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: calculateTime(this.props.tz.offset),
        }
    };

    componentDidMount() {
        setInterval(() => {
          let d = calculateTime(this.props.tz.offset);
          this.setState({ date: d });
        }
        , 1000)
    }

    // componentWillUnmount() {
    //   this.abortController.abort();
    // }

    render() {

        //const gmt = (this.props.tz.timezone) ? this.props.tz.timezone.substring(this.props.tz.timezone.indexOf('(')) : '(GMT)';
        const gmt = this.props.tz.timezone;
        const id = this.props.tz._id;

        return (
          <div style={{border:'1px solid black', width:'300px'}}>
            <div style={{float:'right'}}><a onClick={() => this.props.rf(id)}><i className="trash icon"/></a></div>
            <p>{this.props.tz.city}</p>
            <div style={{paddingLeft:'70px'}}>
              <Clock
                value={this.state.date}
              />
            </div>
            <p style={{paddingTop:'20px'}}>{this.state.date.toLocaleString()} {gmt}</p>
          </div>
        );
    }

}
 