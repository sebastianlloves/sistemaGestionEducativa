// <<<<<<<<<<<<<<<<<    Permitir Importrange a archivos   >>>>>>>>>>>>>>>>>>>>>>>


function AGREGAR_PERMISO_IMPORTRANGE(fileId, donorId) {
  var url = 'https://docs.google.com/spreadsheets/d/' +
    fileId +
    '/externaldata/addimportrangepermissions?donorDocId=' +
    donorId;
  var token = ScriptApp.getOAuthToken();
  var params = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    muteHttpExceptions: true
  };
  UrlFetchApp.fetch(url, params);
}


//  Habilita IMPORTRANGE a todos los archivos de Valoraciones de ese año

function PERMITIR_IMPORTRANGE (){
  const archivoActualID = SpreadsheetApp.getActiveSpreadsheet().getId()
  let archivos = DriveApp.getFiles()
  while(archivos.hasNext()) {
    const archivo = archivos.next()
    if(archivo.getName().match(/Valoraciones [0-9]º[0-9]º - 2023/g)) {                                  // El año es dato SENSIBLE, modificarlo
      AGREGAR_PERMISO_IMPORTRANGE(archivoActualID, archivo.getId())
      Logger.log(archivo.getName(), archivo.getId())
    }
  }
}

