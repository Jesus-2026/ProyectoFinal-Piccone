// Coordinador principal - eventos y configuración inicial

// Inicialización cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    cargarDesdeLocalStorage();
    actualizarUI();
    configurarFormulario();
    cargarCategorias();
    precargarFecha();
    configurarFiltros();
});

// Configurar el formulario de transacciones
function configurarFormulario() {
    const form = document.getElementById('transaccionForm');

    form.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const tipo = document.getElementById('tipo').value;
        const descripcion = document.getElementById('descripcion').value;
        const monto = document.getElementById('monto').value;
        const categoria = document.getElementById('categoria').value;
        const fecha = document.getElementById('fecha').value;

        // Validación básica
        if (tipo === '--Seleccionar--' || !descripcion || !monto || !categoria || !fecha) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos',
                confirmButtonColor: '#667eea'
            });
            return;
        }

        agregarTransaccion(tipo, descripcion, monto, categoria, fecha);
        actualizarUI();
        form.reset();
        precargarFecha();

        Swal.fire({
            icon: 'success',
            title: '¡Transacción agregada!',
            text: 'La transacción se guardó correctamente',
            timer: 2000,
            showConfirmButton: false
        });
    });
}

// Cargar categorías desde el JSON
async function cargarCategorias() {
    try {
        const respuesta = await fetch('data/categorias.json');
        const categorias = await respuesta.json();
        const selectCategoria = document.getElementById('categoria');

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            selectCategoria.appendChild(option);
        });

    } catch (error) {
        // Si falla, agregamos categorías por defecto
        const categoriasDefault = ['Alimentación', 'Transporte', 'Servicios', 'Salario', 'Otros'];
        const selectCategoria = document.getElementById('categoria');

        categoriasDefault.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            selectCategoria.appendChild(option);
        });
    }

    cargarCategoriasEnFiltro();
}

// Precargar la fecha de hoy en el formulario
function precargarFecha() {
    const inputFecha = document.getElementById('fecha');
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.value = hoy;
}

// Cargar categorías en el filtro
async function cargarCategoriasEnFiltro() {
    try {
        const respuesta = await fetch('data/categorias.json');
        const categorias = await respuesta.json();
        const selectFiltro = document.getElementById('filtroCategoria');

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            selectFiltro.appendChild(option);
        });
    } catch (error) {
        // Si falla el fetch, el filtro simplemente no tendrá categorías
    }
}

// Configurar eventos de filtros
function configurarFiltros() {
    const filtroTipo = document.getElementById('filtroTipo');
    const filtroCategoria = document.getElementById('filtroCategoria');

    filtroTipo.addEventListener('change', aplicarFiltros);
    filtroCategoria.addEventListener('change', aplicarFiltros);
}

// Aplicar filtros a las transacciones
function aplicarFiltros() {
    const tipoSeleccionado = document.getElementById('filtroTipo').value;
    const categoriaSeleccionada = document.getElementById('filtroCategoria').value;

    let transaccionesFiltradas = obtenerTransacciones();

    if (tipoSeleccionado !== 'todos') {
        transaccionesFiltradas = transaccionesFiltradas.filter(t => t.tipo === tipoSeleccionado);
    }

    if (categoriaSeleccionada !== 'todas') {
        transaccionesFiltradas = transaccionesFiltradas.filter(t => t.categoria === categoriaSeleccionada);
    }

    mostrarTransaccionesFiltradas(transaccionesFiltradas);
}
