// Lógica de datos - manejo de transacciones

let transacciones = [];

// Agregar una nueva transacción
function agregarTransaccion(tipo, descripcion, monto, categoria, fecha) {
    const nuevaTransaccion = {
        id: Date.now(),
        tipo: tipo,
        descripcion: descripcion,
        monto: parseFloat(monto),
        categoria: categoria,
        fecha: fecha
    };

    transacciones.push(nuevaTransaccion);
    guardarEnLocalStorage();
    return nuevaTransaccion;
}

// Calcular total de ingresos
function calcularTotalIngresos() {
    return transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((suma, t) => suma + t.monto, 0);
}

// Calcular total de gastos
function calcularTotalGastos() {
    return transacciones
        .filter(t => t.tipo === 'gasto')
        .reduce((suma, t) => suma + t.monto, 0);
}

// Calcular balance (ingresos - gastos)
function calcularBalance() {
    const ingresos = calcularTotalIngresos();
    const gastos = calcularTotalGastos();
    return ingresos - gastos;
}

// Eliminar transacción por ID
function eliminarTransaccion(id) {
    transacciones = transacciones.filter(t => t.id !== id);
    guardarEnLocalStorage();
}

// Guardar en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

// Cargar desde localStorage
function cargarDesdeLocalStorage() {
    const datos = localStorage.getItem('transacciones');
    if (datos) {
        transacciones = JSON.parse(datos);
    }
}

// Obtener todas las transacciones
function obtenerTransacciones() {
    return transacciones;
}
