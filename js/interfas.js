// Funciones para actualizar la interfaz

// Actualizar los balances en el header
function actualizarBalance() {
    const totalIngresos = calcularTotalIngresos();
    const totalGastos = calcularTotalGastos();
    const balance = calcularBalance();

    document.getElementById('totalIngresos').textContent = `$${totalIngresos.toFixed(2)}`;
    document.getElementById('totalGastos').textContent = `$${totalGastos.toFixed(2)}`;
    document.getElementById('balanceTotal').textContent = `$${balance.toFixed(2)}`;
}

// Mostrar todas las transacciones
function mostrarTransacciones() {
    const contenedor = document.getElementById('listaTransacciones');
    const listaTransacciones = obtenerTransacciones();

    contenedor.innerHTML = '';

    if (listaTransacciones.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">No hay transacciones registradas.</p>';
        return;
    }

    listaTransacciones.forEach(transaccion => {
        const div = document.createElement('div');
        div.className = `transaccion-item ${transaccion.tipo}`;

        div.innerHTML = `
            <div class="transaccion-info">
                <span class="transaccion-tipo">${transaccion.tipo.toUpperCase()}</span>
                <span class="transaccion-descripcion">${transaccion.descripcion}</span>
                <span class="transaccion-categoria">${transaccion.categoria}</span>
                <span class="transaccion-fecha">${transaccion.fecha}</span>
            </div>
            <div class="transaccion-acciones">
                <span class="transaccion-monto">$${transaccion.monto.toFixed(2)}</span>
                <button class="btn-eliminar" onclick="confirmarEliminar(${transaccion.id})">🗑️</button>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

// Confirmar antes de eliminar una transacción
function confirmarEliminar(id) {
    Swal.fire({
        title: '¿Eliminar transacción?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarTransaccion(id);
            mostrarTransacciones();
            actualizarBalance();
            actualizarGraficos();

            Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                text: 'La transacción fue eliminada',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Actualizar interfaz completa
function actualizarUI() {
    mostrarTransacciones();
    actualizarBalance();
    actualizarGraficos();
}

// Mostrar transacciones filtradas
function mostrarTransaccionesFiltradas(transaccionesFiltradas) {
    const contenedor = document.getElementById('listaTransacciones');

    contenedor.innerHTML = '';

    if (transaccionesFiltradas.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">No hay transacciones que coincidan con los filtros.</p>';
        return;
    }

    transaccionesFiltradas.forEach(transaccion => {
        const div = document.createElement('div');
        div.className = `transaccion-item ${transaccion.tipo}`;

        div.innerHTML = `
            <div class="transaccion-info">
                <span class="transaccion-tipo">${transaccion.tipo.toUpperCase()}</span>
                <span class="transaccion-descripcion">${transaccion.descripcion}</span>
                <span class="transaccion-categoria">${transaccion.categoria}</span>
                <span class="transaccion-fecha">${transaccion.fecha}</span>
            </div>
            <div class="transaccion-acciones">
                <span class="transaccion-monto">$${transaccion.monto.toFixed(2)}</span>
                <button class="btn-eliminar" onclick="confirmarEliminar(${transaccion.id})">🗑️</button>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

// Variables para los gráficos
let graficoBalance = null;
let graficoCategoria = null;

// Gráfico de balance (ingresos vs gastos)
function actualizarGraficoBalance() {
    const ctx = document.getElementById('graficoBalance');
    if (!ctx) return;

    const ingresos = calcularTotalIngresos();
    const gastos = calcularTotalGastos();

    if (graficoBalance) {
        graficoBalance.destroy();
    }

    graficoBalance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                data: [ingresos, gastos],
                backgroundColor: ['#27ae60', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Gráfico de gastos por categoría
function actualizarGraficoCategoria() {
    const ctx = document.getElementById('graficoCategoria');
    if (!ctx) return;

    const transaccionesGastos = obtenerTransacciones().filter(t => t.tipo === 'gasto');

    // Agrupar gastos por categoría
    const gastosPorCategoria = {};
    transaccionesGastos.forEach(t => {
        if (gastosPorCategoria[t.categoria]) {
            gastosPorCategoria[t.categoria] += t.monto;
        } else {
            gastosPorCategoria[t.categoria] = t.monto;
        }
    });

    const categorias = Object.keys(gastosPorCategoria);
    const montos = Object.values(gastosPorCategoria);

    if (graficoCategoria) {
        graficoCategoria.destroy();
    }

    graficoCategoria = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categorias,
            datasets: [{
                label: 'Gastos',
                data: montos,
                backgroundColor: '#16a085'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Actualizar todos los gráficos
function actualizarGraficos() {
    actualizarGraficoBalance();
    actualizarGraficoCategoria();
}
