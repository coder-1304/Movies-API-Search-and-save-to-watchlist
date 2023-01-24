fetch('/watchlistJSON', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
    .then(response => response.json())
    .then(response => {
        document.getElementById('myName').innerHTML=response.name;
    }).catch((err) => console.log(err));