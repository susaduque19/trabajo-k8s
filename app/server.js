const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint de negocio
app.get('/api/products', (req, res) => {
    res.json([
        { id: 1, name: "Teclado", stock: 15 },
        { id: 2, name: "Monitor 4K", stock: 8 },
        { id: 3, name: "Mouse Inalámbrico", stock: 22 }
    ]);
});

// Endpoint de Arquitectura / Resiliencia (Liveness/Readiness Probe para K8s)
app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Inventario corriendo en el puerto ${PORT}`);
});