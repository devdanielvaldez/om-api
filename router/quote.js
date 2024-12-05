const quoteData = require("../data/quote");
const axios = require('axios');
async function getQuote(startPort, endPort, containerType, quantity) {
    // Filtrar las cotizaciones que coincidan con los parámetros
    const quotes = quoteData.data.filter(
        quote => quote.start === startPort && quote.end === endPort && quote.type === containerType
    );

    // Si no hay resultados, mostrar un mensaje
    if (quotes.length === 0) {
        const body = {
            "origin": {
                "port": {
                    "portIsoCode": startPort.toUpperCase()
                }
            },
            "destination": {
                "port": {
                    "portIsoCode": endPort.toUpperCase()
                }
            },
            "currency": "USD",
            "lang": "en_US",
            "containers": [
                {
                    "type": "DV" + containerType,
                    "quantity": +quantity
                }
            ],
            "optionalBillingItems": []
        };
        const response = await axios.post('https://my.icontainers.com/api/v2.1/quotes/fcl/customer', body, {
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoiaGVsbG9AZGFuaWVsLXZhbGRlei5jb20iLCJwaG9uZV9udW1iZXIiOiIrMTgwOTgxMjgzNTMiLCJjb250YWN0X25hbWUiOiJEYW5pZWwgIiwiY29udGFjdF9zdXJuYW1lIjoiIiwibGVnYWxfbmFtZSI6IkRhcmtJbm5vdmF0aW9ucyIsImlzX2NvbXBhbnkiOnRydWUsImJhY2tlbmRfZXh0ZXJuYWxfdXNlcl9pZCI6OTMwMzY2LCJiYWNrZW5kX2N1c3RvbWVyX2lkIjoyNjM5MDA0LCJiYWNrZW5kX2JyYW5jaF9pZCI6MywiY3VzdG9tZXJfdHlwZSI6IlBBUlRORVIiLCJpc190ZXN0IjpmYWxzZSwiYnJhbmQiOiJpQ29udGFpbmVycyIsInBhcnRuZXIiOm51bGwsInByZWZlcnJlZF9sYW5ndWFnZSI6ImVuX1VTIiwicHJlZmVycmVkX2N1cnJlbmN5IjoiVVNEIiwiaW1wZXJzb25hdGVkX2J5IjpudWxsLCJjcmVhdGVkX2F0IjoiMjAyNC0xMS0yOFQxNzozNzowMyswMDowMCIsInNob3dfY2FycmllcnMiOmZhbHNlLCJzYyI6ImZhIn0sImV4cGlyZWRfYXQiOjE3MzU0MDc0NDUsInNpZ25hdHVyZSI6ImF1dGgtc2VydmljZSIsInZlcnNpb24iOiIxLjkiLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24ifQ.BcNKrZH-eYS9UjCjcfdyGAwPM3-mT5XDNKJyRp04NurUUG85SDnLKc0PFRopuzPjcF3rKnXPG3YwUssNuCjCdMBf4kT3BhPCiiInpUI-I99kHPl-1I-wmYm037T9jf9NU_tFFboQvtXfGyaA3cnMgmQ_auGjWoPWBo9y5Tx4nrFmGnkvraK7Yxmz4uEG-_jPmQO6ozvgfsIAPU7_zrrhvICrIEfnTrmZQf4i7_2_12RLP-YkGefhMt7f0pMD9zJFjaHKp1AMAgRt7Z889YDxumA0bNCUnkrlONho65b6yy8Gwg5wA73quNpLms768Ux21uGC_mA0-pabWwHwtlidf1yzxpu7WFxVIYwGHMqP0SOIDNcfX00M623zDAxB-_kPhzJNJOGD80zh2tfSWtnMu5gPgAyCvqosbrMSSQ6qAUN6dKRTjxCPXFVi0pPhP8Qgz1er9q10bUaZQ7ZXsn2C5qCLqbBMZTcaOmEdtT1HYdfU66pz6A0cD5r2cCuL6GEucgd_ONS8ldWj-pZeN_f4LfN_DzTzQkx84H2Q10sfezV3pvyiYHMURDY1hhc2F_pOt4EwHyju9ir5i8De9FxwMLiszAgmCDwD0rtoTxsRz4nye9t58EBOlLf8dQeNlTcWwJ8Lb7qsZnwbP2tuhCB4_4g_vxKngUnaqC-S36YE1XE',
                'Referer': 'https://my.icontainers.com/'
            }
        })

        return response.data.data.rates.map(rate => {
            // Busca el billing item que tiene el nombre "Pre-Carriage"
            const preCarriageItem = rate.billingItems.find(item => item.name === "Pre-Carriage");
            
            // Si no se encuentra "Pre-Carriage", busca "Freight"
            const freightItem = preCarriageItem ? null : rate.billingItems.find(item => item.name === "Freight");
        
            // Determina el precio total a mostrar
            const totalPrice = preCarriageItem ? preCarriageItem.price.total : freightItem ? freightItem.price.total : null;
        
            return `Empresa: ${rate.suppliersInformation?.freight?.name},\nPrecio Total: ${totalPrice}\n\n`;
        }).filter(item => item !== null);

    }

    // Calcular el precio total para cada cotización
    return quotes.map(quote => {
        const unitPrice = parseFloat(quote.price.replace(/[^0-9.]/g, '')); // Convertir el precio a número
        const currency = quote.price.replace(/[0-9.,\s]/g, ''); // Extraer la moneda (USD, EUR, etc.)
        const totalPrice = unitPrice * quantity; // Calcular el precio total

        return `Empresa: ${quote.business},\nPrecio Total: ${currency} ${totalPrice.toFixed(2)}`;
    }).join('\n\n');
}

const requestQuote = async (req, res) => {
    const {sPort, ePort, type, quantity} = req.body;

    const data = await getQuote(sPort, ePort, type, quantity);

    res.status(200).json({ result: data });
}

module.exports = {requestQuote}