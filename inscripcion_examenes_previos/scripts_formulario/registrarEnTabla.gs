function registrarEnTabla(obj_respuesta) {

  const fecha_respuesta = { mes: obj_respuesta.fecha.split("/")[1], ano: obj_respuesta.fecha.split("/")[2] }


  //  Obtiene las hojas, les saca la fecha del titulo, forma objeto y la ordena

  const archivo_previas = SpreadsheetApp.openById("1lMFMlxfawFKR4j2VgYPQ_WJSK5hjiNVgsd6AxxDBSbA")
  const hojas_archivo_previas = archivo_previas.getSheets()
  const nombres_hojas = hojas_archivo_previas.map(hoja => {
    if (hoja.getName().split("Instancia ")[1]) {                                                              //  Dato sensible
      return {
        mes: parseInt(hoja.getName().split("Instancia ")[1].split("/")[0]),
        ano: parseInt(hoja.getName().split("Instancia ")[1].split("/")[1])
      }
    }
  }).filter(obj => obj != null).sort((a, b) => {
    if (a.ano == b.ano) {
      if (a.mes < b.mes) return -1
      else return 1
    }
    else if (a.ano < b.ano) return -1
    else return 1
  })


  //  Encuentra la hoja más cercana en el tiempo

  const hojas_mismo_ano = nombres_hojas.filter(nombre => nombre.ano == fecha_respuesta.ano)
  let instancia_correspondiente
  if (hojas_mismo_ano.length > 0) {
    hojas_mismo_ano.forEach(obj_hoja => {
      if (obj_hoja.mes >= fecha_respuesta.mes) {
        if (!instancia_correspondiente || (instancia_correspondiente && obj_hoja.mes <= instancia_correspondiente.mes)) instancia_correspondiente = obj_hoja
      }
    })
  }
  if (!instancia_correspondiente) {
    const hojas_ano_siguiente = nombres_hojas.filter(obj_hoja => obj_hoja.ano == (fecha_respuesta.ano + 1))
    if (hojas_ano_siguiente.length > 0) hojas_ano_siguiente.sort((a, b) => a - b), instancia_correspondiente = hojas_ano_siguiente[0]
  }

  const nombre_hoja_correspondiente = `Instancia ${instancia_correspondiente.mes}/${instancia_correspondiente.ano}`

  const salida = []

  const claves_anos = Object.keys(obj_respuesta).filter(key => key.match(/[0-9]º año/g))
  claves_anos.forEach(clave => {
    obj_respuesta[clave].forEach(materia => {
      salida.push([obj_respuesta.fecha, obj_respuesta.hora, obj_respuesta.correo, obj_respuesta.ano, obj_respuesta.division, obj_respuesta.apellido, obj_respuesta.nombre, obj_respuesta.dni, clave, materia])
    })
  })


  //  Imprime valores en esa hoja, y los ordena

  const hoja = archivo_previas.getSheetByName(nombre_hoja_correspondiente)

  if (!hoja.getRange(7, 8).getValue()) {
    if (salida.length > 2) hoja.insertRowsAfter(7, salida.length - 2)
    hoja.getRange(7, 2, salida.length, 10).setValues(salida)
  } else if (!hoja.getRange(8, 8).getValue()) {
    if (salida.length > 1) hoja.insertRowsAfter(7, salida.length - 1)
    hoja.getRange(8, 2, salida.length, 10).setValues(salida)
  } else {
    hoja.insertRowsAfter(7, salida.length)
    hoja.getRange(8, 2, salida.length, 10).setValues(salida)
  }

  hoja.getRange(7, 2, hoja.getLastRow() - 6, 10).sort([2, 3])
}
