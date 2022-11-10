import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { passAuthRoute, registerRoute } from "../utils/APIRoutes";

interface Props {
  username: null | string;
  email: null | string;
  password: null | string;
  confirmPassword: null | string;
}

function Register() {
  const [InputData, setInputData] = useState<Props>({
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { username, email, password, confirmPassword } = InputData;
    console.log("aqui");
    const { data } = await axios.post(registerRoute, {
      username,
      email,
      password,
      confirmPassword,
    });
    if (data.status === false) {
      console.log("não foi");
    }
    if (data.status === true) {
      console.log("foi");
    }
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputData({
      ...InputData,
      [event.target.name]: event.target.value,
    });
    console.log(InputData);
  }

  return (
    <>
      <section className=" flex relative justify-center items-center w-full h-[100vh]">
        <div className=" relative bg-slate-50 w-full max-w-md flex rounded-md place-content-center">
          <form
            className="flex flex-col gap-y-6 p-5"
            action=""
            onSubmit={(event) => {
              handleSubmit(event);
            }}
          >
            <div className="font-bold text-lg flex place-content-center">
              <h1>Chat RealTime</h1>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              className=" placeholder:text-slate-500 bg-slate-300 rounded-md p-2 font-bold"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className=" placeholder:text-slate-500 bg-slate-300 rounded-md p-2 font-bold"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className=" placeholder:text-slate-500 bg-slate-300 rounded-md p-2 font-bold"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              className=" placeholder:text-slate-500 bg-slate-300 rounded-md p-2 font-bold"
              onChange={(e) => handleChange(e)}
            />
            <div className=" flex w-full place-content-center">
              <button
                className="  text-slate-100 bg-slate-700 p-2 rounded-md font-semibold hover:scale-110"
                type="submit"
              >
                Create User
              </button>
            </div>
            <span className=" font-medium tracking-tight">
              Already have an account ?{" "}
              <Link className="text-sky-400 hover:cursor-pointer" to="/login">
                Login.
              </Link>
            </span>
          </form>
        </div>
      </section>
    </>
  );
}

export default Register;
