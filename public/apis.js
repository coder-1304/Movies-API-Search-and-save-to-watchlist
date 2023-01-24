// https://www.omdbapi.com/?t=  [movie+name]  &y=[year]  &plot=full  &apikey=bb23d389
// https://www.omdbapi.com/?t=mission+impossible&plot=full&apikey=bb23d389


//   optional
let json = {}
document.getElementById("disp").style.display = "none";
let btnI = 0;
let movieNames = [];
// movieNames.push('yeah');
// movieNames.push('yoo');
console.log(movieNames)
let watchlist = [];

function searchMovie() {
    document.getElementById("disp").style.display = "flex";
    let movie = document.getElementById('movieName').value;
    let year = document.getElementById('movieYear').value;
    movie = movie.replaceAll(' ', '+');

    async function getData(url) {
        await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                let title = "";
                console.log(response)
                const data = response;
                json = response;

                const main = document.querySelector('.row');  //most outside
                // main.empty();

                //create card
                const card = document.createElement('div');
                // card.classList = 'row';  //not anywhere
                const movieCard = `
    <div class="col-md-4">
                    <img src="${ data.Poster }"
                        class="card-img poster" alt="...">
                </div>
                <div class="col-md-12">
                    <div class="card-body">
                        <div class="top">
                            <h5 class="card-title">${ data.Title }</h5>
                            <hr>
                            <div class="rating">${ data.imdbRating }★</div>
                        </div>
                        <p class="card-text"><small class="text-muted">${ data.Year }</small></p>
                        <p class="card-text">${ data.Plot }</p>
                        <p class="card-text"><small class="text-muted">
                                Genre: ${ data.Genre }
                                <br>
                                Actors: ${ data.Actors }
                                <br>
                                Languages: ${ data.Language }
                                <br>
                                Rated: ${ data.Rated }
    
                            </small></p>
                        <div class="btns">
                            <button type="button" class="btn btn-secondary btn-sm " id="btn${ btnI }" onclick="saveToWatchList(this.id)">Add to Watchlist</button>
                            <!-- <button type="button" class="btn btn-info btn-sm btnList">See full Info</button> -->
                        </div>
                    </div>
                </div> <hr/>
    `;
                card.innerHTML = movieCard;
                main.prepend(card);
                movieNames.push(data.Title);
                btnI++;

            }).catch((err) => console.log(err));
    }

    if (movie.length == 0) {
        alert('Please enter Movie name');
        return;
    }


    if (year.length != 0) {
        let url = `https://www.omdbapi.com/?t=${ movie }&y=${ year }&plot=full&apikey=bb23d389`;
        getData(url);
    }
    else {
        let url = `https://www.omdbapi.com/?t=${ movie }&plot=full&apikey=bb23d389`;
        getData(url);
    }
}

//button Id's  =  btn0 btn1 btn2

function saveToWatchList(id) {
    let index = Number(id[3]);
    const movie = movieNames[index];
    watchlist.push(movie);
    alert(`"${ movie}" is added to watchlist`)
    
    const url = `/saveToWatchlist/${movie}`
    fetch(url, {});
}





