"use client";
import { useEffect, useState} from "react"
import useAddTodo from "./hooks/useAddTodo"
import useDeleteTodo from "./hooks/useDeleteTodo"
import useToggleTodo from "./hooks/useToggleTodo";

export default function Home() {
  const [data, setData] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  
  const {addTodo, setTodo, todo} = useAddTodo(setData)
  const {deleteTodo} = useDeleteTodo(setData)
  const {toggleTodo} = useToggleTodo(setData)
  // Fetch existing todos from Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getTodos");
        if (!response.ok) {
          console.error("Failed to fetch data:", response.statusText);
          return;
        }
  
        const result = await response.json();
  
        // Normalize the completed field to a boolean
        const normalizedData = result.data.map(todo => ({
          ...todo,
          completed: todo.completed === "TRUE" ? true : false, // Ensure it's a boolean
        }));
  
        setData(normalizedData); // Update the state with normalized data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };
  
    fetchData();
  }, []);
  
  
 
  return (
    <div className="flex flex-col items-center p-5">
      <form
        onSubmit={addTodo}
        className="flex gap-4 border-2 border-slate-500 rounded-2xl p-5 max-w-sm lg:max-w-xl shadow-xl"
      >
        <input
          className="p-4 w-[400px] border-2 border-slate-500 rounded-xl"
          placeholder="Write your new todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          type="submit"
          className="p-4 rounded-full bg-green-100 border-2 border-slate-600"
        >
          Add
        </button>
      </form>

      <div className="mt-8 w-[385px] lg:w-[520px]">
        {loadingData ? (
          <p>Loading...</p>
        ) : (
          <ul className="mt-2 w-full">
            {data.map((todo, index) => (
              <li
                key={index}
                className="border-2 border-slate-500 rounded-2xl p-5 w-full shadow-xl mb-5"
              >
                <div className="flex gap-4 w-full">
                  <p className={`${todo.completed === true ? "line-through" : ""} w-[80%]`}>{todo.title}</p>
                  <div className="flex w-[20%] justify-between">
                    <button
                      onClick={() => deleteTodo(todo)}
                      className="border-2 border-red-500 rounded-full w-9 h-9"
                    >
                      D
                    </button>
                    <button 
                      onClick={()=>toggleTodo(todo)}
                      className="border-2 border-slate-500 rounded-full w-9 h-9">
                      E
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

        )}
      </div>
    </div>
  );
}
