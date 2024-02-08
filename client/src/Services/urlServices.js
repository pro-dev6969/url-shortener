import httpClient from "./httpClient"

import { getAuthUser } from "../util/useAuth"

export const createUrl = async payload => {
  try {
    const { data } = await httpClient.post("url", payload)
    return data
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error)
    return error
  }
}

export const getUrlsForUser = async () => {
  const userId = getAuthUser()?.id
  try {
    const { data } = await httpClient.get(`url/user/${userId}`)
    return data
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error)
    return error
  }
}

export const deleteUrlByUrlCode = async urlCode => {
  try {
    const { data } = await httpClient.delete(`url/${urlCode}`)
    return data
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error)
    return error
  }
}

export const updateUrlCode = async payload => {
  try {
    const { data } = await httpClient.put(`url/${payload.urlCode}`, payload)
    return data
  } catch (error) {
    //TODO error handling and showing error to UI
    console.log(error)
    return error
  }
}
