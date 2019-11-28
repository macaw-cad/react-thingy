export enum TypeKeys {
  SET_IS_HYDRATED = 'SET_IS_HYDRATED'
}

export interface SetIsHydrated {
    type: TypeKeys.SET_IS_HYDRATED;
    payload?: boolean;
}

export type ActionTypes =
  | SetIsHydrated;

export const setIsHydrated = (payload?: boolean): SetIsHydrated => ({ type: TypeKeys.SET_IS_HYDRATED, payload });