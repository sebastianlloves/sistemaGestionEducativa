function ESTADISTICA(valores_hoja) {
  const ind_cortes = {prim_bim: 4, prim_cuatr: 6, ter_bim: 7, seg_cuatr: 9, anual: 10, diciembre: 11, febrero: 12, definitiva: 13}
  const calificaciones = {}  

  // Inicializar las claves en el objeto calificaicones
  for(let key in ind_cortes){
    calificaciones[key] = []
  }
  
  valores_hoja.forEach( fila => {
    for(let key in ind_cortes){
      if(fila[ind_cortes[key]] !== '' && fila[ind_cortes[key]] !== '-'){
        calificaciones[key].push( fila[ind_cortes[key]] )
      }
    }    
  })

  let salida = []
  for(let key in calificaciones){
    const calif_total = calificaciones[key].length
    const calif_aprobadas = calificaciones[key].filter( valoracion => valoracion != 'En Proceso' && valoracion != 1  && valoracion != 2  && valoracion != 3  && valoracion != 4  && valoracion != 5 ).length

    if( calif_total > 0 ) {
      salida.push(`${calif_aprobadas} / ${calif_total}`)
      salida.push(`${parseInt(calif_aprobadas / calif_total * 100)} %`) 
    } else {
      salida.push(`-`)
      salida.push(`-`)
    }
  }

  return [salida]
}


// <<<<<<<<<    Funciones Auxiliares >>>>>>>>>>>>>

function OBTENER_LINK(n_fila, n_col) {
  return SpreadsheetApp.getActiveSheet().getRange(n_fila, n_col).getFormula().split('"')[1]
}


function PROMEDIO_DE_PROMEDIOS (columna_promedios){
  const columnas_filtradas = columna_promedios.filter(fila => fila[0]).map( fila => parseInt(fila[0].split(" %")[0]))
  const promedio = parseInt(columnas_filtradas.reduce((acumulador, valorActual) => acumulador + valorActual) / columnas_filtradas.length)

  return promedio? `${promedio} %` : '-'
}
