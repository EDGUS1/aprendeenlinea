//importamos la libreria supertesr
const supertest = require('supertest');
//importamos la app
const { app } = require('../../index');
//App + supertest
const api = supertest(app);
//Definicion del pool sql
const pool = require('../database');
//Nos trae el metodo para hacer querys a la BD

//Declaracion de un describe de tests
// Suit de pruebas para cursos
describe('tests de Cursos', () => {
  // Prueba para obtener cursos
  test('Get course by ID', async () => {
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .get('/courses/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.data.curso_id).toBe(35);
  });
  //Declaracion del test
  test('Get all courses', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/coursespublic')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get max courses', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/coursespublicmax')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get user courses puiblic', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/coursespublic/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get courses by user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/coursesofuser/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get courses by user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/course-user/135')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('Get courses by user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/cursos/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('CREATE one course', async () => {
    const newCourse = {
      usuario_id: 35,
    };
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .post('/courses')
      .send(newCourse)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const idCourseCreated = response.body.curso_id;

    await pool.query('DELETE FROM cursos WHERE curso_id = ?', [
      idCourseCreated,
    ]);
  });
  //Declaracion del test
  test('GET /listarCursosAgregadosPorProfesor', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarCursosAgregadosPorProfesor/1645')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  // Declaracion del test
  test('GET /listarCursosConSolicicitudAcceso', async () => {
    // Hacemos la llamada a la ruta de la api
    await api
      .get('/listarCursosConSolicicitudAcceso/8205')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  // Prueba para verificar la lista de cursos con solicitud de acceso para el alumno
  test('GET /listarCursosConSolicicitudAccesoParaAlumnos', async () => {
    // Hacemos la llamada a la ruta de la api
    await api
      .get('/listarCursosConSolicicitudAccesoParaAlumnos/23285')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  // Prueba para verificar la union a un curso por codigo
  test('POST /unirPorCodigo', async () => {
    let nuevo = {
      codigo: 'HLS31M87',
      usuario_id: 1735,
    };
    const response = await api
      .post('/unirPorCodigo')
      .send(nuevo)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const idCourseCreated = response.body.curso_id;
    // Borramos el dato de prueba insertado
    await pool.query(
      'DELETE FROM curso_usuario WHERE curso_id = ? and usuario_id = ?',
      [idCourseCreated, nuevo.usuario_id]
    );
  });

  test('test deletecoursesUsers', async () => {
    const newCourse = {
      curso_id: 35,
      correo: 'xdpvd@hotmail.es',
    };
    //Hacemos la llamada a la ruta de la api
    await api
      .post('/coursesUsers')
      .send(newCourse)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const idCourseCreated = {
      curso_id: 35,
      usuario_id: 205,
    };
    await api
      .post('/deletecoursesUsers')
      .send(idCourseCreated)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });
  test('test editar curso', async () => {
    const newCourse = {
      curso_nombre: 'Prueba',
    };
    //Hacemos la llamada a la ruta de la api
    await api
      .post('/coursesEdit/35')
      .send(newCourse)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newCourse2 = {
      curso_nombre: 'Machine Learning',
    };
    await api
      .post('/coursesEdit/35')
      .send(newCourse2)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('Get /list-task-submissions', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/list-task-submissions/85')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('POST /aceptar curso publico', async () => {
    const User = {
      iduser: '55',
    };
    //Hacemos la llamada a la ruta de la api
    await api
      .post('/join-public-course/5')
      .send(User)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const User2 = {
      iduser: '85',
    };
    await api
      .post('/join-public-course/5')
      .send(User2)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  // Prueba para verificar la lista de cursos con solicitud de acceso para el alumno RO
  test('GET /AcceptarSolicitudPrivado', async () => {
    // Hacemos la llamada a la ruta de la api
    await api
      .get('/AcceptarSolicitudPrivado/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  // Prueba para verificar que se solicitando un curso privado RO
  test('POST /solicitarCursoPrivado', async () => {
    let newSolicitud = {
      curso_id: '7105',
      usuario_id: '8345',
    };
    // Hacemos la llamada a la ruta de la api
    await api
      .post('/solicitarCursoPrivado')
      .send(newSolicitud)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    await pool.query(
      'DELETE FROM curso_usuario WHERE curso_id = ? and usuario_id = ?',
      [newSolicitud.curso_id, newSolicitud.usuario_id]
    );
  });

  // Prueba para verificar editar, dar acceso o rechazar el acceso de un curso para el profesor RO
  test('PUT /AcceptarSolicitudPrivado', async () => {
    // Hacemos la llamada a la ruta de la api
    let newSolicitud_1 = {
      usuario_id: '8345',
      situacion_id: '1',
    };
    // Hacemos la llamada a la ruta de la api
    await api
      .put('/AcceptarSolicitudPrivado/7105')
      .send(newSolicitud_1)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    let newSolicitud_2 = {
      usuario_id: '8345',
      situacion_id: '2',
    };
    // Hacemos la llamada a la ruta de la api
    const response = await api
      .put('/AcceptarSolicitudPrivado/7105')
      .send(newSolicitud_2)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const idCursoUsuario = response.body.curso_id;
    // Borramos el dato de prueba insertado
    await pool.query(
      'DELETE FROM curso_usuario WHERE curso_id = ? and usuario_id = ?',
      [idCursoUsuario, newSolicitud_1.usuario_id]
    );
  });
});

//Declaracion de un describe de tests
describe('Suggestions test', () => {
  //Declaracion del test
  test('Get all suggestions', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/suggestions')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get one suggestions', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/suggestions/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get votes for user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarVotosUsuario/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get all votes sugerences', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarSugerenciasVotos')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('Get all max votes sugerences', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarSugerenciasMasVotos')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

//Declaracion de un describe de tests
// Suit de pruebas para Curso - Usuario
// Prueba para verificar la inscripcion de un alumno a un curso
describe('USERS tests', () => {
  //Declaracion del test
  test('Get all users', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  //Declaracion del test
  test('Get one user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/users/35')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('Get one user fail', async () => {
    //Hacemos la llamada a la ruta de la api
    await api.get('/users/123').expect(500);
  });

  //Declaracion del test
  test('Edit one user', async () => {
    const editUser = {
      usuario_nombre: 'pruebatest',
      usuario_apellidos: 'pruebatest',
      url: 'pruebatesturl',
      correo: 'prueba@prueba.com',
    };
    //Hacemos la llamada a la ruta de la api
    await api
      .post('/useredit/215')
      .send(editUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

//Declaracion de un describe de tests
describe('Tasks tests', () => {
  //Declaracion del test
  test('Get tareas curso', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarTareasCurso/4935')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('List taks curso', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/list-task/4935')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

// Declaracion de un describe de tests
describe('Test de Curso -Usuario', () => {
  // Declaracion del test
  test('POST /coursesUsers', async () => {
    let nuevo = {
      curso_id: 435,
      correo: 'dfvaler@gmail.com',
    };
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .post('/coursesUsers')
      .send(nuevo)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const idUsuario = response.body.usuario_id;
    // Borramos el dato de prueba insertado
    await pool.query(
      'DELETE FROM curso_usuario WHERE usuario_id = ? and curso_id = ?',
      [idUsuario, nuevo.curso_id]
    );
  });
  // Prueba para verificar la inscripcion de un alumno a un curso
  test('POST /aceptarInvitacionDeProfesor ', async () => {
    let nuevo = {
      usuario_id: 1735,
      curso_id: 4935,
      situacion_id: 5,
    };
    await api
      .post('/aceptarInvitacionDeProfesor ')
      .send(nuevo)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });
  // Prueba para verificar la aceptacion de una solicitud de acceso
  test('POST /aceptarSolicitudAcceso', async () => {
    let nuevo = {
      usuario_id: 1735,
      curso_id: 6025,
      situacion_id: 1,
    };
    await api
      .post('/aceptarSolicitudAcceso')
      .send(nuevo)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

//Declaracion de un describe de tests
//Declaracion del test
// Suit de pruebas para Notificaciones
describe('Test de Notificaciones', () => {
  // Prueba para verficar la crecion de una notificacion
  test('POST /notificacion', async () => {
    let nuevaNotificacion = {
      tarea_asignada_id: 5,
      notificacion: 'Tarea 3',
    };
    //Hacemos la llamada a la ruta de la api
    await api
      .post('/notificacion')
      .send(nuevaNotificacion)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  //Declaracion del test
  test('GET /listarNotificacionesPorUsuario', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarNotificacionesPorUsuario/1635')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});
