import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import { globalReducer } from './global'
import { orderReducer } from './order'

export const history = createBrowserHistory()

const middleware = [routerMiddleware(history), ...getDefaultMiddleware()] as const

export const store = configureStore({
  reducer: {
    router: connectRouter(history),
    order: orderReducer,
    global: globalReducer,
  },
  middleware,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
