import * as React from 'react';
import { later } from './later';

interface LaterTextProps {
    message: string;
}

interface LaterTextState {
    text: string;
}
export class LaterText extends React.Component<LaterTextProps, LaterTextState> {
    private laterContext: any = undefined;

    constructor(props: LaterTextProps) {
      super(props);
      this.state = { text: props.message };
    }
  
    public componentWillMount(): void {
      this.laterContext = later(1000, () => {
        this.setState({text: 'This is the later text after 1 second'});
        this.laterContext = undefined;
      });
    }

    public componentWillUnmount(): void {
      if (this.laterContext) {
        this.laterContext.cancel();
      }
    }

    public render(): React.ReactNode {
      return (
        <div>
          LaterText: {this.state.text}
        </div>
      );
    }
  }
