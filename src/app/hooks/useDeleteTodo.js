import axios from "axios";
import toast from "react-hot-toast";

export default function useDeleteTodo(setData) {
  const deleteTodo = async (todo) => {
    try {
      const todoId = todo.id; // Use the ID for deletion

      const response = await axios.delete("/api/deleteTodo", {
        data: { id: todoId }, // Send the ID as the identifier for deletion
      });

      if (response.status === 200) {
        setData((prevData) => prevData.filter((t) => t.id !== todoId));
        toast.success("Todo deleted successfully!");
      } else {
        toast.error("Failed to delete todo.");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo.");
    }
  };

  return { deleteTodo };
}

