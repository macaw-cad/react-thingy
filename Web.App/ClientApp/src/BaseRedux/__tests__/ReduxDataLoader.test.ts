import { reduxDataLoader } from '../ReduxDataLoader';
import { ApplicationContextProviderType } from '../../ApplicationContext';
import { Environment } from '../../Environment';

describe('ReduxDataLoader', () => {
    beforeEach(() => {
        Object.defineProperty(Environment, 'isServer', {
            get: () => false
        });
    });

    it('should call dataLoader function', () => {
        // arrange
        const dataLoader = jest.fn();
        const applicationContext = {
            firstRun: false
        } as ApplicationContextProviderType;
        const dispatch = jest.fn();

        // act
        reduxDataLoader(dataLoader, applicationContext, dispatch, 'test');

        // assert
        expect(dataLoader).toHaveBeenCalledTimes(1);
    });

    it('should add dataLoader function to applicationContext on server', () => {
        // arrange
        const dataLoader = jest.fn();
        // @ts-ignore mock applicationContext
        const applicationContext = {
            firstRun: true,
            tasks: [],
            addTask: function (fn: Promise<() => void>): void { this.tasks.push(fn); }
        } as ApplicationContextProviderType;
        const dispatch = jest.fn();

        Object.defineProperty(Environment, 'isServer', {
            get: () => true
        });

        // act
        reduxDataLoader(dataLoader, applicationContext, dispatch, 'test');

        // assert
        expect(Environment.isServer).toBe(true);
        expect(applicationContext.tasks).toHaveLength(1);
    });
});