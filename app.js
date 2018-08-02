const {
    remote
} = require('electron');
var fs = require('fs');

var database = [];

// var contentElement = document.getElementById('content');
var clientModalElement = document.getElementById('clientModal');
var taskModalElement = document.getElementById('taskModal');
var selectClientsElement = document.getElementById('selectClients');


closeWindow = function () {
    remote.BrowserWindow.getFocusedWindow().close();
}

minimizeWindow = function () {
    remote.BrowserWindow.getFocusedWindow().minimize();
}

maximizeWindow = function () {
    if (!remote.BrowserWindow.getFocusedWindow().isMaximized()) {
        remote.BrowserWindow.getFocusedWindow().maximize();
    } else {
        remote.BrowserWindow.getFocusedWindow().unmaximize();
    }
}

window.onload = function () {
    console.log('Dokument geladen');

    loadTasks();

};

addNewClient = function () {
    const clientName = document.getElementById('newClientName');
    const client = {
        'name': clientName.value,
        'tasks': []
    };
    console.log('the client', client);
    database.push(client);
    fs.writeFile('db.json', JSON.stringify(database), function (err) {
        if (err) {
            console.log(err);
        }
        closeModal();
        clientName.value = '';
    })
}

loadTasks = function () {
    // contentElement.innerHTML = '';
    fs.readFile('db.json', function (err, data) {
        if (err) {
            console.log('error:', err);
        } else {
            console.log(JSON.parse(data));

            database = JSON.parse(data);
            // showTasks();
            fillSelect();

            //Vue.js example
            new Vue({
                el: '#content',
                data: {
                    clients: database
                }
            })
        }
    });

}

toggleTasks = function (event) {
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    console.log(event);
    element = event.target;
    getParentNode(element);
}

getParentNode = function (child) {
    parent = child.parentNode;

    if (parent.classList.contains('client')) {
        console.log(element);
        console.log(parent);
        for (var i = 0; i < parent.childNodes.length; i++) {
            if (parent.childNodes[i].className == "client-body") {
                const tasksElement = parent.childNodes[i];

                const icon = parent.getElementById('icon-arrow');
                console.log('icon', icon);
                if (tasksElement.style.display === "none") {
                    tasksElement.style.display = "block";
                    icon.classList.replace('fa-chevron-circle-up', 'fa-chevron-circle-down');
                } else {
                    tasksElement.style.display = "none";
                    icon.classList.replace('fa-chevron-circle-down', 'fa-chevron-circle-up');
                }

                break;
            }
        }
    } else {
        getParentNode(parent);
    }
}

// showTasks = function () {
//     console.log('showTasks()');
//     database.forEach(function (client) {

//         var divElement = document.createElement("div");
//         divElement.classList.add('task-row');
//         client.tasks.forEach(function (task) {
//             var textnode = document.createTextNode(task);
//             divElement.appendChild(textnode);
//         });

//         var tmp = document.createElement("div");
//         tmp.appendChild(divElement);

//         contentElement.innerHTML += `
//         <div class="client-row">
//         <div class="client-name">${client.name}</div>
//         ${tmp.innerHTML}
//         </div>
//         `;

//     });
// }

fillSelect = function () {

    // database.forEach(function (client) {
    //     var option = document.createElement("option");
    //     option.text = client.name;
    //     option.classList.add('option');
    //     option.value = client.name;
    //     selectClientsElement.add(option);
    // })

    new Vue({
        el: '#selectClients',
        data: {
            clients: database
        }
    })
}

/* Modal */
// When the user clicks the button, open the modal 
showNewClientModal = function () {
    console.log('showNewClientModal');
    clientModalElement.style.display = "block";
}

showNewTaskModal = function () {
    console.log('showNewTaskModal');
    taskModalElement.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeModal = function () {
    clientModalElement.style.display = "none";
    taskModalElement.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//     if (event.target == !clientModalElement || !taskModalElement) {
//         clientModalElement.style.display = "none";
//         taskModalElement.style.display = "none";
//     }
// }

addTaskToClient = function () {
    const clientName = selectClientsElement.options[selectClientsElement.selectedIndex].value;
    console.log('addTaskToClient', clientName);
    const newTaskTitle = document.getElementById('newTaskTitle').value;
    console.log('newTaskTitle', newTaskTitle)
    if (newTaskTitle.length > 0) {
        const clientObject = database.find(function (client) {
            return client.name == clientName;
        })
        console.log('clientObject', clientObject);

        clientObject.tasks.push(newTaskTitle);

        fs.writeFile('db.json', JSON.stringify(database), function (err) {
            if (err) {
                console.log(err);
            }
            closeModal();
            newTaskTitle.value = '';
        })
        loadTasks();
    }
}