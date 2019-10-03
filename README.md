# Laboratorio 6 - ARSW
## Empezando
Se debe de clonar el proyecto, para esto utilizaremos el comando git clone. ubíquese la carpeta a guardar el proyecto y escriba el siguiente comando en la terminal:
 
 ### git clone https://github.com/luis572/ARSW-lab5
Una vez clonado, ubicarse en la carpeta del proyecto. al ingresar podra ejecutarlo de forma inmediata mediante el comando. 
```
gradle bootRun
```
## Prerrequisitos
Se debe tener instalados los siguientes programas en nuestro sistema operativo: 
- Gradle 
- Git
- Java
## Contenido 
### Frontend Views
Creamos la pagina index.html con todo lo necesario para la estructura basica que debe llevar la pagina 
```html
<!DOCTYPE html>
<html>

<head>
  <title>home</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script src="/webjars/jquery/3.1.0/jquery.min.js"></script>
  <script src="/webjars/bootstrap/4.1.2/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

</head>
<body>
  <h1>Blueprints</h1>
  <input type="text" id="autor"> </input>
  <button type="submit" id="ingresar" onclick="run()" )>
    Get Blueprints
  </button>
  <div class="row">
    <div class="col-md-6">
      <h2><i id="authorname"></i> Blueprints:</h2>
    </div>
    <div class="col-md-6">
      <h2> Current blueprint:<i id="blueprintname"></i> </h2>
    </div>
  </div>
  
  <div class="row">
    <div class="col-md-6">
      <table style="width:100%" id="table" class="table">
        <tr>
          <th>Blueprints name</th>
          <th>number of projects</th>
          <th>open blueprint</th>
        </tr>
        <tbody id="cuerpo"></tbody>
      </table>


    </div>
    <div class="col-xl-6">
      <canvas id="myCanvas" width="500px" height="300px" style="border:1px solid #000000;">
      </canvas>
    </div>
  </div>
	
```
Y en el navegador: 

![alt text](https://github.com/luis572/ARSW-lab5/blob/master/img/Estructura-basica.PNG "Estructura basica")

### Frontend Logic
Se agregaron los modulos app.js y apimock.js para realizar la logica de los metodos necesarios para poder visualizar los blueprints y planes de cada autor.
```html
<script src="js/apimock.js"></script>
<script src="js/app.js"></script>
```
En apimock.js tenemos una lista con los autores y blueprints "quemados" los cuales son filtrados por el nombre que sea consultado. 
apimock.js

```javascript
apimock=(function(){
	var mockdata=[];
   mockdata["author2"]=[{"author":"author2","points":[{"x":20,"y":1},{"x":110,"y":15},{"x":0,"y":1},{"x":8,"y":9},{"x":10,"y":15}],"name":"Blues"},{"author":"author2","points":[{"x":20,"y":1},{"x":110,"y":15},{"x":0,"y":1},{"x":8,"y":9},{"x":50,"y":250}],"name":"Blu"}];
   mockdata["author1"]=[{"author":"author1","points":[{"x":120,"y":15},{"x":5,"y":1},{"x":8,"y":4},{"x":10,"y":15}],"name":"Blueprits"}];
   return {
	getBlueprintsByAuthor:function(name,callback){
			return callback(
				mockdata[name]
			);

		}
	
	};	
})();
```
En app.js construimos el metodo run() el cual es activado con el evento on-click del boton get Blueprints, este metodo se encarga de llamar a getBlueprintsByAuthor del modulo apimock.js para traer los blueprints de el autor 

```javascript
function run() {
	var nameAutor = $('#autor').val();
	generarTable(nameAutor,api.getBlueprintsByAuthor(nameAutor,getByAuthor));
}
```

y le pasa a generarTable estos datos para poder agregar cada blueprint a la tabla.

```javascript
function generarTable(name,funcion) {
	$("#cuerpo").html("");
	var total=0
	$("#totalPoints").text(total)
	funcion.map(function(f) {
		$('#cuerpo')
			.append(
			  `<tr>
				<td>`+f.name+`</td>
				<td>`+f.points+`</td>`+
				"<td><form><button type='button' class='btn btn-primary' onclick='graficarPlano( \"" +
              name +
              '" , "' +
              f.name +
              "\")'>Open</button></form></td>"+
			  `</tr>`
			);
			total+=f.points
	});
	$("#totalPoints").text(total)
}
```

Finalmente el resultado es el siguiente: 

![alt text](https://github.com/luis572/ARSW-lab5/blob/master/img/apimock.PNG "Apimock")


### Next Week

Ahora agregamos la funcionalidad para que se pueda ver un blueprint graficado en el canvas, agregamos la funcion graficarPlano la cual es activada cuando el boton Open es clickeado 

```javascript
function graficarPlano(nameAutor, namePlano){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath()
	ctx.clearRect(0, 0, c.width, c.height);
	console.log(c.width, c.height)
	funcion=getBlueprintsByNameAndAuthor(api.getBlueprintsByAuthor(nameAutor,getBlueprints),namePlano);
	funcion.map(function(f){
		console.log(f.x)
		ctx.lineTo(f.x,f.y);
		ctx.stroke();
	})
	ctx.closePath()
	console.log(getBlueprintsByNameAndAuthor(api.getBlueprintsByAuthor(nameAutor,getBlueprints),namePlano))
	$("#blueprintname").text(namePlano)
}
```
Y en el navegador podemos visualizar nuestro plano graficado en el canvas: 

![alt text](https://github.com/luis572/ARSW-lab5/blob/master/img/canvas.PNG "canvas")

Ahora se agrega el modulo apiclient.js para que en vez de consultar los datos qumeados de apiclient consulte los datos que estan en el API REST. Tuvimos un problema con este modulo y es que para que se puedan desplegar los blueprints hay que clickear dos veces el boton get blueprints. 

apliclient.js

```javascript
const Url = 'http://localhost:8080/blueprints/';
apiclient = (function () {
    var f=[]
    return {
        getBlueprintsByAuthor: function (name, callback) {
                $.get(Url+name,function(data){
                    f=data;
                });
                return callback(f)
        }
    };
})();
```
Y en app.js configuramos el modulo para que para cambiar entre apiclient y apimock se pueda hacer solo cambiando una linea de codigo. 

app.js: 

```javascript
var api=apimock
```
Consultado los blueprints del API REST: 

![alt text](https://github.com/luis572/ARSW-lab5/blob/master/img/apirest.PNG "Apirest")


## Construido en
- Gradle: Es una herramienta que permite la automatización de compilación de código abierto, no solo de java sino de otra gran variedad de lenguajes.

## Autor  
- Luis Fernando Pizza Gamba https://github.com/luis572
- Diego Alejandro Corredor Tolosa https://github.com/diego2097


## Licencia 
- GNU General Public License v3.0

