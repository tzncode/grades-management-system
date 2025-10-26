/**
 * Utilidades para cálculos de notas
 */

/**
 * Calcular promedio de notas
 */
export function calculateAverage(grades) {
  const validGrades = grades.filter(g => {
    const num = parseFloat(g);
    return !isNaN(num) && num > 0;
  });

  if (validGrades.length === 0) return 0;

  const sum = validGrades.reduce((acc, g) => acc + parseFloat(g), 0);
  return sum / validGrades.length;
}

/**
 * Calcular nota trimestral (NT)
 */
export function calculateTrimesterGrade(grades, columns) {
  const allGrades = [];

  // Agregar notas regulares
  columns.forEach(col => {
    if (col !== 'NO' && grades[col]) {
      const grade = parseFloat(grades[col]);
      if (!isNaN(grade) && grade > 0) {
        allGrades.push(grade);
      }
    }
  });

  // Agregar nota integradora
  if (grades.INT) {
    const intGrade = parseFloat(grades.INT);
    if (!isNaN(intGrade) && intGrade > 0) {
      allGrades.push(intGrade);
    }
  }

  if (allGrades.length === 0) return '';

  const average = calculateAverage(allGrades);
  return average.toFixed(2);
}

/**
 * Calcular nota final anual
 */
export function calculateFinalGrade(t1, t2, t3) {
  const grades = [t1, t2, t3]
    .map(g => parseFloat(g))
    .filter(g => !isNaN(g) && g > 0);

  if (grades.length === 0) return '';

  const average = calculateAverage(grades);
  return average.toFixed(2);
}

/**
 * Validar que una nota esté en el rango correcto
 */
export function validateGrade(grade) {
  if (grade === '' || grade === null || grade === undefined) {
    return { valid: true, message: '' };
  }

  const num = parseFloat(grade);

  if (isNaN(num)) {
    return { valid: false, message: 'Debe ser un número válido' };
  }

  if (num < 0 || num > 10) {
    return { valid: false, message: 'La nota debe estar entre 0 y 10' };
  }

  return { valid: true, message: '' };
}

/**
 * Formatear nota para mostrar (2 decimales)
 */
export function formatGrade(grade) {
  if (!grade || grade === '') return '-';
  
  const num = parseFloat(grade);
  if (isNaN(num)) return '-';
  
  return num.toFixed(2);
}

/**
 * Determinar si un estudiante está aprobado
 */
export function isApproved(grade, minGrade = 6.0) {
  const num = parseFloat(grade);
  if (isNaN(num)) return false;
  return num >= minGrade;
}

/**
 * Obtener estadísticas de un conjunto de notas
 */
export function getGradeStatistics(grades) {
  const validGrades = grades
    .map(g => parseFloat(g))
    .filter(g => !isNaN(g) && g > 0);

  if (validGrades.length === 0) {
    return {
      count: 0,
      average: 0,
      min: 0,
      max: 0,
      approved: 0,
      failed: 0,
    };
  }

  const average = calculateAverage(validGrades);
  const min = Math.min(...validGrades);
  const max = Math.max(...validGrades);
  const approved = validGrades.filter(g => g >= 6).length;
  const failed = validGrades.filter(g => g < 6).length;

  return {
    count: validGrades.length,
    average: average.toFixed(2),
    min: min.toFixed(2),
    max: max.toFixed(2),
    approved,
    failed,
  };
}