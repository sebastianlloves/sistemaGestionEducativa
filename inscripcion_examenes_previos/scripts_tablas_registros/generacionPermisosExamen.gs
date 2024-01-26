function generarPermisosExamen() {

  const archivo = SpreadsheetApp.getActiveSpreadsheet()
  const hoja = archivo.getActiveSheet()
  const nombre_hoja = hoja.getName()
  const datos_hoja = hoja.getRange(7,2, hoja.getLastRow() - 6, 10).getValues()
  
  
  // Ordena por fecha

  datos_hoja.sort( (fila_a, fila_b) => {
    const fecha_a = new Date(fila_a[0])
    fecha_a.setHours(fila_a[1].getHours(), fila_a[1].getMinutes())
    const fecha_b = new Date(fila_b[0])
    fecha_b.setHours(fila_b[1].getHours(), fila_b[1].getMinutes())
    if (fecha_a < fecha_b) return -1
    if (fecha_a > fecha_b) return 1
    else return 0
  })


  //  Procesa cada fila de la hoja, y genera el array de objetos alumnos con todas las propiedades cocinadas

  const alumnos_inscriptos = []
  
  datos_hoja.forEach( fila => {
    const [ fecha, hora, , ano, division, apellido, nombre, dni, ano_materia, materia] = fila
    let obj_alumno = alumnos_inscriptos.find( obj_alumno => obj_alumno.dni == dni)

    //  Conformación de dato fecha
    const fecha_inscripcion = new Date( fecha )
    fecha_inscripcion.setHours(hora.getHours(), hora.getMinutes())

    //  Si el alumno no fue procesado aún, lo crea. Si ya hay un objeto de ese alumno, le agrega la materia (si es que no la tiene). 
    if(!obj_alumno){
      obj_alumno = {dni, apellido, nombre, ano, division, [`${ano_materia}`]: [materia], varias_inscripciones: false, ult_actualizacion: fecha_inscripcion}
      alumnos_inscriptos.push(obj_alumno)
    } else if ( obj_alumno.hasOwnProperty(`${ano_materia}`)) {
      if(!obj_alumno[`${ano_materia}`].includes(materia)) obj_alumno[`${ano_materia}`].push(materia)
    }
    else obj_alumno[`${ano_materia}`] = [materia]

    //  Si corresponde, modifica testigo de última actualización.
    if(obj_alumno.ult_actualizacion < fecha_inscripcion) obj_alumno.varias_inscripciones = true, obj_alumno.ult_actualizacion = fecha_inscripcion

  })
  
  alumnos_inscriptos.forEach( obj_alumno => {
    archivo.toast(`Procesando alumno/a: ${obj_alumno.apellido}, ${obj_alumno.nombre}`, 'Proceso inconcluso...', -1)
    generarPDFs (obj_alumno, nombre_hoja)
  })
  
  archivo.toast(``, 'Proceso Terminado', -1)
    
}