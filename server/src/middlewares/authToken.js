import jwt from "jsonwebtoken"

import { JWT_SECRET } from "../util"

import User from "../models/UserModel"

//generate access token

const generateAccessToken = user => {
  return jwt.sign(
    {
      email: user.email,
      isLoggedIn: true,
      id: user.id
    },
    JWT_SECRET,
    {
      expiresIn: "10s"
    }
  )
}
export const generateResetToken = user => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id
    },
    JWT_SECRET,
    {
      expiresIn: "24h"
    }
  )
}
export const generateRefreshToken = async user => {
  const token = jwt.sign(
    {
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: "1d"
    }
  )
  user.refreshToken = token
  await User.findOneAndUpdate({ email: user.email }, user)

  return token
}

export const veryResetToken = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        resolve(false)
      } else {
        try {
          resolve(decoded.email)
        } catch (error) {
          resolve(false)
        }
      }
    })
  })
}

export const getAuthToken = async (req, res) => {
  const user = req["user"]
  const accessToken = generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user)
  res
    .status(200)
    .json({ email: user.email, accessToken, refreshToken, isLoggedIn: true })
}

// Define a middleware function to check jwt
export const verifyAccessToken = async (req, res, next) => {
  // Get the token from the request header
  var token = req.headers["authorization"]?.replace("Bearer ", "") || ""
  // If no token, send an error response
  if (!token) {
    return res.status(401).send({ message: "No token provided" })
  }
  // Verify the token using a secret key
  jwt.verify(token, JWT_SECRET, async function(err, decoded) {
    // If verification fails, send an error response
    if (err) {
      return res.status(401).send({ message: "Invalid token" })
    }
    // If verification succeeds, pass the decoded data to the next middleware
    try {
      const user = await User.findOne({ email: decoded.email })
      req["user"] = user
      next()
    } catch (error) {
      return res.status(401).send({ message: "Invalid user" })
    }
  })
}

export const handleRefreshToken = async (req, res, next) => {
  const refresh_token = req.headers["refresh_token"] || ""
  if (!refresh_token) {
    return res.status(401).send({ message: "Invalid refresh token" })
  }

  //verify the refresh token
  try {
    const decodedRefreshToken = jwt.verify(refresh_token, JWT_SECRET)

    if (!decodedRefreshToken) {
      return res.status(401).send({ message: "Invalid refresh token" })
    }

    //check the refreshToken exist in user
    const user = await User.findOne({ email: decodedRefreshToken.email })
    if (user.refreshToken !== refresh_token) {
      return res.status(401).send({ message: "Invalid refresh token" })
    }

    // generate access token
    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)

    return res.status(200).json({
      accessToken,
      refreshToken
    })
  } catch (error) {
    return res.status(401).send({ message: error })
  }
}
