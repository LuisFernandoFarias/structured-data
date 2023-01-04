import { renderHook } from '@testing-library/react-hooks'
import { MockedProvider } from '@apollo/react-testing'
import React from 'react'

import useAppSettings from '../hooks/useAppSettings'
import GET_SETTINGS from '../queries/getSettings.graphql'

const mockQueryData = {
  request: {
    query: GET_SETTINGS,
  },
  result: {
    data: {
      appSettings: {
        message: '{"decimals": 2, "pricesWithTax": true, "pricesHidden": true}',
      },
    },
  },
}

const mockQueryDataNull = {
  request: {
    query: GET_SETTINGS,
  },
  result: {
    data: {
      appSettings: {
        message:
          '{"decimals": null, "pricesWithTax": null, "pricesHidden": null}',
      },
    },
  },
}

function getHookWrapper(mocks = []) {
  const wrapper = ({ children }) => (
    <MockedProvider addTypename={false} mocks={mocks}>
      {children}
    </MockedProvider>
  )

  const { result, waitForNextUpdate } = renderHook(() => useAppSettings(), {
    wrapper,
  })

  return { result, waitForNextUpdate }
}

test('should return object', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mockQueryData])

  await waitForNextUpdate()

  expect(result.current.decimals).toBe(2)
  expect(result.current.pricesWithTax).toBe(true)
  expect(result.current.pricesHidden).toBe(true)
})

test('should return default object', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mockQueryDataNull])

  await waitForNextUpdate()

  expect(result.current.decimals).toBe(2)
  expect(result.current.pricesWithTax).toBe(false)
  expect(result.current.pricesHidden).toBe(false)
})
