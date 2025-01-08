import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetTodos(){
    const [data, setData] = useState([])
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("/api/getTodos");
      
            // Normalize the completed field to a boolean
            const normalizedData = response.data.data.map(todo => ({
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
      
    return {data, setData, loadingData}
}