import {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuthStore } from "../store/loginStore";
import Sidebar from "./roomSidebar";
import { useNavigate } from "react-router-dom";
import style from "../styles/chat.module.css";
interface Messages {
  message: string;
  id: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user_id, isAuthenticated } = useAuthStore();

  const useEffectOnce = (effect: any) => {
    const effectFn = useRef(effect);
    const destroyFn = useRef<(() => void) | undefined>();
    const effectCalled = useRef(false);
    const rendered = useRef(false);
    const [, setVal] = useState(0);
    if (effectCalled.current) {
      rendered.current = true;
    }

    useEffect(() => {
      // only execute the effect first time around
      if (!effectCalled.current) {
        destroyFn.current = effectFn.current();
        effectCalled.current = true;
      }
      // this forces one render after the effect is run
      setVal((val) => val + 1);
      return () => {
        // if the component didn't render since the useEffect was called,
        // we know it's the dummy React cycle
        if (!rendered.current) {
          return;
        }
        // otherwise this is not a dummy destroy, so call the destroy function
        if (destroyFn.current) {
          destroyFn.current();
        }
      };
    }, []);
  };
  const [ws, setWs] = useState<WebSocket>();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [message, setMessage] = useState<string>();
  const data = {
    message: message,
    id: user_id,
  };
  const debounce = (
    func: (...args: any[]) => void,
    delay: number
  ): ((...args: any[]) => void) => {
    let timer: ReturnType<typeof setTimeout> | null;
    return (...args: any[]): void => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHandleChange = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      const m = event.target.value;
      setMessage(m);
    }, 350),
    []
  );

  useEffect(() => {
    console.log(message); // This will log the new value after state update
  }, [message]);

  // use wss for securite connections
  useEffectOnce(() => {
    const ws = new WebSocket("ws://localhost:3001");
    setWs(ws);
    return () => {
      ws.close();
    };
  });

  useEffect(() => {
    if (ws) {
      ws.onmessage = async function (event) {
        console.log("Data received from server: ", await event.data.text());
        const data = await event.data.text();
        const message = JSON.parse(data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };
    } else {
      console.log("ws undefined");
    }
  }, [ws]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return null;
  } else {
    return (
      <>
        <Sidebar />
        <div className=" w-full min-h-[100vh] pt-10 font-lato flex flex-col">
          <div className="bg-zinc-900 w-4/5 h-[55rem] ml-auto mr-auto rounded-xl relative flex flex-col">
            <div className={` w-full h-[90%] ${style.scroll} overflow-scroll flex flex-col gap-6 p-8 overflow-x-hidden`}>
              {messages?.map((m, index) => {
                if (m.id === user_id) {
                  return (
                    <div
                      key={index}
                      className=" text-black  text-lg font-medium bg-red-300 p-4 w-fit rounded-lg max-w-xl self-end"
                    >
                      {" "}
                      {m.message}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className=" text-black  text-lg font-medium bg-sky-300 p-4 w-fit rounded-lg max-w-xl self-start"
                    >
                      {" "}
                      {m.message}
                    </div>
                  );
                }
                // return (
                //   <div
                //     key={index}
                //     className=" text-black  text-lg font-medium bg-sky-300 p-4 w-fit rounded-lg max-w-xl self-end"
                //   >
                //     {" "}
                //     {m.message}
                //   </div>
                // );
              })}
            </div>
            <div className=" w-full relative h-1/5 items-center flex place-content-center ">
              <input
                onChange={(event) => debouncedHandleChange(event)}
                type="text"
                className=" p-2 w-[40%] bg-zinc-800  rounded-md border-1 border-gray-300"
              />
              <button
                onClick={() => {
                  ws?.send(JSON.stringify(data)!);
                }}
                className="text-white ml-2"
              >
                send
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
