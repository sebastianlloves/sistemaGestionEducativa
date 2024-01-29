const n_respuesta_comienzo = 1903
const n_respuesta_fin = undefined


function procesarVotacion() {

  const formulario = new Formulario(FormApp.getActiveForm(), n_respuesta_comienzo, n_respuesta_fin)                                                                       //    DATO SENSIBLE !!!
  const hoja_votos_validos = new HojaRegistro(SpreadsheetApp.openById("1W1N8IW2WiLEqW-b-sjaG46G0cT8FFphUrV9uRoDrQUo").getSheetByName("3° Vuelta"))                        //    DATO SENSIBLE !!!
  const hoja_votos_NoValidos = new HojaRegistro(SpreadsheetApp.openById("1W1N8IW2WiLEqW-b-sjaG46G0cT8FFphUrV9uRoDrQUo").getSheetByName("Votos NO VÁLIDOS (3° Vuelta)"))   //    DATO SENSIBLE !!!

  const respuestas_sin_registrar = formulario.getRespuestasSinRegistrar(hoja_votos_validos.getRegistrosId(), hoja_votos_NoValidos.getRegistrosId(), 5)


  if (respuestas_sin_registrar.length > 0) {

    const registrador = new Registrador(respuestas_sin_registrar, hoja_votos_validos, hoja_votos_NoValidos)
  /*   registrador.registrarVotosFaltantes() */

  } else {
    Logger.log('Todas las respuestas están registradas')
  }

}
