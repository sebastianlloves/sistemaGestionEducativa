function enviarMail(obj_respuesta, validacion, error_message) {

  let listado_materias = []
  const claves_anos = Object.keys(obj_respuesta).filter(key => key.match(/[0-9]º año/g))
  claves_anos.forEach(clave => {
    obj_respuesta[clave].forEach(materia => {
      listado_materias.push(`${materia} (${clave})`)
    })
  })

  listado_materias = `${listado_materias.join(", ")}.` || `En la inscripción no se seleccionó niguna materia.`
  let cuerpo_mensaje

  if (validacion) {
    cuerpo_mensaje = `
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,300&display=swap");
    </style>
    <h1
      style="
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 40px;
        text-align: center;
        line-height: 1em;
      "
    >
      TU INSCRIPCIÓN SE PROCESÓ CORRECTAMENTE
    </h1>
    <br />
    <p
      style="
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.5em;
      "
    >
      <span style="text-decoration: underline;"">Alumno/a:</span> ${obj_respuesta.apellido}, ${obj_respuesta.nombre}
    </p>
    <p
      style="
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.5em;
      "
    >
      <span style="text-decoration: underline;"">DNI:</span> ${obj_respuesta.dni}
    </p>
    <p
      style="
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.5em;
      "
    >
      <span style="text-decoration: underline;"">Curso:</span> ${obj_respuesta.ano} ${obj_respuesta.division}
    </p>
    <p
      style="
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.5em;
      "
    >
      <span style="text-decoration: underline;"">Materia/s:</span> ${listado_materias}
    </p>
    
    
    <br /><br /><br/>
    <p
      style="
        font-family: 'Poppins', sans-serif;
        font-style: italic;
        font-weight: 300;
        font-size: 15px;
        line-height: 0.5em;
      "
    >
      Escuela Técnica Nº 20 DE 20
    </p>
    <p
      style="
        font-family: 'Poppins', sans-serif;
        font-style: italic;
        font-weight: 300;
        font-size: 15px;
        line-height: 0.5em;
      "
    >
      Comuna 9
    </p>
    <p
      style="
        font-family: 'Poppins', sans-serif;
        font-style: italic;
        font-weight: 300;
        font-size: 15px;
        line-height: 0.51em;
      "
    >
      Mataderos - CABA
    </p>`
  } else {
    cuerpo_mensaje = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,300&display=swap');
    </style>
    <h1
      style="
        font-family: 'Open Sans', sans-serif;
        font-weight: 700;
        font-size: 50px;
        color: rgb(138, 14, 14);
        text-align: center;
        line-height: 1em;
      "
    >
      IMPORTANTE
    </h1>
    <h2
      style="
        font-family: 'Open Sans', sans-serif;
        font-weight: 700;
        font-size: 40px;
        text-align: center;
        line-height: 1em;
      "
    >
      Tu inscripción NO pudo procesarse
    </h2>
    <br />
    <p
      style="
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.2em;
      "
    >
      ${error_message !== 'Inscripción de materias de curso actual'? 
        `El DNI ingresado en el formulario (${obj_respuesta.dni}) no figura en nuestro registro de Estudiantes Regulares.`
        :
        `No se puede rendir como examen previo aquellas materias que cursa actualmente o pertenecen a años posteriores.`}
    </p>
    <p
      style="
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.2em;
      "
    >
      ${error_message !== 'Inscripción de materias de curso actual'? `Por favor, acercate con tu DNI a Regencia para poder corroborar la
      información.` : ''}
      
    </p>
    <br /><br /><br />
    <p
      style="
        font-family: 'Open Sans', sans-serif;
        font-style: italic;
        font-weight: 300;
        font-size: 15px;
        line-height: 0.5em;
      "
    >
      Escuela Técnica Nº 20 DE 20
    </p>
    <p
      style="
        font-family: 'Open Sans', sans-serif;
        font-style: italic;
        font-weight: 300;
        font-size: 15px;
        line-height: 0.5em;
      "
    >
      Comuna 9
    </p>
    <p
      style="
        font-family: 'Open Sans', sans-serif;
        font-style: italic;
        font-weight: 300;
        font-size: 15px;
        line-height: 0.51em;
      "
    >
      Mataderos - CABA
    </p>`
  }

  GmailApp.sendEmail(obj_respuesta.correo, 'Inscripción a Previas', ``, { htmlBody: cuerpo_mensaje })

}
