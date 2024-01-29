function FALTAN_VOTAR(arrays_votos, arrays_alumnos, arrays_docentes, rol, columna_inicial, fila_inicial, cant_columnas) {

    const votacion = new Votacion(arrays_votos.map(voto => new Votante(voto)))
    const padron = new Padron(arrays_alumnos, arrays_docentes, votacion)

    const salida = padron.getElectoresSinVotar().filter(elector => elector.rol == rol).map(({ano,division,apellido,nombre,dni}) => [ano,division,apellido,nombre,dni])

    const hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    
    const color_alterno_tabla = hoja.getBandings().find(banding => banding.getRange().getColumn() == columna_inicial && banding.getRange().getRow() == fila_inicial)    

    return salida
}
