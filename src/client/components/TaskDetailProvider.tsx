import { ReactNode, createContext, useContext, useState } from "react";
import TaskDetailModal from "./TaskDetailModal";
import { TaskInfo } from "../models/task_info";

const TaskInfoContext = createContext<any[]>([
  { taskId: 0, userTaskId: 0 },
  () => {},
]);
const TaskDetailModalContext = createContext<any[]>([false, () => {}]);

export function useTaskInfo() {
  return useContext(TaskInfoContext);
}

export function useTaskDetailModal() {
  return useContext(TaskDetailModalContext);
}

export default function TaskDetailProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [taskInfo, setTaskInfo] = useState<TaskInfo>();
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);

  return (
    <>
      {taskInfo && taskDetailModalOpen && (
        <TaskDetailModal
          taskId={taskInfo.taskId}
          userTaskId={taskInfo.userTaskId}
          setOpen={setTaskDetailModalOpen}
        />
      )}
      <TaskInfoContext.Provider value={[taskInfo, setTaskInfo]}>
        <TaskDetailModalContext.Provider
          value={[taskDetailModalOpen, setTaskDetailModalOpen]}
        >
          {children}
        </TaskDetailModalContext.Provider>
      </TaskInfoContext.Provider>
    </>
  );
}
