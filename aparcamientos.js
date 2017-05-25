$(document).ready(function() {
  //MAPA:
  var apiKey2 = ' AIzaSyBYprwbxxAn3Hsjbog26oeJYzlPM_3N2CE ';
  var apiKey = 'AIzaSyC5hQk4LZTwNNfMJoYXYiUIZL94sWipgXk';
  var click_map = false;
  var iniciado = false;  
  var tokenshow = false;
  var coleccion_seleccionada = false;
  var current_collection = [];
  var collectionfind = false;
  var collections = {};
  var nombre_current_col= "";
  var parkfind = false;
  var json = {};
  var usuarios_asignados = {};
  var name_instalation = "";





function show_parks(){
  var park = parks[$(this).attr('no')];

  var addre = park.address['street-address'];
  var code = park.address['postal-code'];
  var lat = park.location.latitude;
  var lon = park.location.longitude;
  var local = park.address.locality;
  var desc = park.organization['organization-desc'];
  var name = park.title;
  namePark = name;
  
  var marker = L.marker([lat, lon]).addTo(map).bindPopup('<a>' + name + '</a><br/>').openPopup();
 

  if($(this).css("color")=="rgb(0, 128, 0)"){
    map.removeLayer(marker);
    $('#usuarios-google-asigandos').empty();
    $($(this)).css("color","rgb(51, 51, 51)");
  }else{
    $($(this)).css("color","rgb(0, 128, 0)");
    name_instalation = $(this);
  }


  marker.on("popupclose", function(){
    map.removeLayer(marker);
  })

  map.setView([lat, lon], 15);
      $('getbutton').empty();
      $('#current-park').show();
      $('#current-park').html('<h2>' + name + '</h2>' + '<p> Localización: ' + local + '<p>Direccion: ' + addre + '</p>' + '<p> Codigo postal:' + code +'</p>' + desc);
        

      //carrusel   
        var urlWiki = "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=" +
        lat + "|" + lon + "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?";
        $.getJSON(urlWiki, function(json) {
                var urls = [];

                for (page in json.query.pages) {
                        urls.length = urls.push(json.query.pages[page].imageinfo[0].url);
                }

//carouser               

$("#myCarousel").show();
$(".carousel-indicators").empty();
  $(".carousel-inner").empty();
  if(urls.length != 0){
    $(".carousel-indicators").show();
    $(".carousel-inner").show();
    $("#leftbutton").show();
    $("#rightbutton").show();
    for (var i=0; i < urls.length; i++ ){
      if(i==0){
        $(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='" + i + "' class='active'></li>");
        $(".carousel-inner").append("<div class='item active'><img src='"+ urls[i] +"'></div>");
      }else{
        $(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='" + i + "'></li>");
        $(".carousel-inner").append("<div class='item'><img src='"+ urls[i] +"'></div>");
      }
    }
  }else{
    $(".carousel-indicators").hide();
    $(".carousel-inner").hide();
    $("#leftbutton").hide();
    $("#rightbutton").hide();
  }


  $("#instalaciones").html('<h2>' + name + '</h2>' + '<p> Localización: ' + local + '<p>Direccion: ' + addre + '</p>' + '<p> Codigo postal:' + code +'</p>' + desc);

        });


};


function get_parks(){
    
    iniciado = true;
    $.getJSON("instalaciones.json", function(data) {
    
      $('#getbutton').empty();
      $("#listas").show();
      parks = data.graph;
   
      var list = '<p>' + '</p>'
      list = list + '<ul>'
      for (var i = 0; i < parks.length; i++) {
        list = list + '<li no=' + i + '>' + parks[i].title + '</li>';
        
        
      }
      list = list + '</ul>';
      $('#getbutton').html(list);
      $('#park-list2').html(list);//para que te salga en la pestaña de colecciones
      $('li').click(show_parks);
      $("#park-list2 *").draggable({stack: "#current-collection2", revert:true});
      
      //$('#getbutton').draggable({revert:true,appendTo:"body",helper:"clone"});
      

    });
};

//cambio de pestañas: 

$(".button-menu").click(function(){
    if (iniciado){
      if ($(this).attr('id') == "button-principal"){
        $("#pantalla-principal").show();
        $("#pantalla-colecciones").hide();
        $("#pantalla-instalaciones").hide();
      } else if ($(this).attr('id') == "button-colecciones"){
        $("#pantalla-principal").hide();
        $("#pantalla-colecciones").show();
        $("#pantalla-instalaciones").hide();
      
      } else if ($(this).attr('id') == "button-instalaciones"){
        $("#pantalla-principal").hide();
        $("#pantalla-colecciones").hide();
        $("#pantalla-instalaciones").show();
      }
      //formularios guardar y cargar 
      if ($(this).attr('id') == "button-guardar"){
        if (!tokenshow) {
          $("#formulario-git").show();
          $("#rest-form-guardar").show();
          $("#rest-form-cargar").hide();
          tokenshow = true;
        }else{
          $("#formulario-git").hide();
          $("#rest-form-guardar").hide();
          $("#rest-form-cargar").hide();
          tokenshow = false;
        }
      }else if ($(this).attr('id') == "button-cargar"){
        if (!tokenshow) {
          $("#formulario-git").show();
          $("#rest-form-guardar").hide();
          $("#rest-form-cargar").show();
          tokenshow = true;
        }else{
          $("#formulario-git").hide();
          $("#rest-form-guardar").hide();
          $("#rest-form-cargar").hide();
          tokenshow = false;
        }
      }
    }
  });  

//guardar en github
var gh;
var repo;

$("#guardar").click(function(){
  write();
});


  function getRepo(){
    var user ='cimartin';
    var Repo = $("#repositorio").val();
    console.log(Repo);
    var token = $("#token").val();
    console.log(token);
    console.log(token);
    console.log(Repo);

    gh = new Github ({
      token:token,
      auth: "oauth"
    });
    repo = gh.getRepo(user, Repo);
  }


function write (){
  getRepo();
  var fichero = $("#fichero").val();
  json = {colecciones:collections};
  var texto = JSON.stringify(json);
  repo.write("master", fichero, texto, "file", function(e){console.log(e)});

}



function cargar(url){
    $.getJSON(url)
    .done(function(data) {
      var contenido = atob(data.content);
      console.log(contenido);
      contenido = decodeURIComponent(escape(contenido));
      console.log("2",contenido);
      var contenido_parsed = JSON.parse(contenido);
      console.log("4",contenido_parsed);
      collections = contenido_parsed.colecciones;
      console.log("3",collections);
      

      //ACTUALIZA LA LISTA DE COLECCIONES//
      nombre_current_col= "";
      $(".collections").empty();
      $(".nombrecoleccion").empty();
      $(".current-collection-list").empty();
      $.each(collections, function(key, value){
        $(".collections").append("<li class='collect' id= '" + key + "'>" + key + "</li>");
      });

      actualizar_parks();
    
    })
    .fail(function() {
      alert("No existe dicho recurso");
    });
  }

  $("#cargar").click(function(){

    var fich = $("#fichero2").val();
    var Repo2 = $("#repositorio2").val();
    var token2 = $("#token2").val();
    var github =  new Github({token:token,auth: "oauth"});
    var user = "cimartin";
    var repositorio_git = github.getRepo(user, Repo2);
    var url = "https://api.github.com/repos/" + user + "/" + Repo2 + "/contents/" + fich
    
    cargar(url);
  

  });





function encontrado(park){
    parkfind = false;
    for(i=0;i< current_collection.length;i++) {
      if(park == current_collection[i]){
        parkfind = true;
      }
    }
  }


//arrastrar al otro div 
function comprobar_coleccion(park){
    encontrado(park)
    console.log("coleccion creada");
    if(!parkfind){
      current_collection.push(park);
    }
  }


//arrastrar al otro div 
function pintar_coleccion(col){
    $(".current-collection-list").empty();
    for(i=0;i< col.length;i++) {
      $(".current-collection-list").append("<li>" + col[i] + "</li>");
      
    }
  }


  //CREAR COLECCIONES:
$("#crear").click(function(){
  var nombre = $("#tags").val();

  collectionfind = false;
  if (nombre.length == 0){
    alert("Ese nombre no es válido, escoja otro.")
  }else{
    if( nombre in collections ) {
      collectionfind = true;
    }
    console.log("que tal");
    if(!collectionfind){
      collections[nombre] = [];
    }else{
      alert("Ese nombre de colección ya existe, escoja otro.")
    }
    $(".collections").empty();
   
    $.each(collections, function(key, value){
      $(".collections").append("<li class='collect' id= '" + key + "'>" + key + "</li>");
    });

    $("#tags").val("");
  }

  actualizar_parks();

});


//añadir coleciones
function actualizar_parks(){
  $(".collect").click(function(){
    if (nombre_current_col.length != 0){
      collections[nombre_current_col] = current_collection;
    }

    nombre_current_col = this.id;
    console.log(nombre_current_col);
    coleccion_seleccionada = true;
    current_collection = collections[nombre_current_col];
    pintar_coleccion(collections[nombre_current_col]);
    $(".nombrecoleccion").empty();
    $(".nombrecoleccion").append(nombre_current_col);
    console.log("pppppp", current_collection);

  });
}

$("#current-collection2").droppable({
    over: function( event, ui ) {
        $( this )
        .addClass( "ui-state-highlight" )
        console.log("hola1");

    },
    out: function( event, ui ) {
        $( this )
        .removeClass( "ui-state-highlight" )
        console.log("hola2");

    },
    drop: function( event, ui ) {
        $(this)
        .removeClass( "ui-state-highlight" )
        console.log("mal");

      if (coleccion_seleccionada){
        comprobar_coleccion($(ui.draggable).text());
        pintar_coleccion(current_collection);
      }else{
        alert("No hay colección . Elija una.")
      }

    },
  });


//mapa

 var map = L.map('mapid').setView([40.4175, -3.708], 11);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var popup = L.popup(); 
    map.locate({setView: true, maxZoom: 15});

    $("#get").click(get_parks);
    //$("#añadir").hide();

    $("mapid").on("click", ".park_map", function(){

      click_map = true;
      show_parks();
      click_map = false;
      //$("#añadir").show();
    });



//usuarios:

$("#añadir").click(function(e){
  e.preventDefault();
  try{
    var host = "ws://localhost:12345/";

    var s = new WebSocket(host);
    s.onmessage=function(e){
      show_users(e.data);

    } 
  }catch (ex){
    console.log("Socket exception:", ex);
  }
})

function show_users(id){
  handleClientLoad(apiKey, id);


}

function handleClientLoad(apiKey, id){
  gapi.client.setApiKey(apiKey);
  makeApiCall(id);
}


function makeApiCall(id, mode){
  gapi.client.load('plus', 'v1', function() {
    var request = gapi.client.plus.people.get({
                  'userId': id
                
    });

   

   	request.execute(function(resp) {

	    var name = resp.displayName; 
	    var image = resp.image.url;

		formato_usuarios(name, image);
		
		
      
    });
  });
}


function formato_usuarios(name, image){
  
  var format = '<div class="row ">' +
                        '<div class="text-center col-sm-2 usuario">' +
                              '<img class="img-responsive" src="' + image + '"><p>' + name + '</p></img>'
                         '</div>' +
                  '</div>' ;

                    
$("#lista-usuarios-GOOGLE").append(format);


arrastrar();



}


function arrastrar(){

	
$("#lista-usuarios-GOOGLE .text-center").draggable({stack: "#usuarios-google-asigandos", revert:true, containment: "document", helper:"clone", appendTo:"body"});


$("#usuarios-google-asigandos").droppable({
    over: function( event, ui ) {
        $( this )
        .addClass( "ui-state-highlight" )
        

    },
    out: function( event, ui ) {

        $( this )
        .removeClass( "ui-state-highlight" )
       

    },
    drop: function( event, ui ) {
        $(this)
        .removeClass( "ui-state-highlight" )
        var html = '<div class="text-center col-sm-2 usuario">' ;
        html += ui.helper.context.innerHTML + "</div>";
        $("#usuarios-google-asigandos").append(html);
     
        
    }
  });
  }




});

