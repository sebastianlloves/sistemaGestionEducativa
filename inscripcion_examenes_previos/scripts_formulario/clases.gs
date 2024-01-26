class Formulario {
  constructor(obj_form, n_limite_com, n_limite_fin) {
    this.respuestas = obj_form.getResponses().slice(n_limite_com, n_limite_fin)
    this.id_respuestas = this.respuestas.map(respuesta => respuesta.getId())
  }

  getRespuestasSinRegistrar(ids_registros_validos, ids_registros_NOVALIDOS, limite_cant_resp) {
    let ids_sin_registrar = this.id_respuestas.filter(id => !ids_registros_validos.includes(id)).filter(id => !ids_registros_NOVALIDOS.includes(id))
    if(limite_cant_resp) ids_sin_registrar = ids_sin_registrar.splice(0, limite_cant_resp)
    
    return this.respuestas.filter(respuesta => ids_sin_registrar.includes(respuesta.getId()))
  }
}

class Respuesta {
  constructor (respuesta){
    this.id = respuesta.getId()
    this.fecha = respuesta.getTimestamp()
  }
}