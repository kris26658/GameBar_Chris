let elementsObject = [];
var totalElements;
var totalUnlockedElements = 0;

socket.emit('getElements');
socket.on('elementsData', (elementsData) => {
    elementsObject = elementsData;
    totalElements = elementsObject.length;
    console.log('retrieved')
    socket.emit('getUserElements', user);
});

socket.on('userElementsData', (userElements) => {
    userElements.forEach(element => {
        elementsObject.forEach(e => {
            if (element == e.name) {
                e.locked = false;
                totalUnlockedElements++;
            }
        });
    });
});

function merge(element1, element2) {
    let el1text = element1.split('-')[0];
    let el2text = element2.split('-')[0];
    let unlockedElement;

    elementsObject.forEach(e => {
        if (el1text == e.recipe[0] && el2text == e.recipe[1] || el2text == e.recipe[0] && el1text == e.recipe[1]) {
            unlockedElement = e;
        }
    });

    if (unlockedElement.locked) {
        unlockedElement.locked = false;
        unlockedButton = document.getElementById(`${unlockedElement.name}-og`);
        unlockedButton.innerHTML = unlockedElement.text;
        unlockedButton.disabled = false;
        unlockedButton.draggable = true;
        unlockedButton.ondragstart = dragstartHandler;
        unlockedButton.onclick = spawn;

        totalUnlockedElements++;
        document.getElementById("sidebarHeader").innerHTML = `Elements (${totalUnlockedElements}/${totalElements})`;
    }

    gameSave();

    return unlockedElement;
}

function gameSave() {
    let saveArray = [];
    elementsObject.forEach(e => {
        if (!e.locked) {
            saveArray.push(e.name);
        }
    });

    socket.emit('updateUserElements', { username: user, elements: saveArray });
};