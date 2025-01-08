import axios from "axios";
import toast from "react-hot-toast";

export default function useToggleTodo(setData) {
    const toggleTodo = async (todo) => {
        try {
          // Ensure completed is being toggled correctly
          const updatedTodo = { ...todo, completed: !todo.completed };
      
          const response = await axios.put("/api/toggleTodo", updatedTodo); // Make sure the endpoint is correct
      
          if (response.status === 200) {
            setData((prevData) =>
              prevData.map((t) => (t.id === todo.id ? updatedTodo : t))
            );
            toast.success("Todo updated successfully!");
          } else {
            toast.error("Failed to update todo.");
          }
        } catch (error) {
          console.error("Error updating todo:", error);
          toast.error("Failed to update todo.");
        }
      };
      

  return { toggleTodo };
}
