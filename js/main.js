/*
figure not card
filter by release date and location: na
show
    image
    name
    amiiboSeries
    release date
*/

document.querySelector('#date').valueAsDate = new Date();
getAmiibos();

const button = document.querySelector('#search');
button.addEventListener('click', getAmiibos);


function getAmiibos() {
    clearCards();
    const date = document.querySelector('#date').value;

    const url = `https://corsproxy.io/?url=https://www.amiiboapi.com/api/amiibo?type=figure&release.na=${date} `;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            //If an amiibo was released on the date you entered I will return it
            //if not, I will return all amiibos tha come out that year
            let filteredAmiibos;
            const amiinoReleasedThatDay = data.amiibo.filter(fig => fig.release.na === date);

            if (amiinoReleasedThatDay.length)
                filteredAmiibos = amiinoReleasedThatDay;
            else {
                filteredAmiibos = data.amiibo.filter(fig => {
                    const year = new Date(date).getFullYear();
                    const releaseYear = new Date(fig.release.na).getFullYear();
                    return year === releaseYear;
                });
            }
            filteredAmiibos.sort((a, b) => new Date(b.release.na) - new Date(a.release.na)).forEach(fig => {
                // Create a card inside section cards
                const { h2, series, releaseDate, img } = createCard();
                // Fill in the card
                h2.innerText = fig.name;
                series.innerText = fig.amiiboSeries;
                releaseDate.innerText = fig.release.na;
                img.src = fig.image;
                img.alt = fig.name;
            })
        })
        .catch(error => console.log(error));

}

function clearCards() {
    const cards = document.querySelector('.cards')
    cards.replaceChildren();
}

function createCard(char) {
    //Create a card
    const cards = document.querySelector('.cards');
    const div = document.createElement('div');
    div.className = 'card';
    //Create card's content
    const description = document.createElement('div');
    description.className = 'description';
    const h2 = document.createElement('h2');
    h2.className = 'name';
    const series = document.createElement('small');
    series.className = 'series';
    const releaseDate = document.createElement('small');
    releaseDate.className = 'release_date';
    const img = document.createElement('img');
    img.src = '';
    img.alt = '';
    //Adding style
    div.classList.add('card');
    img.classList.add('image');
    //Connect tags
    description.append(h2, series, releaseDate)
    div.append(description, img);
    cards.append(div);
    //return tags as an {} to diconstruct
    return { h2, series, releaseDate, img };
}