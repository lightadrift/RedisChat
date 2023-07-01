import {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function Chat() {
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
  let message1 = {
    type: "data_settings",
    data: "Lorem ipsum dolor sit amet, ellentesque posuere nulla vitae nibh cursus cursus. Cras vitae feugiat augue. Sed mollis libero at bib Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus elementum pulvinar arcu, et accumsan nibh ullamcorper nec. Donec ullamcorper nisi sed nisl commodo, nec accumsan ipsum interdum. Etiam eu auctor sapien. Maecenas gravida placerat bibendum. Duis gravida consectetur nibh quis sodales. Pellentesque posuere nulla vitae nibh cursus cursus. Cras vitae feugiat augue. Sed mollis libero at bibendum blandit. In ultricies vel nisi at consectetur. Fusce faucibus consequat risus ultricies finibus. Quisque efficitur porta tristique. Praesent tincidunt euismod massa id dictum. Praesent vitae bibendum quam. Praesent facilisis id nisi vel fermentum.",
  };
  let messageString = JSON.stringify(message1);
  const [ws, setWs] = useState<WebSocket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>();

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

  useEffectOnce(() => {
    const ws = new WebSocket("wss://redischat-production.up.railway.app");
    setWs(ws);
    return () => {
      ws.close();
    };
  });

  useEffect(() => {
    if (ws) {
      ws.onmessage = async function (event) {
        console.log("Data received from server: ", await event.data.text());
        const message = await event.data.text()
        setMessages((prevMessages) => [...prevMessages, message]);
      };
    } else {
      console.log("ws undefined");
    }
  }, [ws]);

  return (
    <>
      {/* <h1 onClick={() => ws?.send(messageString)} className="  text-blue-500 ">
        Chat
      </h1> */}

      <div className=" w-full min-h-[100vh] pt-10 font-lato flex flex-col">
        <h1
          onClick={() => ws?.send(messageString)}
          className="  text-blue-500 "
        >
          Chat
        </h1>
        <div className="bg-zinc-900 w-2/3 h-[55rem] ml-auto mr-auto rounded-2xl relative flex flex-col">
          <div className=" w-full h-[90%] overflow-scroll flex flex-col gap-6 p-8 overflow-x-hidden">
            {messages?.map((message, index) => {
              return (
                <div
                  key={index}
                  className=" text-white bg-lime-500 p-4 w-fit rounded-lg max-w-xl self-end"
                >
                  {" "}
                  {message}
                </div>
              );
            })}
          </div>
          <div className=" w-full relative h-1/5 items-center flex place-content-center ">
            <input
              onChange={(event) => debouncedHandleChange(event)}
              type="text"
              className=" p-2 w-[40%]  rounded-md border-1 border-gray-300"
            />
            <button
              onClick={() => {
                ws?.send(message!);
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
