import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import { later } from '../sample/later';
import { ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { increment, decrement } from './CounterActions';

export const Counter = () => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();
    const value = useSelector((state: RootState) => state.counter.value);
    const isHydrated = useSelector((state: RootState) => state.page.isHydrated);

    const onIncrement = () => dispatch(increment(1));
    const onDecrement = () => dispatch(decrement(1));

    // componentDidRenderServerSide() is registered in the constructor when the component is rendered at server-side.
    // Registered functions are invoked by Hypernova server-side rendering immediately after the render() of the
    // toplevel Hypernova component is finished and the whole component tree is ready.
    // If this function does async calls, register them using addTask from applicationContext so the final rendering of
    // the toplevel Hypernova component does execute after the async calls initiated from this function are completed.
    const componentDidRenderServerSide = (): void => {
        doIncrement();
    };

    const doIncrement = (): void => {
        const laterContext = later(1000, onIncrement);
        applicationContext.addTask(laterContext.promise);
    };

    if (Environment.isServer) {
        applicationContext.addComponentDidRenderServerSideFunc(componentDidRenderServerSide);
    }

    useEffect(() => {
        if (!isHydrated) {
            doIncrement();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
};

export default Counter;