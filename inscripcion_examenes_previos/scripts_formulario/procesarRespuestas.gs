function procesarRespuestas() {

  //    <<<<<<<<<   Genera el objeto de la respuesta    >>>>>>>>>>>>>>

  const respuestas = FormApp.getActiveForm().getResponses()
  const ult_respuesta = respuestas[respuestas.length - 1].getItemResponses()
  const obj_respuesta = {
    correo: respuestas[respuestas.length - 1].getRespondentEmail(),
    fecha: `${respuestas[respuestas.length - 1].getTimestamp().getDate()}/${respuestas[respuestas.length - 1].getTimestamp().getMonth() + 1}/${respuestas[respuestas.length - 1].getTimestamp().getFullYear().toString().slice(-2)}`,
    hora: `${respuestas[respuestas.length - 1].getTimestamp().toTimeString().split(":")[0]}:${respuestas[respuestas.length - 1].getTimestamp().toTimeString().split(":")[1]}`,
    dni: Number(ult_respuesta.find(item => item.getItem().getType() === FormApp.ItemType.TEXT).getResponse())
  }


  //    <<<<<<<<<   Se conecta con base de datos y corrobora si el DNI está registrado    >>>>>>>>>>>>>>

  const base_datos = SpreadsheetApp.openById("1nH8PdhKffqrAl1uguUp3TT444hBY1zckfoCL8P4vplI").getSheetByName("Alumnos Regulares").getDataRange().getValues()               //    DATO SENSIBLE !!!

  try {
    const [, ano, division, apellido, nombre, dni] = base_datos.find(([, , , , , dni]) => dni === obj_respuesta.dni)
    const alumno = { ano, division, apellido, nombre, dni }
    const insc_materias = ult_respuesta.filter(item => item.getItem().getType() === FormApp.ItemType.CHECKBOX && item.getResponse().length > 0 && Number(item.getItem().getTitle().split("Seleccionar la/s materia/s de ")[1].split("º")[0]) < Number(alumno.ano.split("º")[0]))
    Logger.log(alumno)
    Logger.log(insc_materias)
    if (insc_materias.length === 0) throw new Error('Inscripción de materias de curso actual')

    insc_materias.forEach(item => obj_respuesta[item.getItem().getTitle().split("Seleccionar la/s materia/s de ")[1]] = item.getResponse())
    
    registrarEnTabla({...obj_respuesta, ...alumno})
    
    enviarMail({...obj_respuesta, ...alumno}, true)
  }
  catch (error) {
    Logger.log(error.stack)
    enviarMail({...obj_respuesta}, false, error.message)
  }



  /*   ult_respuesta.forEach(item => {
      if (item.getItem().getType() === FormApp.ItemType.CHECKBOX && item.getResponse().length > 0) {
        obj_respuesta[item.getItem().getTitle().split("Seleccionar la/s materia/s de ")[1]] = item.getResponse()
      }
      if (item.getItem().getType() === FormApp.ItemType.TEXT) {
        obj_respuesta['DNI'] = item.getResponse()
      }
    }) */

  /* const prop_obj = Object.keys(obj_respuesta).filter( key => key.split(" ")[0] !== ano) */
  Logger.log(obj_respuesta)

  /*   const listado_alumnos = base_datos.map( fila => {
      return {ano: fila[1], division: fila[2], apellido:fila[3], nombre:fila[4], dni:fila[5]}
    }).filter( objeto => objeto.dni != 'DNI' && objeto.dni != '')   // Quita encabezados
  
    const alumno = listado_alumnos.find( obj_alumno => obj_alumno.dni == obj_respuesta['DNI'])                            // Condición filtro para comenzar el proceso */


  // Si el DNI está registrado, comienza el proceso, sino 

  /* if(alumno){
 
    for(const key in alumno){
      if( key != 'dni') obj_respuesta[key] = alumno[key]
    }
    
    procesarEnPrevias(obj_respuesta)
    
    enviarMail(obj_respuesta, true)
 
 
  } else {
 
    enviarMail(obj_respuesta, false)
        
  } */

}
