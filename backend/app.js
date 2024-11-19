const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morgan = require("morgan")

const userRouter = require("./routes/userRoutes")
const companyRouter = require("./routes/companyRoutes")
const globalErrorHandler = require("./controllers/errorController")

const app = express()

// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use((req, res, next) => {
  // console.log(process.env.NODE_ENV)

  next()
})

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
}
app.use(cors(corsOptions))

// routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRouter)

// global error handler
app.use(globalErrorHandler)

module.exports = app
