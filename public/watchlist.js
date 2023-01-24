// https://www.omdbapi.com/?t=  [movie+name]  &y=[year]  &plot=full  &apikey=bb23d389
// https://www.omdbapi.com/?t=mission+impossible&plot=full&apikey=bb23d389

console.log('running watchlist.js');
let btnI=0;
let movieNames=[];
//LIST 

fetch('/watchlistJSON', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
    .then(response => response.json())
    .then(response => {

        //main here :- 

        // console.log('watchlist movie= '+response.watchlist[1]);
        // console.log(typeof(response.watchlist));
        const data = response.watchlist;

        //         let title = "";
        //         json = response;
        if(data.length==0){
            let elem=document.getElementById('ShowStatus');
            elem.innerHTML='Your Watchlist is Empty';
            elem.style.fontWeight= 'bold';
            return;
        }

        for (let i = 0; i < data.length; i++) {
            movie = data[i];
            fetch(`https://www.omdbapi.com/?t=${ data[i] }&plot=full&apikey=bb23d389`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(response => {

                    const Movie = response;
                    const main = document.querySelector('.row');  //most outside
                    // main.empty();

                    //create card
                    const card = document.createElement('div');
                    // card.classList = 'row';  //not anywhere
                    const movieCard = `
    <div class="col-md-4">
                    <img src="${ Movie.Poster }"
                        class="card-img poster" alt="...">
                </div>
                <div class="col-md-12">
                    <div class="card-body">
                        <div class="top">
                            <h5 class="card-title">${ Movie.Title }</h5>
                            <hr>
                            <div class="rating">${ Movie.imdbRating }★</div>
                        </div>
                        <p class="card-text"><small class="text-muted">${ Movie.Year }</small></p>
                        <p class="card-text">${ Movie.Plot }</p>
                        <p class="card-text"><small class="text-muted">
                                Genre: ${ Movie.Genre }
                                <br>
                                Actors: ${ Movie.Actors }
                                <br>
                                Languages: ${ Movie.Language }
                                <br>
                                Rated: ${ Movie.Rated }
    
                            </small></p>
                        <div class="btns">
                            <button type="button" class="btn btn-secondary btn-sm " id="btn${ btnI }" onclick="removeFromWatchList(this.id)">Remove from Watchlist</button>
                           
                        </div>
                    </div>
                </div> <hr/>
    `;
                    card.innerHTML = movieCard;
                    main.prepend(card);
                    movieNames.push(Movie.Title);
                    btnI++;

                }).catch((err) => console.log(err));



        }//for loop for movies selection

    }).catch((err) => console.log(err));


function removeFromWatchList(id){
    // const elem=document.getElementById(id);
    let str=""
    for(let i=3;i<id.length;i++){
        str+=id[i];
    }
    const index = Number(str);
    const movie=movieNames[index]
    email='shanneeahirwar@gmail.com'
    fetch(`/deleteFromWatchlist/${movie}`,{})
    alert(`"${movie}" is deleted successfully`);
    window.location.href = 'http://localhost:8000/watchlist';
}