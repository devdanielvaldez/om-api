const fs = require('fs');
const path = require('path');

function listPorts() {
    // Ruta al archivo JSON (ajusta la ruta según sea necesario)
    const filePath = path.join(__dirname, 'ports.json');

    // Retornar una promesa
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo:', err);
                return reject(err);
            }

            try {
                // Parsear el JSON
                const ports = JSON.parse(data);

                // Iterar sobre los puertos y crear una lista
                const portList = Object.entries(ports).map(([key, value]) => ({
                    code: key,
                    name: value.name
                }));

                // Resolver la promesa con la lista de puertos
                resolve(portList);
            } catch (parseError) {
                console.error('Error al parsear el JSON:', parseError);
                reject(parseError);
            }
        });
    });
}

const getPorts = async (req, res) => {
    try {
        const data = await listPorts(); // Esperar a que se resuelva la promesa
        console.log(data);
        return res.json({
            data: data
        });
    } catch (error) {
        console.error('Error al obtener los puertos:', error);
        return res.status(500).json({
            error: 'Error al obtener los puertos'
        });
    }
}

module.exports = getPorts;
