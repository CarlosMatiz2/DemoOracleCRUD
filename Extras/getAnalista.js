let divAnalistas = document.getElementById('analistas');

function getAnalista() {
    var idAnalista = document.getElementById("id").value;
    //console.log(idAnalista);
    getAnalistaById(idAnalista);
}

function getAnalistaById(id) {
    fetch('http://localhost:3000/analista/user?id='+id)
        .then(response => response.json())
        .then(data => listPublications(data));
}

function listPublications(analistas){
    divAnalistas.textContent = '';
    analistas.map((analista , i) => {
        let h2 = document.createElement('h2');
        h2.textContent = `${i} - ${analista[1]}, ${analista[2]}`;
        // nombre.textContent = `${analista}`;
        divAnalistas.appendChild(h2);
    });
}