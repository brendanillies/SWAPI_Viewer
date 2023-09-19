'use strict';

const peopleButton = document.querySelector('#submit_people');
const speciesButton = document.querySelector('#submit_species');
const planetsButton = document.querySelector('#submit_planets');
const filmsButton = document.querySelector('#submit_films');
const starshipsButton = document.querySelector('#submit_starships');
const vehicleButton = document.querySelector('#submit_vehicle');
const table = document.querySelector('table');

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

/**
 * Trims whitespace and capitalizes single word
 * @param {string} word - Word to capitalize 
 * @returns {string} Capitalized word
 */
function capitalizeWord(word) {
    word = word.trim();
    return word.charAt(0).toUpperCase() + word.substring(1)
};

/**
 * Constructs string of capitalized words with passed array of strings
 * @param {string[]} words - Array of wrods to capitalize
 * @param {string} delimter - Delimiter to join captialized array of words with. Defaults to ' ' (single space).
 * @returns {string} Title case string of words
 */
function capitalizeWords(words, delimter = ' ') {
    for (let i = 0; i < words.length; i++) {
        words[i] = capitalizeWord(words[i])
    }
    return words.join(delimter);
};

/**
 * Constructs HTML table of information related to passed SWAPI parent Resource
 * @param {object} data - SWAPI parent Resource data object
 */
async function createTable(data) {
    const table = document.querySelector('table');

    if (table.classList.contains('d-none')) {
        // Table hasn't been created yet
        table.classList.remove('d-none');
    } else {
        // Delete table previously created
        table.deleteTHead();
        table.removeChild(table.getElementsByTagName('tbody')[0]);
    };

    // Create table header
    const header = table.createTHead();
    const header_row = header.insertRow()

    for (const columnHeader of ['Category', 'Value']) {
        const cell = header_row.insertCell();
        cell.appendChild(document.createTextNode(columnHeader));
    };

    // Create table body
    const body = table.createTBody();
    for (const property in data) {
        var cell;
        var element;

        const dataValue = data[property];

        const linkActions = new LinkActions();
        const stringActions = new StringActions();

        const row = body.insertRow();

        // Insert Category
        cell = row.insertCell();

        cell.appendChild(
            stringActions.createNodeFromArray(
                property.split('_')
            )
        );

        // Insert Value
        cell = row.insertCell();
        if (property in links) {

            if (dataValue.length === 0) {
                element = stringActions.createNode('None');
            } else if (typeof dataValue === 'object') {
                // Populate links based on array link
                element = await linkActions.createLinksFromArray(dataValue);
            } else {
                // Populate link string nodes
                element = await linkActions.createLinkNode(dataValue);
            };

        } else {

            if (typeof dataValue === 'object') {
                // Populate with list
                element = stringActions.createList(dataValue);

            } else if (typeof dataValue === 'string') {

                if (property === 'opening_crawl') {
                    // No adjustment to property === 'opening_crawl'
                    element = stringActions.createNode(dataValue);
                } else {

                    // Split comma-delimited string, if necessary
                    if (dataValue.split(',').length > 1) {
                        // Populate with list
                        element = stringActions.createList(dataValue.split(','))
                    } else {
                        // Populate as text node
                        element = stringActions.createNode(dataValue);
                    };
                };

            } else if (typeof dataValue === 'number') {
                element = stringActions.createNode(dataValue.toString());
            } else {
                element = stringActions.createNode(dataValue);
            };
        };

        cell.appendChild(element);

    };

};

class Fetcher {
    /**
     * 
     * @param {string} resource - Name of SWAPI Resource
     * @param {number} resourceNumber - Number identifying Resource to fetch
     * @param {object} url - Used only for static method `usingURL` to allow user to pass a specified 
     * `https` reference to SWAPI child Resource. Defaults to null.
     * @throws {InvalidArgumentException} Throws error if url is defined along with resource and resourceNumber
     */
    constructor(resource, resourceNumber, url = null) {

        if (url === null) {
            this.url = `https://swapi.dev/api/${resource}/${resourceNumber}`;
        } else if (url !== null & resource !== null & resourceNumber !== null) {
            throw new InvalidArgumentException('Must not define both url and resource parameters simultaneously')
        } else {
            this.url = url;
        };
    };

    /**
     * Static method to create Fetcher object for defined `https` references of SWAPI child Resources
     * @param {string} url - `https` reference of SWAPI child Resource
     * @returns {object} Fetcher object reference
     */
    static usingURL(url) {
        return new Fetcher(null, null, url);
    };

    /**
     * Retrieves data from SWAPI Resource
     * @returns {object} Key-value object pair of SWAPI Resource data
     */
    async fetchData() {
        const res = await fetch(this.url);
        const json = await res.json();

        for (const key of ['url', 'created', 'edited']) {
            delete json[key];
        };

        return json;
    };
}

class Resource {

    /**
     * Abstract constructor of SWAPI Resources
     * @param {string} resource - Name of SWAPI resource
     * @param {number} maxResource - Number of resources available based on Resource
     * @param {object} submitter - Button element tied to the Resource fetcher
     */
    constructor(resource, maxResource, submitter) {

        this.resource = resource;
        this.maxResource = maxResource;
        this.submitter = submitter;

        this.submitter.addEventListener('click', async () => {
            const data = await this.getInfo();

            await createTable(data);
        });
    };

