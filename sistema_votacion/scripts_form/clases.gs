class Formulario {
  constructor(obj_form, n_limite_com, n_limite_fin) {
    this.respuestas = obj_form.getResponses().slice(n_limite_com, n_limite_fin)
    this.id_respuestas = this.respuestas.map(respuesta => respuesta.getId())
  }

  getRespuestasSinRegistrar(ids_registros_validos, ids_registros_NOVALIDOS, limite_cant_resp) {
    let ids_sin_registrar = this.id_respuestas.filter(id => !ids_registros_validos.includes(id)).filter(id => !ids_registros_NOVALIDOS.includes(id))
    if(limite_cant_resp) ids_sin_registrar = ids_sin_registrar.splice(0, limite_cant_resp)
    
    return this.respuestas.filter(respuesta => ids_sin_registrar.includes(respuesta.getId()))
  }
}


class HojaRegistro {
  constructor(hoja) {
    this.obj_hoja = hoja
    this.ultima_fila_hoja = hoja.getMaxRows()
    // DATOS VARIABLES IMPORTANTES
    this.primera_columna_tabla = 2
    this.cant_columnas_tabla = 11
    this.primera_fila_tabla = 3
    this.col_id = 12
  }

  getLastRowTable() {
    const data = this.obj_hoja.getRange(this.primera_fila_tabla, this.primera_columna_tabla, this.ultima_fila_hoja, this.cant_columnas_tabla).getValues()

    return data.findIndex(fila => fila.every(celda => celda === '')) + this.primera_fila_tabla - 1    // el findIndex encuentra el index de la primera fila que tiene todos sus valores === ''
  }

  getRegistrosId() {
    return (this.getLastRowTable() - this.primera_fila_tabla + 1) > 0 ? this.obj_hoja.getRange(this.primera_fila_tabla, this.col_id, this.getLastRowTable() - this.primera_fila_tabla + 1).getValues().map(array => array[0]) : []
  }

  getRegistrosDNI() {
    return (this.getLastRowTable() - this.primera_fila_tabla + 1) > 0 ? this.obj_hoja.getRange(this.primera_fila_tabla, 5, this.getLastRowTable() - this.primera_fila_tabla + 1, 6).getValues().map(array => {return { rol: array[0], dni: array[5]}}) : []
  }

  setBandingRange(ultima_fila_tabla) {
    const banding_range = this.obj_hoja.getRange(this.primera_fila_tabla, this.primera_columna_tabla, ultima_fila_tabla - this.primera_fila_tabla + 1, this.cant_columnas_tabla - 1)
    this.obj_hoja.getBandings().forEach(b => (b.getRange().getColumn() == 2) && b.setRange(banding_range))
  }

  getVotosRegistrados() {
    return (this.getLastRowTable() - this.primera_fila_tabla + 1) > 0 ? this.obj_hoja.getRange(this.primera_fila_tabla, this.primera_columna_tabla, this.getLastRowTable() - this.primera_fila_tabla + 1, this.cant_columnas_tabla).getValues().map(([fecha, hora, correo, rol, ano, div, apellido, nombre, dni, voto]) => {return {fecha, hora, correo, rol, ano, div, apellido, nombre, dni, voto}}) : []
  }

  imprimirValores(array_salida){
    const ult_fila_tabla = this.getLastRowTable()

    this.obj_hoja.getRange(ult_fila_tabla + 1, this.primera_columna_tabla, array_salida.length, this.cant_columnas_tabla).setValues(array_salida)
    this.obj_hoja.getRange(this.primera_fila_tabla, this.primera_columna_tabla, 1, this.cant_columnas_tabla).copyFormatToRange(this.obj_hoja, this.primera_columna_tabla, this.primera_columna_tabla, this.primera_fila_tabla, ult_fila_tabla + array_salida.length)
    this.setBandingRange(ult_fila_tabla + array_salida.length)
    this.obj_hoja.insertRowsBefore(this.ultima_fila_hoja, 1)
    this.obj_hoja.getRange(ult_fila_tabla + array_salida.length + 1 , this.primera_columna_tabla, 1, this.cant_columnas_tabla - 1).setBorder(true, null, null, null, null, null, '#435560', SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  }
}



class Registrador{
  constructor(respuestas_sin_registrar, hoja_votos_validos, hoja_votos_NoValidos){
    this.hoja_votos_validos = hoja_votos_validos
    this.hoja_votos_NoValidos = hoja_votos_NoValidos
    this.respuestas_sin_registrar = respuestas_sin_registrar
    this.votos_registrados = this.hoja_votos_validos.getVotosRegistrados()
    this.padron_alumnos = SpreadsheetApp.openById('1nH8PdhKffqrAl1uguUp3TT444hBY1zckfoCL8P4vplI').getSheetByName("Alumnos Regulares").getDataRange().getValues().filter(fila => fila[5] != 'DNI' && fila[5] != '').map(([ n, ano, div, apellido, nombre, dni])=> {return {ano: ano, division: div, apellido: apellido, nombre: nombre, dni: dni}})
    this.padron_docentes = SpreadsheetApp.openById('1KRf46j2KI2cpomSFNoTSLuetQDwdSnbed9oyL0Jz8L4').getSheetByName("Docentes").getDataRange().getValues().filter(fila => fila[2] != 'DNI' && fila[2] != '').map(([vacio, nombre_completo, dni, mail]) => {return { ano: "-", division: "-", apellido: nombre_completo.split(", ")[0], nombre: nombre_completo.split(", ")[1], dni: dni}})
  }

