function SELECCION_ALUMNOS(ano_materia, materia, instancia, n_tabla = 1) {

  // DATOS TABLA
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(instancia)
  const primer_fila = 7
  const primer_col = 2
  const cant_col = 10

  const inscripciones = hoja.getRange(primer_fila, primer_col, hoja.getLastRow() - primer_fila + 1, cant_col).getValues()
    .filter(fila => fila[8] === ano_materia && fila[9] === materia)

  if (inscripciones.length === 0) return n_tabla === 1 ? [['No hay alumnos inscriptos para la materia'], ['e instancia seleccionadas.']] : ''

  const salida = inscripciones.map(([, , , ano, div, apellido, nombre, dni, ,]) => [`${apellido}, ${nombre}`, , , , `${ano} ${div}`, dni])
    .sort((a, b) => a[0].localeCompare(b[0]))

  return n_tabla === 1 ? salida.slice(0, 30)
    : 
    salida.length > 30 ? salida.slice(30) : ''
}
