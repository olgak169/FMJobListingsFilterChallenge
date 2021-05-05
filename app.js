const filterEl = document.querySelector('.filters')
const filterList = document.querySelector('.filter-list')
const clear = document.getElementById('clear')
const cardsEl = document.querySelector('.cards')
let tagArray =[]

let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
   let dataObj = JSON.parse(this.responseText);
    dataObj.forEach(data => {
        createCard(data)
    });
  }
};
xmlhttp.open("GET", "data.json", true);
xmlhttp.send();
clear.addEventListener('click', clearFilter)
function createCard(data) {
    const cardEl = document.createElement('div')
    const cardInfoEl = document.createElement('div')
    const cardTagsEl = document.createElement('div')
    const cardDetailsEl = document.createElement('div')
    const cardDetailsSmEl = document.createElement('div')
    const companyEl = document.createElement('h4')
    const positionEl = document.createElement('h3')
    const postedAtEl = document.createElement('p')
    const contractEl = document.createElement('p')
    const locationEl = document.createElement('p')
    const logoEl = document.createElement('div')
    const tagRoleEl = document.createElement('button')
    const tagLevelEl = document.createElement('button')

    logoEl.classList.add('logo')
    logoEl.style.backgroundImage = `url(${data.logo})`
    cardInfoEl.appendChild(logoEl)

    companyEl.innerText = data.company
    companyEl.classList.add('company')
    cardDetailsEl.appendChild(companyEl)

    tagRoleEl.classList.add('tag')
    tagRoleEl.innerText = data.role
    tagLevelEl.classList.add('tag')
    tagLevelEl.innerText = data.level
    cardTagsEl.appendChild(tagRoleEl)
    cardTagsEl.appendChild(tagLevelEl)
    tagRoleEl.addEventListener('click', () => {
        filterItems(tagRoleEl)
    })
    tagLevelEl.addEventListener('click', () => {
        filterItems(tagLevelEl)
    })

    if (data.new == true) {
        const btnNewEl = document.createElement('button')
        btnNewEl.classList.add('new')
        btnNewEl.innerHTML = 'new!'
        cardDetailsEl.appendChild(btnNewEl)
    }
    if (data.featured == true) {
        const btnFeaturedEl = document.createElement('button')
        btnFeaturedEl.classList.add('featured')
        btnFeaturedEl.innerHTML = 'featured'
        cardDetailsEl.appendChild(btnFeaturedEl)
        cardEl.classList.add('feature')
    }
    if (data.languages.length > 0) {
        for (let i = 0; i < data.languages.length; i++) {
            const tagLangEl = document.createElement('button')
            tagLangEl.classList.add('tag')
            tagLangEl.addEventListener('click', () => {
                filterItems(tagLangEl)
            })
            tagLangEl.innerText = data.languages[i]
            cardTagsEl.appendChild(tagLangEl)
        }
    }
    if (data.tools.length > 0) {
        for (let i = 0; i < data.tools.length; i++) {
            const tagToolsEl = document.createElement('button')
            tagToolsEl.classList.add('tag')
            tagToolsEl.innerText = data.tools[i]
            tagToolsEl.addEventListener('click', () => {
                filterItems(tagToolsEl)
            })
            cardTagsEl.appendChild(tagToolsEl)
        }
    }
    positionEl.classList.add('position')
    positionEl.innerText = data.position
    cardDetailsEl.appendChild(positionEl)

    postedAtEl.innerText = data.postedAt
    contractEl.innerText = data.contract
    locationEl.innerText = data.location

    postedAtEl.classList.add('small')
    contractEl.classList.add('small')
    contractEl.classList.add('contract')
    locationEl.classList.add('small')
    locationEl.classList.add('location')

    cardDetailsSmEl.classList.add('card-details-small')
    cardDetailsSmEl.appendChild(postedAtEl)
    cardDetailsSmEl.appendChild(contractEl)
    cardDetailsSmEl.appendChild(locationEl)
    cardDetailsEl.appendChild(cardDetailsSmEl)
    
    cardEl.classList.add('card')
    cardInfoEl.classList.add('card-info')
    cardDetailsEl.classList.add('card-details')
    cardTagsEl.classList.add('card-tags')
    cardInfoEl.appendChild(cardDetailsEl)
    cardEl.appendChild(cardInfoEl)
    cardEl.appendChild(cardTagsEl)
    cardsEl.appendChild(cardEl)
}

function filterItems(elem) {
    let target = elem.innerHTML
    
    if (tagArray.length == 0) {
        createTag(target)
        tagArray.push(target)
        filterEl.classList.add('open')
        sortCards()
    } else {
        if (!tagArray.includes(target)) {
            createTag(target)
            tagArray.push(target)
            sortCards()
        }
    }
}
function sortCards() {
    let tagLists = document.querySelectorAll('.card-tags')
    tagLists.forEach(tagList => {
        let tags = tagList.childNodes
        let match = []
        tags.forEach(tag => {
            if (tagArray.includes(tag.innerText)) {
                match.push(tag.innerText)
            }
        })
        
        if (tagArray.length!= match.length) {
            tagList.parentElement.classList.add('hidden')
        } else {
            for (let j = 0; j < match.length; j++) {
                const element = match[j];
                if (tagArray.includes(element)) {
                    tagList.parentElement.classList.remove('hidden')
                } else {
                    tagList.parentElement.classList.add('hidden')
                }
            }
        }
    })
}
function removeTag(el) {
    el.remove()
    const index = tagArray.indexOf(el.innerText)
    if (index > -1) {
        tagArray.splice(index, 1)
    }
    if (filterList.childNodes.length < 1) {
        clearFilter()
    }
    sortCards()
}
function createTag(tagName) {
    const filterTagEl = document.createElement('button')
    filterTagEl.innerText = tagName
    filterTagEl.classList.add('filter-tag')
    filterTagEl.addEventListener('click', () => {removeTag(filterTagEl)})
    filterList.appendChild(filterTagEl)
}

function clearFilter() {
    let cards = document.querySelectorAll('.card')
    let filters = document.querySelectorAll('.filter-tag')
    filters.forEach(filter => { filter.remove()})
    cards.forEach(card => { card.classList.remove('hidden')})
    filterEl.classList.remove('open')
    tagArray =[]
}
