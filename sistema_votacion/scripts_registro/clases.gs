class Votante{
  constructor ([fecha, hora, mail, rol, ano, division, apellido, nombre, dni]){
    this.rol = rol
    this.dni = dni
  }
}


class Votacion {
  constructor(votantes){
    this.docentes = votantes.filter(voto => voto.rol == 'Docente')
    this.alumnos = votantes.filter(voto => voto.rol == 'Alumno/a')
  }
}


class Padron{
  constructor(arrays_alumnos, arrays_docentes, votacion){
    this.alumnos = arrays_alumnos.filter(alumno => alumno[4]).map(alumno => new Elector([...alumno, 'Alumno/a']))
    this.docentes = arrays_docentes.filter(docente => docente[1]).map(docente => new Elector(['-', '-', docente[0].split(", ")[0], docente[0].split(", ")[1], docente[1], 'Docente']))
    this.votacion = votacion
  }

  getElectoresSinVotar(){
    const alumnos_sin_votar = this.alumnos.filter(alumno => ! this.votacion.alumnos.find(votante => votante.dni == alumno.dni && votante.rol == alumno.rol))
    const docentes_sin_votar = this.docentes.filter(docente => ! this.votacion.docentes.find(votante => votante.dni == docente.dni && votante.rol == docente.rol))
    return [...alumnos_sin_votar, ...docentes_sin_votar]
  }
}
