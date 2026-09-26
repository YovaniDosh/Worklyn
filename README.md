# Worklyn

Worklyn es una aplicación web sencilla para organizar tareas desde el navegador. Permite asignar prioridad y fecha límite, encontrar y ordenar tareas, consultar un resumen del progreso y guardar o restaurar los datos mediante archivos JSON.

Está construida con HTML, CSS y JavaScript nativo usando módulos ES. No requiere instalación de dependencias ni un proceso de compilación.

## Funciones

- Crear, editar, completar, restaurar y eliminar tareas.
- Asignar prioridad alta, media o baja y una fecha límite.
- Buscar por nombre, con coincidencias que ignoran mayúsculas y acentos.
- Filtrar tareas por estado y ordenarlas por nombre, prioridad o fecha límite.
- Consultar el contador y las estadísticas de tareas; las fechas vencidas se detectan automáticamente.
- Cambiar entre tema claro y oscuro, con preferencia guardada en el navegador.
- Exportar las tareas a JSON e importar un respaldo validado. La importación reemplaza la lista actual después de pedir confirmación.
- Usar diálogos accesibles por teclado, avisos visuales y una interfaz adaptable a móvil, tableta y escritorio.

## Clona el proyecto :)

Clona el repositorio y entra en la carpeta:

```bash
git clone https://github.com/YovaniDosh/Worklyn.git
cd Worklyn
```

Puedes abrir `index.html` con la extensión Live Server de Visual Studio Code. Un servidor local permite cargar los módulos ES de forma fiable.


## Tecnologías

- HTML5 y CSS3
- JavaScript nativo con módulos ES
- `localStorage` y API del navegador

## Estructura

```text
Worklyn/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js          # Inicialización y coordinación de la interfaz
│   ├── tasks.js        # Operaciones sobre tareas
│   ├── ui.js           # Renderizado de tareas, contador y estadísticas
│   ├── storage.js      # Persistencia local
│   ├── filters.js      # Búsqueda, filtros y ordenamiento
│   ├── stats.js        # Cálculo de estadísticas
│   ├── theme.js        # Tema claro y oscuro
│   ├── import.js       # Lectura y validación de respaldos
│   ├── export.js       # Generación de respaldos
│   ├── events.js       # Registro de eventos
│   ├── dateUtils.js    # Utilidades de fechas
│   ├── debounce.js     # Retardo de búsqueda
│   ├── toast.js        # Notificaciones
│   └── constants.js    # Valores y mensajes compartidos
├── icon/
├── docs/
│   ├── architecture.md
│   └── screenshots/
└── README.md
```

Consulta [docs/architecture.md](docs/architecture.md) para más detalles de la arquitectura. Las capturas disponibles están en [docs/screenshots](docs/screenshots/).


## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE).
