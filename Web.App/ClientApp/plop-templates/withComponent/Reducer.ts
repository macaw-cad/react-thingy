import { {{name}}State } from './{{name}}State';
import { Action } from 'redux';
import { {{name}}ActionTypes, TypeKeys } from './{{name}}Actions';

const initialState: {{name}}State = {
    {{camelCase name}}: {
        loading: false
    }
};

export function {{camelCase name}}Reducer(state: {{name}}State = initialState, action: {{name}}ActionTypes): {{name}}State {
    switch (action.type) {
        case TypeKeys.SET_LOADER_{{constantCase name}}:
            return { ...state, {{camelCase name}}: { loading: true } };
        case TypeKeys.SET_{{constantCase name}}:
            return { ...state, {{camelCase name}}: { data: action.data, loading: false } };
        default:
            return state;
    }
}