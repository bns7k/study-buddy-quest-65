import { Course } from "@/types/course";
import { corporateFinanceCourse } from "./corporate-finance";
import { optionsDerivativesCourse } from "./options-derivatives";

export const allCourses: Course[] = [
  corporateFinanceCourse,
  optionsDerivativesCourse,
];

export function getCourseById(id: string): Course | undefined {
  return allCourses.find((c) => c.id === id);
}
