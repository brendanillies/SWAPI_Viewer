"use strict";

const peopleButton = document.querySelector("#submit_people");
const speciesButton = document.querySelector("#submit_species");
const planetsButton = document.querySelector("#submit_planets");
const filmsButton = document.querySelector("#submit_films");
const starshipsButton = document.querySelector("#submit_starships");
const vehicleButton = document.querySelector("#submit_vehicle");
const table = document.querySelector("table");

async function fetchData(category, resourceNumber) {
    const api = "https://swapi.dev/api";
    const res = await fetch(`${api}/${category}/${resourceNumber}`);
    let json = await res.json();

    const deleteArray = ['url', 'created', 'edited']
    deleteArray.forEach((element) => {
        delete json[element]
    });

    return json;
};

async function fetchDataWithURL(url) {
    const res = await fetch(url);
    let json = await res.json();

    const deleteArray = ['url', 'created', 'edited']
    deleteArray.forEach((element) => {
        delete json[element]
    });

    return json;
};


async function fetchPeopleInfo(resourceNumber) {

    const peopleInfo = await fetchData('people', resourceNumber);

    return peopleInfo
}

async function fetchSpeciesInfo(resourceNumber) {

    const speciesInfo = await fetchData('species', resourceNumber);

    return speciesInfo
}

async function fetchPlanetInfo(resourceNumber) {

    const planetInfo = await fetchData('planets', resourceNumber);

    return planetInfo
}

async function fetchFilmInfo(resourceNumber) {

    const filmInfo = await fetchData('films', resourceNumber);

    return filmInfo
}

async function fetchStarshipInfo(resourceNumber) {

    const startshipInfo = await fetchData('starships', resourceNumber);

    return startshipInfo
}

async function fetchVehicleInfo(resourceNumber) {

    const vehicleInfo = await fetchData('vehicles', resourceNumber);

    return vehicleInfo
}

function createUl(values) {
    let ulElement = document.createElement('ul');

    values = capitalize(values);
    for (const value of values) {
        let liElement = document.createElement('li');

        liElement.appendChild(document.createTextNode(value.trim()));

        ulElement.appendChild(liElement);
    };

    return ulElement;
}

async function createUlHref(values, linkKey) {
    let ulElement = document.createElement('ul');

    if (typeof values === 'string') {
        values = [values];
    };
    
    values = capitalize(values);
    if (values.length === 1) {
        let aElement = document.createElement('a');

        let data = await fetchDataWithURL(values[0]);
        let linkValue = data[linkKey];
    
        aElement.appendChild(document.createTextNode(linkValue));
        aElement.setAttribute('href', values[0]);
        aElement.setAttribute('target', '_blank');

        return aElement;
    };

    for (const value of values) {
        let liElement = document.createElement('li');
        let aElement = document.createElement('a');

        let data = await fetchDataWithURL(value);
        let linkValue = data[linkKey];

        aElement.appendChild(document.createTextNode(linkValue));
        aElement.setAttribute('href', value);
        aElement.setAttribute('target', '_blank');

        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);

    };

    return ulElement;
}

function capitalize(words) {
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].trim()[0].toUpperCase() + words[i].trim().substring(1);
    };
    return words;
}

const mapper = {
    'people': {
        'button': peopleButton,
        'func': fetchPeopleInfo,
        'maxResourceNumber': 81 // 82; Account for .random() starting at 0
    },
    'species': {
        'button': speciesButton,
        'func': fetchSpeciesInfo,
        'maxResourceNumber': 36  // 37; Account for .random() starting at 0
    },
    'planets': {
        'button': planetsButton,
        'func': fetchPlanetInfo,
        'maxResourceNumber': 59 // 60; Account for .random() starting at 0
    },
    'films': {
        'button': filmsButton,
        'func': fetchFilmInfo,
        'maxResourceNumber': 5 // 6; Account for .random() starting at 0
    }
}

for (const mapping in mapper) {

    const links = {
        'homeworld': 'name',
        'films': 'title',
        'species': 'name',
        'starships': 'name',
        'vehicles': 'name',
        'residents': 'name',
        'people': 'name',
        'planets': 'name',
        'characters': 'name',
        'pilots': 'name'
    }

    const { button, func, maxResourceNumber } = mapper[mapping];

    button.addEventListener('click', async () => {
        let resourceNumber = Math.floor(Math.random() * maxResourceNumber) + 1;

        let data = await func(resourceNumber);
        console.log(data);

        if (table.classList.contains('d-none')) {
            // Table hasn't been created yet
            table.classList.remove('d-none');
        } else {
            // Delete table previously created
            table.deleteTHead();
            table.removeChild(table.getElementsByTagName('tbody')[0]);
        };

        // Create table header
        let header = table.createTHead();
        var row = header.insertRow();

        const headerValues = ['Category', 'Value'];
        headerValues.forEach((element) => {
            var cell = row.insertCell();
            cell.appendChild(document.createTextNode(element));
        });

        // Create table body
        let body = table.createTBody();

        for (const property in data) {
            row = body.insertRow();

            // Insert property category
            var cell = row.insertCell();
            const words = property.split('_');

            cell.appendChild(document.createTextNode(capitalize(words).join(' ')));

            // Insert property value
            cell = row.insertCell();
            var cellValue = data[property];

            var element; // Declare variable to store final table element
            if (property in links) {

                element = await createUlHref(cellValue, links[property]);

            } else {
                if (typeof cellValue === 'object') {

                    element = createUl(cellValue);

                } else if (typeof cellValue === 'string') {

                    if (property === 'opening_crawl') {
                        element = document.createTextNode(cellValue);
                    } else {

                        const cellValues = cellValue.split(',');
                        if (cellValues.length > 1) {

                            // Populate with ul element
                            element = createUl(cellValues);

                        } else {
                            // Populate with array value
                            element = document.createTextNode(capitalize(cellValues).join(' '));
                        };
                    }
                } else {
                    element = document.createTextNode(cellValue);
                }
            };

            cell.appendChild(element);

        };

    });
}
