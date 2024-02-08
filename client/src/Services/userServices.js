import httpClient from "./httpClient"

import { getAuthUser } from "../util/useAuth"

export const getUserById = async id => {
  const userId = id || getAuthUser()?.id
  try {
    const { data } = await httpClient.get(`user/${userId}`)
    return data
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error)
    return error
  }
}

export const updateUser = async payload => {
  try {
    const { data } = await httpClient.put(`user/${payload.id}`, payload)
    return data
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error)
    return error
  }
}
