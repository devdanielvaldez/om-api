const quoteData = require("../data/quote");

function getQuote(startPort, endPort, containerType, quantity) {
    // Filtrar las cotizaciones que coincidan con los parámetros
    const quotes = quoteData.data.filter(
        quote => quote.start === startPort && quote.end === endPort && quote.type === containerType
    );

    // Si no hay resultados, mostrar un mensaje
    if (quotes.length === 0) {
        return "No se encontraron cotizaciones para los parámetros ingresados.";
    }

    // Calcular el precio total para cada cotización
    return quotes.map(quote => {
        const unitPrice = parseFloat(quote.price.replace(/[^0-9.]/g, '')); // Convertir el precio a número
        const currency = quote.price.replace(/[0-9.,\s]/g, ''); // Extraer la moneda (USD, EUR, etc.)
        const totalPrice = unitPrice * quantity; // Calcular el precio total
        return `Empresa: ${quote.business},\nPrecio Unitario: ${quote.price},\nCantidad: ${quantity},\nPrecio Total: ${currency} ${totalPrice.toFixed(2)}`;
    }).join('\n\n');
}

const requestQuote = (req, res) => {
    const {sPort, ePort, type, quantity} = req.body;

    const data = getQuote(sPort, ePort, type, quantity);

    res.status(200).json({ result: data });
}

module.exports = {requestQuote}