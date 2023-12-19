function INTERPRETACION_DE_MATERIAS(rango_datos) {

  let i_lim_anos = [1, 12, 23, 37, 54]
  let array_encabezados = rango_datos[0]
  let indices_troncales = [[1, 9, 10, 11], [12, 19, 20, 22], [28, 29, 30, 31, 32, 34, 35, 36], [42, 43, 45, 46, 47, 48, 49, 50, 51, 52, 53]]
  let anos = [' (1º)', ' (2º)', ' (3º)', ' (4º)', ' (5º)', ' (6º)']
  const caracteres_desaprobacion = ['En Proceso', '5', '4', '3', '2', '1']
  let finalForPrincipal = rango_datos.length  // 3
  let salida = [['Cantidad Total', 'Troncales', '', 'Generales', '', 'Cantidad', 'Detalle']]


  for (let i_alum = 1; i_alum < finalForPrincipal; i_alum++) {     //For que recorre cada fila (alumno)


    //<<<<<<<<<<<  Procesar las materias de cada alumno  >>>>>>>>>>

    let arrays_alumno = []
    for (let i_ano = 0; i_ano < i_lim_anos.length - 1; i_ano++) {    // For que recorre cada año

      let troncales_x_ano = []
      let generales_x_ano = []

      for (let i_mat = i_lim_anos[i_ano]; i_mat < i_lim_anos[i_ano + 1]; i_mat++) {    // For que recorre cada materia

        //<<<<<<<<<<<  Evaluación de si está desaprobada la materia  >>>>>>>>>>
        let esta_desaprobado = false

        for (let i_desap = 0; i_desap < caracteres_desaprobacion.length; i_desap++) {
          if (rango_datos[i_alum][i_mat] == caracteres_desaprobacion[i_desap]) {
            esta_desaprobado = true
            break
          }
        }

        //<<<<<<<<<<<  Si está desaprobado, distribuir a troncal o general  >>>>>>>>>>
        if (esta_desaprobado) {

          //<<<<<<<<<<<  Evaluar si es TRONCAL  >>>>>>>>>>
          let es_troncal = false
          for (let i_troncal = 0; i_troncal < indices_troncales[i_ano].length; i_troncal++) { //remplazar 0 por i_ano
            if (i_mat == indices_troncales[i_ano][i_troncal]) {
              es_troncal = true
              break
            }
          }

          if (es_troncal) {
            troncales_x_ano.push(array_encabezados[i_mat] + anos[i_ano])
          } else {
            generales_x_ano.push(array_encabezados[i_mat] + anos[i_ano])
          }

        }
      }

      //<<<<<<<<<<<  Se agrega al array correspondiente a ese año del alumno, los arrays de troncales y de generales ([[troncales_x_ano], [generales_x_ano]]) >>>>>>>>>>
      let cant_troncales = troncales_x_ano.length
      let cant_generales = generales_x_ano.length

      let arrays_x_ano = [cant_troncales + cant_generales, cant_troncales, troncales_x_ano, cant_generales, generales_x_ano]

      //<<<<<<<<<<<  Se agrega al array del alumno, el array del año analizado ([ [cant.total, cant_tronc, [troncales_x_ano], cant_gener, [generales_x_ano]], ... ]) >>>>>>>>>>
      arrays_alumno.push(arrays_x_ano)
    }


    //<<<<<<<<<<<  Si hay año en proceso, quitar ese elemento del arrays_alumno y asiganrlo al array_en_proceso  >>>>>>>>>>

    let array_en_proceso = [];
    let ano_en_proceso = parseInt(rango_datos[i_alum][0][0])

    if (ano_en_proceso > 0) {
      array_en_proceso = arrays_alumno[ano_en_proceso - 1]
      arrays_alumno.splice(ano_en_proceso - 1, 1)
    }


    //<<<<<<<<<<<  Procesar las Materias Pendientes  >>>>>>>>>>

    let cant_total_ALUMNO = 0
    let troncales_ALUMNO = []
    let cant_troncales_ALUMNO = 0
    let generales_ALUMNO = []
    let cant_generales_ALUMNO = 0

    for (let i = 0; i < arrays_alumno.length; i++) {     // Recorre cada array_x_ano dentro de arrays_alumno

      cant_troncales_ALUMNO += parseInt(arrays_alumno[i][1])
      for (let i1 = 0; i1 < arrays_alumno[i][2].length; i1++) { // Recorre cada elemento del array de troncales
        troncales_ALUMNO.push(arrays_alumno[i][2][i1])
      }
      cant_generales_ALUMNO += parseInt(arrays_alumno[i][3])
      for (let i2 = 0; i2 < arrays_alumno[i][4].length; i2++) { // Recorre cada elemento del array de generales
        generales_ALUMNO.push(arrays_alumno[i][4][i2])
      }

    }

    // Excepción si el alumno se llevo Tec. de Control y el Taller de la especialidad, computa como una sola.
    if ((troncales_ALUMNO.includes('Taller de Tecnol. y del Control (3º)') && troncales_ALUMNO.includes('Taller de TICs (3º)')) || troncales_ALUMNO.includes('Taller de Tecnol. y del Control (3º)') && troncales_ALUMNO.includes('Taller de Prod. Multimedial (3º)')) {
      cant_troncales_ALUMNO--
    }

    cant_total_ALUMNO = cant_troncales_ALUMNO + cant_generales_ALUMNO

    // Si el array de troncales o de generales tiene elementos, reemplaza el "No adeuda. " por la concatenación de estos elementos; sino deja el "No adeuda. "
    let leyenda_troncales = 'No adeuda. '
    if (troncales_ALUMNO.length > 0) leyenda_troncales = troncales_ALUMNO.join(", ") + '. '

    let leyenda_generales = 'No adeuda. '
    if (generales_ALUMNO.length > 0) leyenda_generales = generales_ALUMNO.join(", ") + '. '



    //<<<<<<<<<<<  Procesar las Materias En Proceso  >>>>>>>>>>

    let leyenda_en_proceso = 'No adeuda. '
    let cantidad_en_proceso = 0

    if (array_en_proceso.length > 0) {  // Si se le asigno algún array de materias como en proceso, procesarla. Sino dejar en cero las variables leyenda y cantidad

      let materias_en_proceso = []
      cantidad_en_proceso += parseInt(array_en_proceso[0])

      // Unir las troncales y generales que trae en el array materias_en_proceso
      for (var i = 0; i < array_en_proceso[2].length; i++) {
        materias_en_proceso.push(array_en_proceso[2][i])
      }
      for (var i = 0; i < array_en_proceso[4].length; i++) {
        materias_en_proceso.push(array_en_proceso[4][i])
      }

      if (materias_en_proceso.length > 0) leyenda_en_proceso = materias_en_proceso.join(", ") + '. '
    }


    let array_ALUMNO = [cant_total_ALUMNO, cant_troncales_ALUMNO, leyenda_troncales, cant_generales_ALUMNO, leyenda_generales, cantidad_en_proceso, leyenda_en_proceso]


    salida.push(array_ALUMNO)
  }

  return salida

}
