import User from "../models/UserModel"
import { compareHash, createHash } from "../util/hash"
import { generateResetToken } from "../middlewares/authToken"

export const createUser = async payload => {
  try {
    const user = await User.create({
      ...payload,
      password: createHash(payload.password)
    })
    return user
  } catch (error) {
    throw Error(error)
  }
}

export const loginUser = async payload => {
  try {
    const user = await User.findOne({ email: payload.email })
    if (!user) return false

    //compare the password
    const passwordMatch = compareHash(payload.password, user.password)
    if (!passwordMatch) return false

    return user
  } catch (error) {
    throw Error(error)
  }
}

export const handleForgotPassword = async email => {
  try {
    const user = await User.findOne({ email: email })
    //create a reset token
    const resetToken = generateResetToken(user)

    user.resetToken = resetToken
    await User.findOneAndUpdate({ email: email }, user)

    //send email with reset link to user
    console.log(
      "Reset link",
      `http://localhost:3000/reset-password?resetToken=${resetToken}`
    )
    return true
  } catch (error) {
    throw new Error(error)
  }
}

export const resetPassword = async (newPassword, email) => {
  try {
    const user = await User.findOne({ email: email })
    user.password = createHash(newPassword)
    user.resetToken = ""
    await User.findOneAndUpdate({ email: email }, user)
    return true
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserById = async id => {
  const user = await User.findById(id)
  if (!user) throw new Error("User does not exist")
  return {
    id: user.id,
    fullName: user.fullName,
    avatar: user.avatar,
    email: user.email
  }
}

export const updateUser = async (userId, payload) => {
  try {
    let data = await User.findById(userId)

    //editable column restriction
    const editableColumn = ["fullName", "avatar"]

    Object.keys(payload).forEach(key => {
      if (editableColumn.includes(key)) {
        data[key] = payload[key]
      }
    })

    const user = await User.findOneAndUpdate({ email: data.email }, data)

    return "updated"
  } catch (error) {
    console.log(error)
    Error(error)
  }
}
