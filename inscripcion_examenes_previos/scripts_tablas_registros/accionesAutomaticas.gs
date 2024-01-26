function onOpen() {
  // Crea el menú de "Funcionalidades Especiales"
  const ui = SpreadsheetApp.getUi()
  ui.createMenu('Funcionalidades Especiales')
    .addItem('Generar Permisos de Examen', 'generarPermisosExamen')
    .addToUi()

  // Crea desplegable en hoja "Actas Volantes", con los nombres de las distintas instancias
  const hojas = SpreadsheetApp.getActiveSpreadsheet().getSheets().filter(hoja => hoja.getName().includes("Instancia ")).map(hoja => hoja.getName())
  const celda_lista_instancias = { row: 2, column: 10 }

  const celda = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Actas Volante').getRange(celda_lista_instancias.row, celda_lista_instancias.column)
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(hojas).setAllowInvalid(false).build()
  celda.setDataValidation(rule)
  celda.setValue(hojas[hojas.length - 1])
}


function onEdit(e) {
  // En la hoja "Actas Volantes", al seleccionar un año crea un desplegable con las materias correspondientes a ese año
/*   const celda_lista_anos = 'N4'
  const celda_lista_materias = { row: 4, column: 16 } */
  const celda_lista_anos = 'C13'
  const celda_lista_materias = { row: 14, column: 3 }

  const sheet_name = e.range.getSheet().getName()
  const range = e.range.getA1Notation()
  if (sheet_name.includes(/* 'Instancia ' */ 'Actas Volante') && range === celda_lista_anos) {
    const materias = { '1º año': ["Lengua y Literatura", "Inglés", "Historia", "Geografía", "Educación Ciudadana", "Educación Física", "Biología", "Educación Artística", "Matemática", "Tecnol. de la Representación", "Taller"], '2º año': ["Lengua y Literatura", "Inglés", "Historia", "Geografía", "Educación Ciudadana", "Educación Física", "Biología", "Matemática", "Física", "Tecnol. de la Representación", "Taller"], '3º año': ["Historia", "Geografía", "Educación Ciudadana", "Educación Física", "Inglés", "Lengua y Literatura", "Matemática", "Física", "Tecnol. de la Representación", "Rep. Mediales, Comunicación y Lenguajes", "Química", "Taller de Tecnol. y del Control", "Taller de TICs", "Taller de Prod. Multimedial"], '4º año': ["Educación Física", "Inglés", "Ciudadanía y Trabajo", "Lengua y Literatura", "Ciencia y Tecnología", "Matemática", "Introd. a las Redes de Comunicación", "Dispositivos Electrónicos Programables", "Lab. de Soporte de Equipos Informáticos", "Lab. de Desarrollo de Aplicaciones", "Taller de Proy. Integradores I", "Representación Sonora", "Representación Visual", "Diseño Web", "Lab. de Postprod. de la Imagen y del Sonido", "Taller de Tecnol. de la Imagen", "Taller de Tecnol. del Sonido"], '5º año': ["Educación Física", "Inglés", "Lengua y Literatura", "Matemática", "Arte, Tecnol. y Comunicación", "Guión y Narrativa", "Lab. de Técnicas de Animación", "Lab. de Proy. Multimediales", "Taller de Proy. Audiovisual de Ficción", "Taller de Proy. Audiovisual Documental", "Administración de Redes", "Sist. Integrales de Información", "Lab. de Soporte de Sist. Informáticos", "Lab. de Desarrollo de Sist. de Información", "Taller de Proy. Integradores II"], '6º año': ["Educación Física", "Ciudadanía y Trabajo", "Gestión de los Procesos Productivos", "Economía y Gestión de las Organizaciones", "Admin. Avanzada de Sistemas y Redes", "Procesamiento de la Información", "Seguridad y Medioambiente", "Gestión y Marketing Aplicado a TICs", "Taller de Proy. Integradores III", "Arte Digital", "Lab. de Proy. Multimedial Ludificado", "Lab. de Proy. de Tecnol. y Artes Electrónicas", "Taller de Proy. Audio Visual Digital", "Taller de Animación 3D", "Prácticas Profesionalizantes"]}
    const ano = e.value
    const celda = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange(celda_lista_materias.row, celda_lista_materias.column)
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(materias[ano]).setAllowInvalid(false).build()
    celda.setValue('')
    celda.setDataValidation(rule)
  }
}
