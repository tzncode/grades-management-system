'use client';

import { BookOpen } from 'lucide-react';

export default function CourseSelector({ courses, selectedCourse, onSelect }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay cursos disponibles</p>
        <p className="text-sm text-gray-400 mt-2">
          Contacta al administrador para configurar los cursos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <button
          key={course.id}
          onClick={() => onSelect(course)}
          className={`p-6 rounded-lg border-2 transition-all duration-200 text-left
            ${selectedCourse?.id === course.id
              ? 'border-blue-600 bg-blue-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
            }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              selectedCourse?.id === course.id
                ? 'bg-blue-600'
                : 'bg-blue-100'
            }`}>
              <BookOpen className={`w-6 h-6 ${
                selectedCourse?.id === course.id
                  ? 'text-white'
                  : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {course.subjects?.length || 0} materias
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}