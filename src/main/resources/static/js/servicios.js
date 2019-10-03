const Url='http://localhost:8080/blueprints/';
$("#ingresar").click(function(){
    var l=Url+$("#autor").val()
    $("#cuerpo").html(""); 
    $("#totalPoints").text("")
    var total=0
    $.get(l,function(data,status){
        for (var i in data) {
            total=total+Object.keys(data[i].points).length
            var tr = `<tr>
            <td>`+data[i].name+`</td>
            <td>`+Object.keys(data[i].points).length+`</td>
            <td>`+data[i]+`</td>
          </tr>`;
          $("#cuerpo").append(tr)
           console.log(data[i])
         }
         $("#totalPoints").text(total)
    });
})

