import CourseList from "../components/CourseList";
import CourseDetail from "../components/CourseDetail";
import { useState } from "react";
import { SWRConfig } from "swr";

export default function Courses() {
  const [courseId, setCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCover, setCourseCover] = useState<string | undefined | null>(
    null
  );
  return courseId && courseTitle ? (
    <SWRConfig value={{ refreshInterval: 3000 }}>
      <CourseDetail
        id={courseId}
        title={courseTitle}
        cover={courseCover}
        setCourseId={setCourseId}
        setCourseTitle={setCourseTitle}
        setCourseCover={setCourseCover}
      />
    </SWRConfig>
  ) : (
    <CourseList
      setCourseId={setCourseId}
      setCourseTitle={setCourseTitle}
      setCourseCover={setCourseCover}
    />
  );
}
