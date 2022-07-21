let divTablePublications = document.getElementById('tablePublicactionsBody');

function listPublications(publications){    
    publications.map((publication , i) => {

        let tr = document.createElement('tr');
        let tdNombre = document.createElement('td');
        let tdDescription = document.createElement('td');

        let tdDelete = document.createElement('td');
        let aDelete = document.createElement('button');

        let tdEdit = document.createElement('td');
        let aEdit = document.createElement('a');
        

        tdNombre.textContent = publication[0];
        tdDescription.textContent = publication[3];
        
        aDelete.setAttribute("onclick", "deletePublication("+publication[7]+")") ;
        aDelete.textContent = "Eliminar";

        aEdit.textContent = "Editar"
        aEdit.setAttribute("href", "http://localhost:3000/publications/editPublication/"+publication[7]) ;

        tdDelete.appendChild(aDelete);
        tdEdit.appendChild(aEdit);

        tr.appendChild(tdNombre);
        tr.appendChild(tdDescription);
        tr.appendChild(tdDelete);
        tr.appendChild(tdEdit);

        divTablePublications.append(tr);
    });
}

function getPublications() {
    fetch('http://localhost:3000/publications/publications')
        .then(response => response.json())
        .then(data => listPublications(data));
}

function deletePublication(id) {
    fetch('http://localhost:3000/publications/deletePublication?id='+id,{
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

getPublications();