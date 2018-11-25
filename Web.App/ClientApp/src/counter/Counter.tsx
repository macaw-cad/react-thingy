import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { later } from '../components/later';
import { ApplicationContextConsumerProps, ApplicationContextConsumerType, AsyncTaskContext, withApplicationContext, defaultApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { increment, decrement } from './CounterActions';
import { Dispatch, Action } from 'redux';

interface CounterStoreProps {
  value: number;
}

interface CounterStoreActions {
  onIncrement: () => void;
  onDecrement: () => void;
}

interface CounterProps {
}

type CounterAllProps = CounterProps & CounterStoreProps & CounterStoreActions & ApplicationContextConsumerProps;

class Counter extends React.Component<CounterAllProps> {
  static defaultProps = {
    applicationContext: defaultApplicationContext
  };

  asyncTaskContext: AsyncTaskContext;

  constructor(props: CounterAllProps) {
    super(props);

    this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;

    if (Environment.isServer) {
      props.applicationContext.addComponentDidRenderServerSideFunc(this.componentDidRenderServerSide.bind(this));
    } else {
      this.doIncrement(this.asyncTaskContext);
    }
  }
  
  // componentDidRenderServerSide() is registered in the constructor when the component is rendered at server-side.
  // Registered functions are invoked by Hypernova server-side rendering immediately after the render() of the
  // toplevel Hypernova component is finished and the whole component tree is ready.
  // If this function does async calls, register them using addTask from applicationContext so the final rendering of
  // the toplevel Hypernova component does execute after the async calls initiated from this function are completed.
  public componentDidRenderServerSide(applicationContext: ApplicationContextConsumerType) {
    this.doIncrement(applicationContext as AsyncTaskContext);
  }

  doIncrement(asyncTaskContext: AsyncTaskContext) {
    if (!!this.props.onIncrement) {
      const laterContext = later(1000, this.props.onIncrement);
      asyncTaskContext.addTask(laterContext.promise);
    }
  }

  render() {
    const { value, onIncrement, onDecrement } = this.props;
    return (
      <div>
        <p>
          Clicked: {value} times
        {' '}
          <button onClick={onIncrement}>
            +
        </button>
          {' '}
          <button onClick={onDecrement}>
            -
        </button>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
      value: state.counter.value
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
      onIncrement: () => dispatch(increment(1)),
      onDecrement: () => dispatch(decrement(1))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<CounterAllProps>(Counter));