  getDatosDni({rol, dni}) {
    const datos_dni = rol === 'Alumno/a' || rol == 'Familiar de alumno/a' ? this.padron_alumnos.find( obj_al => obj_al.dni == dni ) : this.padron_docentes.find( obj_doc => obj_doc.dni == dni)
    return datos_dni 
  }

  puedeVotar(respuesta, salida) {
    return !this.votos_registrados.find( voto_registrado => voto_registrado.rol == respuesta.rol && voto_registrado.dni == respuesta.dni) && !salida.find(([fecha, hora, correo, rol, ano, division, apellido, nombre, dni, voto]) => {return (rol == respuesta.rol && dni == respuesta.dni)})
  } 

  esCorreoValido({correo}) {
    return correo == 'nombre.et20@gmail.com'
  }

  registrarVotosFaltantes() {
    let salida_validos = []
    let salida_NoValidos = []

    this.respuestas_sin_registrar.forEach(r => {
      const respuesta = new Respuesta(r)
      const datos_dni = this.getDatosDni(respuesta)
      const puede_votar = this.puedeVotar(respuesta, salida_validos)
      const correo_valido = this.esCorreoValido(respuesta)
      Logger.log(respuesta)
      Logger.log(datos_dni)    // Condición 1
      Logger.log(`Puede Votar: ${puede_votar}`)    // Condición 2
      Logger.log(`Es correo válido: ${correo_valido}`)    // Condición 3
      Logger.log(`Es voto válido: ${Boolean(datos_dni && puede_votar && correo_valido)}`)

      if(datos_dni && puede_votar && correo_valido){
        salida_validos.push([respuesta.fecha, respuesta.hora, respuesta.correo, respuesta.rol, datos_dni.ano, datos_dni.division, datos_dni.apellido, datos_dni.nombre, respuesta.dni, respuesta.votos, respuesta.id])
      } else {
        salida_NoValidos.push([respuesta.fecha, respuesta.hora, respuesta.correo, respuesta.rol, datos_dni? datos_dni.ano : '-', datos_dni? datos_dni.division : '-', datos_dni? datos_dni.apellido : '-', datos_dni? datos_dni.nombre : '-', respuesta.dni, respuesta.votos, respuesta.id])
      }
      Logger.log(salida_validos)
      Logger.log(salida_NoValidos)

      Logger.log('--------------------')
    })

    salida_validos.length > 0 && this.hoja_votos_validos.imprimirValores(salida_validos)
    salida_NoValidos.length > 0 && this.hoja_votos_NoValidos.imprimirValores(salida_NoValidos)

  }
}



class Respuesta {
  constructor(respuesta) {
    const fecha_respuesta = respuesta.getTimestamp()
    const [resp_rol, resp_dni, resp_votos] = respuesta.getItemResponses()

    this.id = respuesta.getId()
    this.fecha = `${fecha_respuesta.getDate()}/${fecha_respuesta.getMonth() + 1}/${fecha_respuesta.getFullYear()}`
    this.hora = `${fecha_respuesta.getHours() > 9 ? '' : '0'}${fecha_respuesta.getHours()}:${fecha_respuesta.getMinutes() > 9 ? '' : '0'}${fecha_respuesta.getMinutes()} hs.`
    this.correo = respuesta.getRespondentEmail()
    this.rol = resp_rol.getResponse()
    this.dni = Number(resp_dni.getResponse())
    this.votos = resp_votos.getResponse()
  }
}
