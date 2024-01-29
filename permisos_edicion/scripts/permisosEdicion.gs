function permisosInformes(ano_selec) {

  const ano_seleccionado = ano_selec
  const ciclo_lectivo = 2023
  
  //  <<<<<<<<<<<<<<<<<<<<<<<<<<<  Se conecta con "Docentes" y se toman los datos necesarios para cada archivo  >>>>>>>>>>>>>>>>>>>>>>>


  const archivo_docentes = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1KRf46j2KI2cpomSFNoTSLuetQDwdSnbed9oyL0Jz8L4/")
  const fila_encabezados = 5



  //  Se filtran las hojas. Si en su nombre tienen "...[0-9]...[0-9]...", caputara el primer nº para año y el segundo para división. Sólo toma las hojas de los cursos  >>>>>>>>>>>>>>>>>>>>

  let hojas = archivo_docentes.getSheets().filter(hoja => hoja.getName().trim().match(/[0-9]/g) && !hoja.getName().includes(('Docentes')))
  hojas = hojas.filter( hoja => hoja.getName().trim().match(/[0-9]/g)[0] == ano_seleccionado)
/*   hojas = hojas.filter(hoja => hoja.getName().trim().match(/[0-9]/g)[0] == 2 && hoja.getName().trim().match(/[0-9]/g)[1] == 2) */  // Línea para prueba, filtra para sólo un curso puntual      

  let curso = {}

  // FOR que recorre cada división

  for (const hoja of hojas) {

    //  <<<<<<  Se obtienen los datos necesarios de cada curso  >>>>>>>> 

    const datos_hojas = hoja.getDataRange().getValues()
    const nombre_hoja = hoja.getName()

    curso.ano = parseInt(nombre_hoja.trim().match(/[0-9]/g)[0])

    curso.division = parseInt(nombre_hoja.trim().match(/[0-9]/g)[1])

    curso.materias = []         //    [ '...' , '...' , '...' , '...' ]
    for (let i = 7; i < datos_hojas.length; i++) {
      curso.materias.push(datos_hojas[i][1])                                                                                                       // Valor sensible, por cambio estructura
    }
    if (curso.ano == 1 || curso.ano == 2) curso.materias.splice(curso.materias.indexOf('Taller'), 1)                                     // Porque Taller carga en archivo independiente 

    curso.preceptores = []      //    [{ nombre: ... , mail: ... }, { nombre: ... , mail: ... }]
    for (let i = 2; i < datos_hojas[5].length; i += 2) {
      if (datos_hojas[5][i] != '' && !datos_hojas[5][i].includes('@')) curso.preceptores.push({ nombre: datos_hojas[5][i], mail: datos_hojas[5][i + 1] })
    }

    curso.tutores = []      //    [{ nombre: ... , mail: ... }, { nombre: ... , mail: ... }]
    for (let i = 2; i < datos_hojas[6].length; i += 2) {
      if (datos_hojas[6][i] != '' && !datos_hojas[6][i].includes('@')) curso.tutores.push({ nombre: datos_hojas[6][i], mail: datos_hojas[6][i + 1] })
    }


    //  <<<<<<  Se conecta con el archivo Valoraciones correspondiente a ese curso, y lo modifica  >>>>>>>> 

    const archivo_valoraciones_drive = DriveApp.getFilesByName(`Valoraciones ${curso.ano}º${curso.division}º - ${ciclo_lectivo}`)
    const id_archivo = archivo_valoraciones_drive.next().getId()
    let archivo_valoraciones = SpreadsheetApp.openById(id_archivo)



    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<   Protección    >>>>>>>>>>>>>>>>>>>>>>>                                 // Sólo para hoja de informes


    const hojas_internas = archivo_valoraciones.getSheets()
    const editores_maestros = ['leonardo.cuello@bue.edu.ar', 'marcelo.veiro@bue.edu.ar', 'natalia.marcos@bue.edu.ar', 'sebastian.lloves@bue.edu.ar', 'mariaj.piacenza@bue.edu.ar', 'regencia.et20@gmail.com', 'adrian.pelliza@bue.edu.ar']
    const oficina_alumnos = ['marcelo.iervasi@bue.edu.ar', 'fabricio.toscano@bue.edu.ar']
    let rango_edicion;
    

    hojas_internas.forEach( hoja_interna => {

      if(hoja_interna.getName() != 'Listas Auxiliares'){
      
        let correos_editores = editores_maestros.concat(archivo_valoraciones.getOwner().getEmail())
        curso.preceptores.forEach( obj_preceptor => correos_editores.push(obj_preceptor.mail) )

        if( curso.materias.includes(hoja_interna.getName())) rango_edicion = hoja_interna.getRange(8, 5, (hoja_interna.getLastRow() - 7), 10)
        else if(hoja_interna.getName() == 'INFORME Individual'){
          correos_editores = correos_editores.concat(oficina_alumnos)                //  En hoja_interna INFORME, pueden editar muchos más
          curso.tutores.forEach( obj_tutor => correos_editores.push(obj_tutor.mail) )
          rango_edicion = hoja_interna.getRange(8, 6, 1, 6)
        }

      
        // <<<<<<<<< Protección RANGO EDITABLE
        
        let protecciones_rango = hoja_interna.getProtections(SpreadsheetApp.ProtectionType.RANGE)
        if( protecciones_rango.length === 0 ) {                                     //  Si no existe la protección, la crea
          protecciones_rango[0] = rango_edicion.protect().setDescription('Rango Editable');
          protecciones_rango[0].addEditors(correos_editores);
        }

        // Comparar los editores previos y obtenidos, y borrar o agregar según corresponda
        let editores_previos_rango = []
        protecciones_rango.forEach(proteccion => proteccion.getEditors().forEach(editor => editores_previos_rango.push(editor.getEmail())))          // Se obtienen los editores actuales del rango
        
        const sobrantes_rango = editores_previos_rango.filter( editor => !correos_editores.includes(editor))      // Filtrar los que sobran
        const faltantes_rango = correos_editores.filter( editor => !editores_previos_rango.includes(editor))      // Filtrar los que faltan

        if(faltantes_rango.length > 0) protecciones_rango[0].addEditors(faltantes_rango)
        if(sobrantes_rango.length > 0) protecciones_rango[0].removeEditors(sobrantes_rango)
        

      
        // <<<<<<<<< Protección ESTRUCTURA
        
        const correos_estructura = [archivo_valoraciones.getOwner().getEmail(), 'sebastian.lloves@bue.edu.ar']
        let protecciones_hoja_interna = hoja_interna.getProtections(SpreadsheetApp.ProtectionType.SHEET)
        if( protecciones_hoja_interna.length === 0 ) {                                     //  Si no existe la protección, la crea
          protecciones_hoja_interna[0] = hoja_interna.protect().setDescription('Estructura')
          protecciones_hoja_interna[0].setUnprotectedRanges([rango_edicion]).addEditor(archivo_valoraciones.getOwner())
        }

        // Comparar los editores previos y obtenidos, y borrar o agregar según corresponda
        let editores_previos_hoja = []
        protecciones_hoja_interna.forEach(proteccion => proteccion.getEditors().forEach(editor => editores_previos_hoja.push(editor.getEmail())))      // Se obtienen los editores actuales del rango

        const sobrantes_hoja = editores_previos_hoja.filter( editor => !correos_estructura.includes(editor))      // Filtrar los que sobran
        const faltantes_hoja = correos_estructura.filter( editor => !editores_previos_hoja.includes(editor))      // Filtrar los que faltan

        if(faltantes_hoja.length > 0) protecciones_hoja_interna[0].addEditors(faltantes_hoja)
        if(sobrantes_hoja.length > 0) protecciones_hoja_interna[0].removeEditors(sobrantes_hoja)

      }

      archivo_docentes.toast(`Procesando hoja "${hoja_interna.getName()}" del archivo Valoraciones ${curso.ano}º ${curso.division}º - 2023`, 'Proceso inconcluso...', -1)


    })



    //  <<<<<<<<<<< Permisos desde Drive

    const archivo = DriveApp.getFileById(archivo_valoraciones.getId())
    archivo.setShareableByEditors(false)
    archivo.setSharing(DriveApp.Access.PRIVATE,DriveApp.Permission.NONE)

    // Se compara los ususarios compartidos previamente, con respecto a los editores correspondientes recolectados de Docentes

    const compartidos = editores_maestros.concat(oficina_alumnos)
    curso.preceptores.forEach( obj_preceptor => compartidos.push(obj_preceptor.mail) )                                //  Si los docentes editan notas, agregarlos acá
    curso.tutores.forEach( obj_tutor => compartidos.push(obj_tutor.mail) )
    let editores_archivo = []
    archivo.getEditors().forEach( editor => editores_archivo.push(editor.getEmail()) )

    const sobrantes_archivo = editores_archivo.filter( editor => !compartidos.includes(editor))                   // Filtrar los que sobran
    const faltantes_archivo = compartidos.filter( editor => !editores_archivo.includes(editor))                   // Filtrar los que faltan

    if(faltantes_archivo.length > 0) archivo.addEditors(faltantes_archivo)
    if(sobrantes_archivo.length > 0) sobrantes_archivo.forEach( sobrante => archivo.removeEditor(sobrante))
  
  }

  archivo_docentes.toast(`${ano_seleccionado}º año.`, 'Proceso finalizado.', -1)
}



function permisosInformes_1() {
  permisosInformes(1)
}

function permisosInformes_2() {
  permisosInformes(2)
}

function permisosInformes_3() {
  permisosInformes(3)
}

function permisosInformes_4() {
  permisosInformes(4)
}

function permisosInformes_5() {
  permisosInformes(5)
}

function permisosInformes_6() {
  permisosInformes(6)
}

function permisosInformes_primerCiclo() {
  permisosInformes(1)
  permisosInformes(2)
}

function permisosInformes_segundoCiclo() {
  permisosInformes(3)
  permisosInformes(4)
  permisosInformes(5)
  permisosInformes(6)
}

