import * as React from 'react';
import { later } from './later';

interface LaterTextProps {
    message: string;
}

interface LaterTextState {
    text: string;
}
export class LaterText extends React.Component<LaterTextProps, LaterTextState> {
    laterContext: any = undefined;

    constructor(props: LaterTextProps) {
      super(props);
      this.state = { text: props.message };
    }
  
    componentWillMount() {
      this.laterContext = later(1000, () => {
        this.setState({text: 'This is the later text after 1 second'});
        this.laterContext = undefined;
      });
    }

    componentWillUnmount() {
      if (this.laterContext) {
        this.laterContext.cancel();
      }
    }

    render() {
      return (
        <div>
          LaterText: {this.state.text}
        </div>
      );
    }
  }