    /**
     * Fetches information for child Resource class
     * @returns {object} Data object of class Resource 
     */
    async getInfo() {
        const resourceNumber = Math.floor(Math.random() * this.maxResource) + 1;

        return await new Fetcher(this.resource, resourceNumber).fetchData();
    };

}

class PersonResource extends Resource {

    /**
     * Implemented constructor of Character Resource
     */
    constructor() {
        const submitter = document.querySelector('#submit_person');
        super('people', 81, submitter);
    };

}

class SpeciesResource extends Resource {

    /**
     * Implemented constructor of Species Resource
     */
    constructor() {
        const submitter = document.querySelector('#submit_species');
        super('species', 36, submitter);
    };

}

class PlanetResource extends Resource {

    /**
     * Implemented constructor of Planets Resource
     */
    constructor() {
        const submitter = document.querySelector('#submit_planet');
        super('planets', 59, submitter);
    };

}

class FilmResource extends Resource {

    /**
     * Implemented constructor of Films Resource
     */
    constructor() {
        const submitter = document.querySelector('#submit_film');
        super('films', 5, submitter);
    };

}

class StarshipResource extends Resource {

    /**
     * Implemented constructor of Starships Resource
     */
    constructor() {
        const submitter = document.querySelector('#submit_starship');
        super('starships', 35, submitter);
    };

}

class VehicleResource extends Resource {

    /**
     * Implemented constructor of Vehicles Resource
     */
    constructor() {
        const submitter = document.querySelector('#submit_vehicle');
        super('vehicles', 38, submitter);
    };

}

class StringActions {

    /**
     * Collection of actions related to strings
     */
    constructor() { };

    /**
     * Constructs capitalized unordered list element using array of strings
     * @param {string[]} strings - Array of strings to capitalize and comprise list nodes
     * @returns Unordered list element of capitalized strings
     */
    createList(strings) {
        const ulElement = document.createElement('ul');

        for (const string of strings) {

            const liElement = document.createElement('li');

            const textElement = this.createNode(string);

            liElement.appendChild(textElement);
            ulElement.appendChild(liElement);

        };

        return ulElement;
    };

    /**
     * Capitalizes and constructs node text element from single string
     * @param {string} string - String to capitalize and construct text element
     * @returns {object} Node text element constructed from single string
     */
    createNode(string) {
        return document.createTextNode(capitalizeWord(string));
    };

    /**
     * Capitalizes and constructs node text element from array of strings
     * @param {string[]} strings - Array of strings to capitalize and construct text element
     * @returns {object} Node text element constructed from array of strings
     */
    createNodeFromArray(strings) {
        return document.createTextNode(capitalizeWords(strings));
    }

}

class LinkActions {

    /**
     * Collection of methods related to creating SWAPI child links
     */
    constructor(links) {

        this.links = links;

    };

    /**
     * Constructs unordered list element of SWAPI child Resources with displayed 
     * text summary of child Resource.
     * @param {string[]} links - Array of SWAPI child Resources
     * @returns {object} Unordered list element of SWAPI child Resources
     */
    async createLinkList(links) {

        const ulElement = document.createElement('ul');

        for await (const link of links) {

            const liElement = document.createElement('li');

            const aElement = await this.createLinkNode(link);

            liElement.appendChild(aElement);
            ulElement.appendChild(liElement);

        };

        return ulElement;

    };

    /**
     * Constructs node text elements of SWAPI child Resources. Finds and 
     * displays text summary of child Resource using `https` reference.
     * @param {string} link - `https` reference of SWAPI child Resource
     * @returns {object} Node text element of SWAPI child Resource
     */
    async createLinkNode(link) {

        const aElement = document.createElement('a');

        const data = await Fetcher.usingURL(link).fetchData();
        const displayText = this.#findLinkDisplayText(link, data);

        aElement.appendChild(document.createTextNode(displayText));
        aElement.setAttribute('href', link);
        aElement.setAttribute('target', '_blank');

        return aElement;

    };

    /**
     * Assists in creating appropriate link node elements based on 
     * size of array
     * @param {string[]} links - Array of `https` references 
     * @returns {object} Node element
     */
    async createLinksFromArray(links) {
        if (links.length === 1) {
            return await this.createLinkNode(links[0]);
        } else {
            return await this.createLinkList(links);
        };
    };

    /**
     * Finds text to display from SWAPI child Resource of submitted SWAPI Resource. Uses
     * global object for identifying data mapping.
     * @param {string} link - `https` reference of SWAPI child Resource
     * @param {object} data - Object of SWAPI child Resource
     * @returns {string} Display text of SWAPI child Resource
     */
    #findLinkDisplayText(link, data) {
        const property = links[link.split('/')[4]];
        return data[property];
    }
}

const person = new PersonResource()
const species = new SpeciesResource()
const planet = new PlanetResource()
const film = new FilmResource()
const starship = new StarshipResource()
const vehicle = new VehicleResource()
