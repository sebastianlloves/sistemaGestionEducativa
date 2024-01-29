function hallarRegistrosRepetidos() {

  const hoja_votos_validos = new HojaRegistro(SpreadsheetApp.openById("1W1N8IW2WiLEqW-b-sjaG46G0cT8FFphUrV9uRoDrQUo").getSheetByName("3° Vuelta"))                        //    DATO SENSIBLE !!!
  const hoja_votos_no_validos = new HojaRegistro(SpreadsheetApp.openById("1W1N8IW2WiLEqW-b-sjaG46G0cT8FFphUrV9uRoDrQUo").getSheetByName("Votos NO VÁLIDOS (3° Vuelta)"))     //    DATO SENSIBLE !!!

  const registros_totales = [...hoja_votos_validos.getRegistrosId(), ...hoja_votos_no_validos.getRegistrosId()]
  const repetidos_totales = registros_totales.filter( (registro, index) => index !== registros_totales.indexOf(registro))

  Logger.log("Repetidos Totales")
  Logger.log(repetidos_totales)


}


function hallarDNIsRepetidos() {

  const hoja_votos_validos = new HojaRegistro(SpreadsheetApp.openById("1W1N8IW2WiLEqW-b-sjaG46G0cT8FFphUrV9uRoDrQUo").getSheetByName("Votos NO VÁLIDOS (3° Vuelta)"))                        //    DATO SENSIBLE !!!
  const registros = hoja_votos_validos.getRegistrosDNI()

  let repetidos = []
  registros.forEach(obj_voto => {
    (registros.findIndex(el => el.dni == obj_voto.dni && el.rol == obj_voto.rol) !== registros.findLastIndex(el => el.dni == obj_voto.dni && el.rol == obj_voto.rol)) && !repetidos.find(elem => elem.dni == obj_voto.dni && elem.rol == obj_voto.rol) && repetidos.push(obj_voto)
  })

  Logger.log(repetidos)
}


function hallarRegistrosSobrantes() {
  const formulario = new Formulario(FormApp.getActiveForm(), n_respuesta_comienzo, n_respuesta_fin)                                                                       //    DATO SENSIBLE !!!
  const hoja_votos_validos = new HojaRegistro(SpreadsheetApp.openById("1W1N8IW2WiLEqW-b-sjaG46G0cT8FFphUrV9uRoDrQUo").getSheetByName("3° Vuelta"))                        //    DATO SENSIBLE !!!
  const hoja_votos_NoValidos = new HojaRegistro(SpreadsheetApp.openById("1W1N8IW2WiLEqW-b-sjaG46G0cT8FFphUrV9uRoDrQUo").getSheetByName("Votos NO VÁLIDOS (3° Vuelta)"))   //    DATO SENSIBLE !!!

  const registros_validos_sobrantes = hoja_votos_validos.getRegistrosId().filter(registro => !formulario.id_respuestas.find(id_respuesta => id_respuesta == registro))
  const registros_no_validos_sobrantes = hoja_votos_NoValidos.getRegistrosId().filter(registro => !formulario.id_respuestas.find(id_respuesta => id_respuesta == registro))
  Logger.log(hoja_votos_validos.getRegistrosId().length)
  Logger.log(hoja_votos_NoValidos.getRegistrosId().length)
  Logger.log(formulario.id_respuestas.length)
}

