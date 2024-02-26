import CourseList from "../components/CourseList";
import CourseDetail from "../components/CourseDetail";
import { useState } from "react";

export default function Courses() {
  const [courseId, setCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCover, setCourseCover] = useState<string | undefined | null>(
    null
  );
  return courseId && courseTitle ? (
    <CourseDetail
      id={courseId}
      title={courseTitle}
      cover={courseCover}
      setCourseId={setCourseId}
      setCourseTitle={setCourseTitle}
      setCourseCover={setCourseCover}
    />
  ) : (
    <CourseList
      setCourseId={setCourseId}
      setCourseTitle={setCourseTitle}
      setCourseCover={setCourseCover}
    />
  );
}
