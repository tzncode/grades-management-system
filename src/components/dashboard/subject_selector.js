'use client';

import { FileText } from 'lucide-react';

export default function SubjectSelector({ subjects, onSelect }) {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay materias disponibles para este curso</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <button
          key={subject.id}
          onClick={() => onSelect(subject)}
          className="p-5 rounded-lg border-2 border-gray-200 bg-white
                     hover:border-green-500 hover:shadow-lg hover:scale-105
                     transition-all duration-200 text-left group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-500 transition-colors">
              <FileText className="w-5 h-5 text-green-600 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 group-hover:text-green-600">
                {subject.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Hoja: {subject.sheetName || subject.name}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}