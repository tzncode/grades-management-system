/**
 * Parser para convertir datos de Google Sheets al formato de la aplicación
 */

/**
 * Parsear datos de estudiantes desde la hoja de cálculo
 */
export function parseStudentsData(rawData) {
  if (!rawData || rawData.length < 9) {
    return [];
  }

  // Fila 8 contiene los headers (índice 7)
  const headers = rawData[7];
  
  // Las filas de estudiantes empiezan en la fila 9 (índice 8)
  const studentRows = rawData.slice(8);
  
  const students = [];
  
  studentRows.forEach((row, index) => {
    // Si la fila está vacía o no tiene nombre, la saltamos
    if (!row[0] || !row[1]) return;
    
    const student = {
      id: index + 1,
      number: row[0],
      name: row[1],
      grades: {
        T1: parseTrimestreData(row, 1),
        T2: parseTrimestreData(row, 2),
        T3: parseTrimestreData(row, 3),
      },
      attendance: row[19] || '',
      finalGrade: row[20] || '',
      december: row[21] || '',
      february: row[22] || '',
    };
    
    students.push(student);
  });
  
  return students;
}

/**
 * Parsear datos de un trimestre específico
 */
function parseTrimestreData(row, trimester) {
  // Mapeo de columnas según el trimestre
  const columnMap = {
    1: { start: 2, end: 7 },   // Columnas C-H (índices 2-7)
    2: { start: 8, end: 13 },  // Columnas I-N (índices 8-13)
    3: { start: 14, end: 19 }, // Columnas O-T (índices 14-19)
  };
  
  const { start } = columnMap[trimester];
  
  return {
    NO: row[start] || '',
    N1: row[start + 1] || '',
    N2: row[start + 2] || '',
    INT: row[start + 3] || '',
    REC: row[start + 4] || '',
    NT: row[start + 5] || '',
  };
}

/**
 * Convertir datos de estudiantes al formato de Google Sheets
 */
export function formatDataForSheets(students, trimester) {
  const updates = [];
  
  students.forEach((student, index) => {
    const rowNumber = index + 9; // Las filas de estudiantes empiezan en 9
    const trimesterData = student.grades[`T${trimester}`];
    
    // Mapeo de columnas según el trimestre
    const columnMap = {
      1: 'C', // Trimestre 1 empieza en columna C
      2: 'I', // Trimestre 2 empieza en columna I
      3: 'O', // Trimestre 3 empieza en columna O
    };
    
    const startColumn = columnMap[trimester];
    
    // Crear array con los valores en el orden correcto
    const values = [
      trimesterData.NO || '',
      trimesterData.N1 || '',
      trimesterData.N2 || '',
      trimesterData.INT || '',
      trimesterData.REC || '',
      trimesterData.NT || '',
    ];
    
    updates.push({
      range: `${startColumn}${rowNumber}:${getEndColumn(startColumn, 5)}${rowNumber}`,
      values: [values],
    });
  });
  
  return updates;
}

/**
 * Calcular columna final basada en inicio y offset
 */
function getEndColumn(startColumn, offset) {
  const startCharCode = startColumn.charCodeAt(0);
  return String.fromCharCode(startCharCode + offset);
}

/**
 * Detectar estructura de columnas de notas desde headers
 */
export function detectGradeColumns(headers) {
  const gradeColumns = {
    1: [],
    2: [],
    3: [],
  };
  
  // Buscar patrones como NO, N1, N2, etc.
  const gradePattern = /^N\d+$/;
  
  headers.forEach((header, index) => {
    if (gradePattern.test(header) || header === 'NO') {
      // Determinar a qué trimestre pertenece basado en la posición
      if (index >= 2 && index < 8) {
        gradeColumns[1].push(header);
      } else if (index >= 8 && index < 14) {
        gradeColumns[2].push(header);
      } else if (index >= 14 && index < 20) {
        gradeColumns[3].push(header);
      }
    }
  });
  
  return gradeColumns;
}

/**
 * Validar que los datos sean correctos antes de guardar
 */
export function validateGradeData(grade) {
  if (grade === '' || grade === null || grade === undefined) {
    return true; // Valores vacíos son válidos
  }
  
  const numGrade = parseFloat(grade);
  
  // Validar que sea un número entre 0 y 10
  if (isNaN(numGrade) || numGrade < 0 || numGrade > 10) {
    return false;
  }
  
  return true;
}

/**
 * Calcular nota trimestral
 */
export function calculateNT(grades, gradeColumns) {
  const validGrades = [];
  
  // Agregar notas regulares (N1, N2, etc.)
  gradeColumns.forEach(col => {
    if (col !== 'NO' && grades[col]) {
      const grade = parseFloat(grades[col]);
      if (!isNaN(grade) && grade > 0) {
        validGrades.push(grade);
      }
    }
  });
  
  // Agregar nota integradora
  if (grades.INT) {
    const intGrade = parseFloat(grades.INT);
    if (!isNaN(intGrade) && intGrade > 0) {
      validGrades.push(intGrade);
    }
  }
  
  if (validGrades.length === 0) {
    return '';
  }
  
  const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
  return average.toFixed(2);
}