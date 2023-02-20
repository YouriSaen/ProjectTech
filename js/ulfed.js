function add() {
    const hardLi = document.querySelectorAll('ul > li');
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode('live love laugh'));
    ul.appendChild(li);
    console.log("I clicked");

    hardLi.forEach(hardLi => {
        console.log(hardLi);
    });
}


