import React, {
	createContext,
	useContext,
	useReducer,
	// type Dispatch,
	type PropsWithChildren,
} from 'react';

import CookieStorage from '@/utils/storagecookies';

import { AuthStateType, AuthActionType, AuthActionOpts, AuthContextProps } from './reducers/types';
import { authInitState, authReducer } from './reducers/auth';

// const GlobalContext = createContext<GlobalReducerProps>({
//   globalState,
//   setGlobalState: () => {
//     throw new Error('GlobalContext 未定义');
//   },
// });

const RootContext = createContext<AuthContextProps>({
	authState: authInitState,
	authDispatch: value => authInitState,
	// {
	// 	throw new Error('RootContext 未定义');
	// },
});

function RootProvider(props: PropsWithChildren<{}>) {
	const [authState, authDispatch] = useReducer(authReducer as any, authInitState as AuthStateType);

	return <RootContext.Provider value={{ authState, authDispatch }} {...props} />;
}

function useAuthContext() {
	return useContext(RootContext);
}

export { RootContext, RootProvider, useAuthContext };
