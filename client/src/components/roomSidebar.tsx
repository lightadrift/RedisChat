import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuthStore } from "../store/loginStore";

interface Data {
  [country: string]: string[];
}

export default function Sidebar() {
  const { user_id } = useAuthStore();
  const [rooms, setRooms] = useState<string[] | null>([]);
  async function getRooms(): Promise<string[]> {
    const user_rooms = await axios.get("http://localhost:3001/api/rooms/getRooms", {
      params: {
        userID: user_id,
      },
    });
    return user_rooms.data.m;
  }
  useEffect(() => {
    async function get() {
      const r = await getRooms();
    //   setRooms(r);
    console.log(r)
    }
    get();
  }, []);
  return (
    <>
      <div>
        {rooms?.map((i) => {
          return <>a</>;
        })}
      </div>
    </>
  );
}
