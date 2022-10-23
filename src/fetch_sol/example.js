// スマコンを叩く例：このファイルは例
import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";
import artifact from "./abi/TodoList.json";

// スマコンのアドレスを定義
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export default function inqueryExample(){
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    // taskCount, tasks, createTask, toggleIsCompleted はスマコンで定義されている関数だとする
    const { taskCount, tasks, createTask, toggleIsCompleted } = contractWithSigner.functions
    const [taskCountValue, setTaskCountValue] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [tasksValue, setTasksValue] = useState([]);
  
    useEffect(() => {
      const getTasks = async () => {
        const _taskCount = await taskCount();
        setTaskCountValue(_taskCount);
        const _tasks = []
        for (let i = 1; i <= _taskCount; i++) {
          const _task = await tasks(i);
          _tasks.push({
            ..._task,
            id: i
          })
        }
        setTasksValue(_tasks);
      }
      getTasks();
    }, [])
  
    const updateTaskContent = (e) => setTaskContent(e.target.value);
    const requestCreateTask = async () => {
      if (taskContent === "") return;
      await createTask(taskContent);
    };
  
    return {
      taskCount: taskCountValue,
      tasks: tasksValue,
      updateTaskContent,
      requestCreateTask
    }
}
