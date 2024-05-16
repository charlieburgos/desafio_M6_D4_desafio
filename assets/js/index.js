// IMPORTAMOS LOS MODULOS DE NODE NECESARIOS

import express from 'express';
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import chalk from "chalk";

//crea servidor
const app = express();
const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Servidor se esta ejecutando en puerto:${PORT}`);
})
//array de datos consultados
let datos = [];

//modulo para indicar como se mostraran los datos obtenidos
const lista = (array) => {
 
    let templateLista = `
  <ol>
  `
  array.forEach(datos => {
    templateLista += //asignamos el orden con el que se mostrara en el html
      `
      <li>Nombre: ${datos.first} - Apellido: ${datos.last} - ID: ${datos.id} - TimeStamp: ${datos.time}</li>
      `
      //mostramos en consola fondo blanco letras azules
      console.log(chalk.bgWhite.blue(`Nombre: ${datos.first} - Apellido: ${datos.last} - ID: ${datos.id} - TimeStamp: ${datos.time} - Genero: ${datos.gender}`))
  })
  templateLista += `
  </ol>`
  
  return templateLista;
}
//app que realizara la consulta 
const fetcher = async () => {
  app.get('/usuarios', async (req, res) => {
        //con axios llamamos a la api para tomar los datos
      const { data } = await axios.get('https://randomuser.me/api/?results=10')

      const { name: { first, last }, gender } = data.results[0]
      //usamos uuid para asignar id unica
      const id = uuidv4().slice(28)
      //usamos moment para tomar la fecha del momento e indicamos formato en que se presentara
      const time = moment().format('MMMM DD YYYY hh:mm:ss a')
      datos.push({ first, last, gender, id, time })
      //usamos Lodash para separar los datos con .partition
      const datosOrder = _.partition(datos, ({ gender }) => gender == 'female');
      console.log(datosOrder[0]) //mostramos por consola array de mujeres
      console.log(datosOrder[0].length) //mostramos la cantidad de datos dentro del array mujeres
      console.log(datosOrder[1]) //mostramos por consola el array de hombres
      console.log(datosOrder[1].length)  //mostramos la cantidad de datos dentro del array hombres

      //injectamos en html los datos solicitados
      let template = `
      <h4>Total Mujeres ${datosOrder[0].length}</h4>
          ${lista(datosOrder[0])}        
      <h4>Total Hombres ${datosOrder[1].length}</h4>
          ${lista(datosOrder[1])}        
      `
      res.send(template)
  })
}

fetcher()