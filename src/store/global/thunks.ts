import { createAsyncThunk } from '@reduxjs/toolkit'
import { ContactFormValues } from 'components/ContactForm/ContactForm'
import { fetchPool, fetchPools, fetchTickets, sendContactForm } from './api'
import { setToast } from './reducer'

export const fetchPoolActions = createAsyncThunk(
  'global/fetchPool',
  async (poolId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetchPool(poolId)
      return response.data
    } catch (err) {
      dispatch(
        setToast({
          type: 'error',
          message: 'Niečo sa pokazilo. Prosím skúste to neskôr.',
        }),
      )
      return rejectWithValue(err.response)
    }
  },
)

export const initPageGlobalState = createAsyncThunk(
  'global/initState',
  async (_data, { rejectWithValue, dispatch }) => {
    try {
      const response = await Promise.all([fetchTickets(), fetchPools(1000000)])
      // TODO: https://inovaciebratislava.atlassian.net/browse/KUP-93
      const currentDateTime = new Date().getTime()
      const ticketsDisabled =
        currentDateTime >=
          1661119200000 /* Mon Aug 22 2022 00:00:00 GMT+0200 (Central European Summer Time) */ &&
        currentDateTime <=
          1672527600000 /* Sun Jan 01 2023 00:00:00 GMT+0100 (Central European Standard Time) */
      const ticketTypes = response[0].data.ticketTypes.map((ticketType) =>
        ticketsDisabled ? { ...ticketType, disabled: true } : ticketType,
      )
      return {
        ticketTypes,
        swimmingPools: response[1].data.swimmingPools,
      }
    } catch (err) {
      dispatch(
        setToast({
          type: 'error',
          message: 'Niečo sa pokazilo. Prosím skúste to neskôr.',
        }),
      )
      return rejectWithValue(err.response)
    }
  },
)
export const sendContactFormActions = createAsyncThunk(
  'global/sendContactForm',
  async (
    values: { formData: ContactFormValues; recaptchaToken: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const { status, data } = await sendContactForm({
        ...values.formData,
        recaptcha: values.recaptchaToken,
        agreement: true,
      })
      dispatch(
        setToast({
          type: 'success',
          message: 'Správa úspešne odoslaná',
        }),
      )
      return {
        status,
        data,
      }
    } catch (err) {
      if (err.response.status === 400) {
        dispatch(
          setToast({
            type: 'error',
            message:
              err.response.data.messages && err.response.data.messages.length > 0
                ? err.response.data.messages[0].message
                : 'Správu sa nepodarilo odoslať',
          }),
        )
        return rejectWithValue(err.response)
      }
      dispatch(
        setToast({
          type: 'error',
          message: 'Správu sa nepodarilo odoslať',
        }),
      )
      return rejectWithValue(err.response)
    }
  },
)
