import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
import { useAuthStore } from "../store/loginStore";
import { useNavigate } from "react-router-dom";
interface Props {
  username: null | string;
  password: null | string;
}

function Login() {
  const navigate = useNavigate();
  const {setAuth} = useAuthStore()
  const [InputData, setInputData] = useState<Props>({
    username: null,
    password: null,
  });

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { username, password } = InputData;
    console.log("aqui");
    const { data } = await axios.post(loginRoute, {
      username,
      password,
    });
    if(data.status === true) {
        setAuth(true, data.id)
        console.log('foi')
        navigate("/chat")
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
            <div className="font-bold flex place-content-center">
              <h1>Chat RealTime</h1>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              className=" placeholder:text-slate-500 bg-slate-300 rounded-md p-2"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className=" placeholder:text-slate-500 bg-slate-300 rounded-md p-2"
              onChange={(e) => handleChange(e)}
            />
            <div className=" flex w-full place-content-center">
              <button
                className="  text-slate-100 bg-blue-600 p-2 rounded-md "
                type="submit"
              >
                Login
              </button>
            </div>
            <span>
              Não tem uma conta ?{" "}
              <Link className="text-sky-400" to="/register">
                Cadastre-se
              </Link>
            </span>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login;
