import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLoading } from "@/redux/authSlice"
import { Loader } from "lucide-react"

import logoImg from "../../assets/logoLightBG.png"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.auth)

  const [formInputs, setFormInputs] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    role: "jobSeeker",
    file: "",
  })

  const changeEventHandler = e => {
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value })
  }
  const handleValueChange = value => {
    setFormInputs({ ...formInputs, ["role"]: value })
  }

  const changeFileHandler = e => {
    setFormInputs({ ...formInputs, file: e.target.files?.[0] })
  }

  const formSubmitHandler = async e => {
    e.preventDefault()

    const formData = prepareFormData(formInputs)

    try {
      dispatch(setLoading(true))

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )

      if (response.status === 201) {
        navigate("/")
        toast.success(response.data.message)
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="flex items-center justify-around h-screen w-full text-darkBlue bg-aliceBlue">
      <div className="w-1/3 flex justify-center items-center ">
        <img src={logoImg} alt="logo-image" />
      </div>

      <form
        onSubmit={formSubmitHandler}
        className="w-1/3 border border-gray-200 rounded-md p-4 my-10 mr-4 shadow-lg bg-primary-foreground"
      >
        <h1 className="font-bold text-3xl mb-7 text-center">Register</h1>
        <div className="my-3">
          <Label>
            Full Name
            <Input
              type="text"
              value={formInputs.fullName}
              name="fullName"
              onChange={changeEventHandler}
              placeholder="John Doe"
            />
          </Label>
        </div>

        <div className="my-3">
          <Label>
            Email Address
            <Input
              type="email"
              value={formInputs.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@email.com"
            />
          </Label>
        </div>

        <div className="my-3">
          <Label>
            Password
            <Input
              type="password"
              value={formInputs.password}
              name="password"
              onChange={changeEventHandler}
            />
          </Label>
        </div>

        <div className="my-3">
          <Label>
            Confirm Password
            <Input
              type="password"
              value={formInputs.passwordConfirm}
              name="passwordConfirm"
              onChange={changeEventHandler}
            />
          </Label>
        </div>

        <div className="my-3">
          <Label>
            Phone Number
            <Input
              type="number"
              value={formInputs.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="9876543210"
            />
          </Label>
        </div>

        <div className="flex items-start justify-between my-3">
          <div>
            <Label>Select your role:</Label>
            <RadioGroup
              name="role"
              className="m-3 flex flex-col items-start px-8 "
              value={formInputs.role}
              onValueChange={handleValueChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jobSeeker" id="jobSeeker" />
                <Label htmlFor="jobSeeker" className="cursor-pointer">
                  Job Seeker
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter" className="cursor-pointer">
                  Recruiter
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer">
                  Admin
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 my-3">
            <Label htmlFor="picture">Profile Picture</Label>
            <Input
              accept="image/*"
              id="picture"
              type="file"
              className="cursor-pointer"
              name="file"
              onChange={changeFileHandler}
            />
          </div>
        </div>

        {loading ? (
          <Button disabled className="w-full mb-4">
            <Loader className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full mb-4 bg-darkBlue">
            Register
          </Button>
        )}

        <span className="text-sm">
          Already have an account?{"  "}
          <Link to="/login" className="text-skyBlue">
            Login
          </Link>
        </span>
      </form>
    </div>
  )
}

// helper function
function prepareFormData(formInputs) {
  let formData = new FormData()

  Object.keys(formInputs).forEach(el => {
    formData.append(el, formInputs[el])
  })

  return formData
}

export default Register
