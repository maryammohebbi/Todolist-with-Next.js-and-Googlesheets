
import { getSheetsData } from "@/services/sheetsService"


export default async function Home() {

  const data = await getSheetsData()

  console.log("data:", data)


  return (
    <div className="flex flex-col items-center p-5">
      <form className="flex gap-4 border-2 border-slate-500 rounded-2xl p-5 max-w-sm lg:max-w-xl shadow-xl">
        <input className="p-4 w-[400px] border-2 border-slate-500 rounded-xl" placeholder="Write your new todo..."/>
        <button className="p-4 rounded-full bg-green-100 border-2 border-slate-600">Add</button>
      </form>
      
    </div>
  )
}
