import jwt_decode from "jwt-decode"

const useAuth = () => {
  let accessToken = localStorage.getItem("accessToken")

  if (!accessToken) return false
  if (accessToken) {
    const decoded = jwt_decode(accessToken)
    if (decoded.isLoggedIn) return true
  }

  return false
}

export const getAuthUser = () => {
  let accessToken = localStorage.getItem("accessToken")

  if (!accessToken) return null
  if (accessToken) {
    const decoded = jwt_decode(accessToken)
    if (decoded.isLoggedIn) return decoded
  }
  return null
}

export default useAuth
