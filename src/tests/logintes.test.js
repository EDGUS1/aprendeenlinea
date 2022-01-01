//importamos la libreria supertesr
const supertest = require('supertest')
//importamos la app
const { app } = require('../index')
//App + supertest
const api = supertest(app)
//Definicion del pool sql
const pool = require('../src/database');
//Nos trae el metodo para hacer querys a la BD

//TEst de la ruta base
test('base', async () => {
  await api
    .get('/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
//TEst de la ruta base
test('baselogin', async () => {
  await api
    .get('/login')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('not found', async () => {
  await api
    .get('/loginnotfounf')
    .expect(404)
    .expect('Content-Type', /application\/json/)
})

//Declaramos el test
test('Login', async () => {
  const user = {
    correo: 'sebasxiom@gmail.com',
    password: 'pepicho123'
  }

  const response = await api
    .post('/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.user).toBeDefined()
})
//Declaramos el test
test('Login erroneo', async () => {
  const user = {
    correo: 'sebasxiommail.com',
    password: 'pepicho1234'
  }

  await api
    .post('/login')
    .send(user)
    .expect(401)
    .expect('Content-Type', /application\/json/)

})

//Declaramos el test
test('Registro', async () => {
  const user = {
    usuario_nombre: 'Usuario Prueba',
    usuario_apellidos: 'Prueba Apellido',
    password: '123',
    correo: 'prueba@test.com',
    url: ''
  }

  const response = await api
    .post('/register')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const passwordCreated = response.body.usuario_id
  await pool.query('DELETE FROM usuarios WHERE usuario_id = ?', [passwordCreated])
})

test('Registro fallido', async () => {
  const user = {
    usuario_nombre: 'UsuarioPrueba2',
    usuario_apellidos: 'Prueba Apellido',
    password: "",
    correo: 'prueba@test.com',
    url: ''
  }

  await api
    .post('/register')
    .send(user)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  await pool.query("DELETE FROM usuarios WHERE usuario_nombre = 'UsuarioPrueba2'")
})

//Declaramos el test
test('Create sugerences', async () => {
  const newSuggestion = {
    categoria_id: 15,
    sugerencia_nombre_curso: 'Prueba'
  }
  const response = await api
    .post('/suggestions')
    .send(newSuggestion)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const idSuggestionCreated = response.body.sugerencia_id

  await pool.query('DELETE FROM sugerencias WHERE sugerencia_id = ?', [idSuggestionCreated])
})
test('Create sugerences empty', async () => {
  const newSuggestion = {

  }
  await api
    .post('/suggestions')
    .send(newSuggestion)
    .expect(400)
    .expect('Content-Type', /application\/json/)

})
test('vote sugerences empty', async () => {
  const newSuggestion = {

  }
  await api
    .put('/votarSugerencias')
    .send(newSuggestion)
    .expect(400)
    .expect('Content-Type', /application\/json/)

})

//Declaracion de un describe de tests
describe('Material test', () => {
  //Declaracion del test
  test('List Material by course', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listMaterials/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  // Prueba para verificar el listado de notificaciones por usuario
  test('GET /listarNotificacionesPorUsuario', async () => {
    const response = await api
      .get('/listarNotificacionesPorUsuario/1635')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('CREATE material', async () => {
    const nweMaterial = {
      nombre: 'Material Prueba'
    }
    const response = await api
      .post('/course-material/35')
      .send(nweMaterial)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const idMaterialCreated = response.body.material_id

    await pool.query('DELETE FROM material WHERE material_id = ?', [idMaterialCreated])
  })

  test('crear tarea', async () => {
    const newTask = {
      curso_id: 35,
      nombre: 'prueba'
    }
    const response = await api
      .post('/creartarea')
      .send(newTask)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const idMaterialCreated = response.body.tarea_id

    await pool.query('DELETE FROM tareas WHERE tarea_id = ?', [idMaterialCreated])
  })

  test('crear tarea fail', async () => {
    const newTask = {

    }
    const response = await api
      .post('/creartarea')
      .send(newTask)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })
  test('GET /archivos', async () => {
    await api
      .get('/mostrarArchivo/4')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('crear entregarTarea', async () => {
    const newTask = {
      tarea_id: 5,
      usuario_id: 1635
    }
    await api
      .post('/entregarTarea')
      .send(newTask)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })
})

//Declaracion de un describe de tests
describe('Categories test', () => {
  //Declaracion del test
  test('GET all categories', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/categories')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('GET one categories', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/categories/15')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('GET one categories fail', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/categories/12')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('test extras', () => {
  test('VotarSugerencia', async () => {
    const suge = {
      usuario_id: 35,
      sugerencia_id: 25
    }
    await api
      .put('/votarSugerencias')
      .send(suge)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    await api
      .put('/votarSugerencias')
      .send(suge)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await pool.query('DELETE FROM votos WHERE usuario_id = ? and sugerencia_id', [35, 25])
  })
  test('editarTarea', async () => {
    const suge = {
      nombre: 'Tarea edit'
    }
    await api
      .put('/editarTarea/5')
      .send(suge)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('subirArchivo', async () => {
    const archivo = {
      archivo_id: 12,
      origen_id: 25,
      url: "https://firebasestorage.googleapis.com/v0/b/bd-archivos.appspot.com/o/BD%20(1).pdf?alt=media&token=2998512d-b423-47d3-b9b7-5409d68620a0",
      nombre_archivo: "Prueba de Archivo test",
      tipo: 5
    }

    await api
      .post('/subirArchivo')
      .send(archivo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await pool.query('DELETE FROM archivos WHERE archivo_id = 12')

  })

})

afterAll(async () => {
  await pool.query("DELETE FROM usuarios WHERE usuario_nombre = 'UsuarioPrueba2'")
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});