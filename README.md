

# Configuración de truffle

Se debe especificar en el fichero ```truffle-config.js``` la configuración correspondiente para indicar a truffle la versión del compilador a utilizar y dónde se encuentra ubicada la red privada Ganache.
```js
module.exports = {
  networks: {
    development: {
      // Desktop ganache
      // host: "172.31.64.1",
      // Laptop ganache
      host: "192.168.1.37",
      port: 7545,
      network_id: "5777"
    }
  },
  compilers: {
    solc: {
      version: "0.8.19"
    }
  }
}
```
# Variables de entorno necesarias

Se debe crear un fichero `.env` dentro de la carpeta `api` que contenga las variables de entorno siguientes:

```bash
# Estos son valores de ejemplo
PORT=8000
DATABASE_URI='mongodb://localhost:27017/solodrive'
JWT_SECRET='some_secret'
```

Se debe crear también un fichero `.env` dentro de la carpeta `front-app` que contenga las variables de entorno siguientes:

```bash
# Una vez desplegado el contrato, aquí se pondría la dirección del mismo
VITE_CAR_RENTAL_CONTRACT_ADDRESS="0x..."
```

