import { Course } from "@/types/course";
import { corporateFinanceCourse } from "./corporate-finance";
import { optionsDerivativesCourse } from "./options-derivatives";

const ADMIN_KEY = "studyapp-admin-data";

export const defaultCourses: Course[] = [
  corporateFinanceCourse,
  optionsDerivativesCourse,
];

/** Returns admin-managed courses if available, otherwise defaults */
export function getAllCourses(): Course[] {
  try {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.courses && Array.isArray(data.courses)) return data.courses;
    }
  } catch {}
  return defaultCourses;
}

/** Static reference for backwards compat — prefer getAllCourses() for live data */
export const allCourses = defaultCourses;

export function getCourseById(id: string): Course | undefined {
  return getAllCourses().find((c) => c.id === id);
}
