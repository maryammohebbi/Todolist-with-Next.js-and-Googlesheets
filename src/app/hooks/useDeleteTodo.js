import axios from "axios";
import toast from "react-hot-toast";

export default function useDeleteTodo(setData) {
  const deleteTodo = async (row) => {
    try {
      const todoToDelete = row[0]; // Assuming the todo text is in the first column

      const response = await axios.delete("/api/deleteTodo", {
        data: { todo: todoToDelete }, // `data` is used to send the body in DELETE requests
      });

      if (response.status === 200) {
        setData((prevData) => prevData.filter((r) => r[0] !== todoToDelete));
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
