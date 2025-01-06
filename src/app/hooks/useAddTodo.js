import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useAddTodo(setData){
     
 const [todo, setTodo] = useState("")
 
 const addTodo = async (e) => {
    e.preventDefault() 

    if (!todo.trim()) {
      toast.error("Please enter a todo.")
      return
    }

    try {
        const response = await axios.post("/api/addTodo", {todo})

      if (response.status === 200) {
        
        setTodo("")
        setData((prevData) => [...prevData, [todo]])
        toast.success("Todo added successfully!")
      } else {
        toast.success("Failed to add todo. Try again, please.")
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.success("Failed to add todo. Try again, please.")
    }
  }

  return {todo, setTodo, addTodo}
}