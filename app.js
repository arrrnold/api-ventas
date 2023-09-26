const express = require('express')
var bodyParser = require('body-parser')
const { response } = require("express");
const app = express();
const puerto = process.env.PORT || 3000;


// arreglo de objetos de ventas
let ventas = [
	{ id: 1, fecha: "21-3-23", id_del_cliente: 645, total_de_venta: 12.5 },
	{ id: 2, fecha: "22-3-23", id_del_cliente: 246, total_de_venta: 400.5 },
	{ id: 3, fecha: "23-3-23", id_del_cliente: 221, total_de_venta: 5000.5 },
	{ id: 4, fecha: "24-3-23", id_del_cliente: 162, total_de_venta: 123.5 },
	{ id: 5, fecha: "25-3-23", id_del_cliente: 172, total_de_venta: 300.5 },
	{ id: 6, fecha: "26-3-23", id_del_cliente: 122, total_de_venta: 756.5 },
	{ id: 7, fecha: "27-3-23", id_del_cliente: 712, total_de_venta: 453.5 },
	{ id: 8, fecha: "28-3-23", id_del_cliente: 512, total_de_venta: 979.5 },
	{ id: 9, fecha: "29-3-23", id_del_cliente: 192, total_de_venta: 455.5 },
	{ id: 10, fecha: "30-3-23", id_del_cliente: 912, total_de_venta: 234.5 }];


// consultas

app.get('/socios/v1/ventas', (req, res) => {
	//Obtener todas las ventas
	if (ventas.length === 0) {
		return res.status(404).json({
			estado: 0,
			mensaje: 'No hay ventas',
			ventas: ventas
		})
	} else {
		return res.json({
			ventas: ventas,
			estado: 1,
			mensaje: 'ventas obtenidas con exito'
		})
	}


	res.send('Obtener todas las ventas')
})

app.get('/socios/v1/ventas/:id', (req, res) => {
	const id = req.params.id;
	// comparar venta por venta cual coincide con el ID
	const venta = ventas.find(venta => venta.id == id);
	if (venta) { // si se encontro una venta
		res.status(200).json({
			estado: 1,
			mensaje: "venta encontrada",
			venta: venta,
		});
	} else { // si no se encuentra
		res.status(404).json({
			estado: 0,
			mensaje: "venta no encontrada",
		});
	}
});

const jsonParser = bodyParser.json(); //middleware

app.use(jsonParser); //Utilizar middleware

app.post('/socios/v1/ventas', jsonParser, (req, res) => {
	// crear un recurso (venta)
	const { fecha, id_del_cliente, total_de_venta } = req.body; //Destructuring de objetos
	const id = Math.round(Math.random() * 1000); // generar el ID

	if (fecha == undefined || id_del_cliente == undefined || total_de_venta == undefined) {
		res.status(400).json({
			estado: 0,
			mensaje: "Faltan parametros en la solicitud",
		});
	} else {

		const venta = { id: id, fecha: fecha, id_del_cliente: id_del_cliente, total_de_venta: total_de_venta };
		const longitudInicial = ventas.length;
		ventas.push(ventas);

		// verificar la longitud del array de ventas para ver si se agrego una nueva
		if (ventas.length > longitudInicial) {
			res.status(201).json({
				estado: 1,
				mensaje: "Venta creada",
				venta: venta
			});
		} else {
			res.status(500).json({
				estado: 0,
				mensaje: "Ocurrio un error desconocido"
			});
		}
	}

})
app.put('/socios/v1/ventas/:id', (req, res) => {
	// Actualizar una Venta
	const { id } = req.params;
	const { fecha, id_del_cliente, total_de_venta } = req.body; //Destructuring de objetos

	if (fecha == undefined || id_del_cliente == undefined || total_de_venta == undefined) {
		res.status(400).json({
			estado: 0,
			mensaje: "Bad Request (faltan parámetros)"
		});
	} else {
		const posActualizar = ventas.findIndex(venta => venta.id == id);

		if (posActualizar !== -1) {
			// Si se encontró el ID
			ventas[posActualizar].fecha = fecha;
			ventas[posActualizar].id_del_cliente = id_del_cliente;
			ventas[posActualizar].total_de_venta = total_de_venta;


			res.status(200).json({
				estado: 1,
				mensaje: "Venta actualizada",
				venta: ventas[posActualizar], // Devolver la Venta actualizada
			});
		} else {
			res.status(404).json({
				estado: 0,
				mensaje: "ID no encontrado"
			});
		}
	}
});

app.delete('/socios/v1/ventas/:id', (req, res) => {
	// Eliminar una venta
	const { id } = req.params;
	const indiceEliminar = ventas.findIndex(venta => venta.id == id);

	if (indiceEliminar !== -1) {
		// Se borra la venta
		ventas.splice(indiceEliminar, 1);
		res.status(200).json({
			estado: 1,
			mensaje: "Venta borrada correctamente"
		});
	} else {
		// No se encuentra la Venta
		res.status(404).json({
			estado: 0,
			mensaje: "Venta no encontrada"
		});
	}
});

app.listen(puerto, () => {
	console.log(`Servidor corriendo en el puerto ${puerto}`);
})
