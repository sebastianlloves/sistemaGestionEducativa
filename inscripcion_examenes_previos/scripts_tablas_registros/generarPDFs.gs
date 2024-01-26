function generarPDFs (obj_alumno, nombre_hoja){

  Logger.log(`Procesando ${obj_alumno.apellido}, ${obj_alumno.nombre}`)
  let it_pdf = DriveApp.getFilesByName(`Permiso de Examen ${obj_alumno.apellido}, ${obj_alumno.nombre} (${nombre_hoja.split(" ")[1]}).pdf`)
  const pdf = it_pdf.hasNext()? it_pdf.next() : undefined


  //  Si no hay un pdf con ese nombre o con fecha de última actualización menor a la que trae el objeto:
  if(!pdf || (pdf && new Date(pdf.getDescription()).valueOf() < new Date(obj_alumno.ult_actualizacion).valueOf())){

    if(pdf) {
      Logger.log(`Borró archivo ${pdf.getName()} anterior.`)
      pdf.setTrashed(true)
    }

    Logger.log(`Creando permiso de ${obj_alumno.apellido}, ${obj_alumno.nombre}`)
    let filas_tabla = ``
    const claves_anos = Object.keys(obj_alumno).filter(key => key.match(/[0-9]º año/g))
    claves_anos.forEach( clave_ano => {
      obj_alumno[clave_ano].forEach( materia => filas_tabla += `
        <tr>
          <td>${materia} (${clave_ano})</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        `
      )
    })

    const htmlContenido = `
      <style>
        html {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        * {
          font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
            sans-serif;
        }
        body {
          padding: 3%;
        }
        h1 {
          text-align: center;
          font-size: 40px;
        }
        h2 {
          text-align: center;
          font-size: 30px;
          font-style: italic;
        }
        p {
          font-size: 18px;
          font-weight: 300;
        }
        p span {
          font-size: 20px;
          font-weight: 500;
          text-decoration: underline;
          font-style: italic;
        }
        table,
        th,
        td {
          border: 1px solid rgb(8, 8, 8);
          border-collapse: collapse;
          font-size: 15px;
        }
        table {
          width: 100%;
        }
        @media print {
          th {
            background-color: #2e3c47 !important;
            print-color-adjust: exact;
          }
        }
        th {
          font-weight: 700;
          font-style: italic;
          color: rgb(233, 238, 238);
          height: 35px;
          background-color: #2e3c47 !important;
        }
        td{
          padding-left: 5px;
          height: 30px;
        }
        .C1 {
          width: 45%;
        }
        .C2 {
          width: 15%;
        }
        .C4 {
          width: 20%;
        }
        .C3 {
          width: 20%;
        }
      </style>

      <h1>PERMISO DE EXAMEN</h1>
      <h2>${nombre_hoja}</h2>

      <br><br><br>
      <p><span>Alumno/a:</span>    ${obj_alumno.apellido}, ${obj_alumno.nombre}</p>
      <p><span>DNI:</span>    ${obj_alumno.dni}</p>
      <p><span>Curso:</span>    ${obj_alumno.ano} ${obj_alumno.division}</p>
      <br>

      <br />
      <table>
        <tr>
          <th class="C1">Materia</th>
          <th class="C2">Fecha</th>
          <th class="C3">Calificación</th>
          <th class="C4">Firma Profesor</th>
        </tr>

        ${filas_tabla}
      </table>
    `

    const blob = Utilities.newBlob(htmlContenido, MimeType.HTML)
    blob.setName(`Permiso de Examen ${obj_alumno.apellido}, ${obj_alumno.nombre} (${nombre_hoja.split(" ")[1]}).pdf`)
    
    //  Busca la carpeta de la instancia, si no la encuentra la crea y mueve a la carpeta "Permisos de Examen"
    let carpeta_instancia = DriveApp.getFoldersByName(nombre_hoja)
    if(!carpeta_instancia.hasNext()){
      DriveApp.createFolder(nombre_hoja).moveTo(DriveApp.getFoldersByName('Permisos de examen').next())
      carpeta_instancia = DriveApp.getFoldersByName(nombre_hoja)
    }

    //  Crea el archivo, y le define como descripción la info de la última actualización
    const archivo_pdf = carpeta_instancia.next().createFile(blob.getAs(MimeType.PDF))
    archivo_pdf.setDescription(obj_alumno.ult_actualizacion)
    Logger.log('Entró')
  } else {
    Logger.log(`El permiso de ${obj_alumno.apellido}, ${obj_alumno.nombre} ya existe y como la fecha actualización es la misma, lo dejó tal cual.`)
  }

}
