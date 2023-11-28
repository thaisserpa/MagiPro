document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projectsContainer');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você não está autenticado. Faça login primeiro.');
        window.location.href = '/login.html';
    }

    fetch('http://89.117.75.191:8070/get-myprojects', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(projects => {
        console.log('Projetos recebidos da API:', projects);

      
        projectsContainer.innerHTML = '';

        if (projects.projects && projects.projects.length > 0) {
            // Iterar sobre os projetos e criar elementos HTML para cada um
            projects.projects.forEach(project => {
                const projectElement = createProjectElement(project);
                projectsContainer.appendChild(projectElement);
            });
        } else {
            
            const noProjectsMessage = document.createElement('p');
            noProjectsMessage.textContent = 'Você ainda não criou projetos.';
            projectsContainer.appendChild(noProjectsMessage);
        }
    })
    .catch(error => console.error('Erro na requisição:', error.message));
});

function createProjectElement(projectName) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('card');

    const imageElement = document.createElement('img');
    imageElement.src = 'assets/front.jpg';

    const detailsElement = document.createElement('div');

    const titleElement = document.createElement('h1');
    titleElement.textContent = projectName;

    const areaElement = document.createElement('h2');
    areaElement.textContent = 'Desenvolvimento Front End'; 

    const professorElement = document.createElement('h5');
    professorElement.textContent = 'Prof. André Morais'; 

    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'Acessar';

    detailsElement.appendChild(titleElement);
    detailsElement.appendChild(buttonElement);

    projectElement.appendChild(imageElement);
    projectElement.appendChild(detailsElement);

    return projectElement;
}



document.addEventListener('DOMContentLoaded', () => {

    const apiUrl = 'http://89.117.75.191:8070/applications';

    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token de autenticação não encontrado.');
        return;
    }

    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const tabela = document.getElementById('sua-tabela');

            // Verifica se a propriedade 'applications' existe e é uma matriz
            if (Array.isArray(data.applications)) {
                data.applications.forEach(item => {
                    const tr = document.createElement('tr');

                    const td1 = document.createElement('td');
                    td1.textContent = item.summary;  
                    tr.appendChild(td1);

                    const td2 = document.createElement('td');
                    td2.textContent = item.resumePath;  
                    tr.appendChild(td2);

                    const td4 = document.createElement('td');
                    const aceitarLink = document.createElement('a');
                    aceitarLink.id = 'aceitar';
                    aceitarLink.href = '#';
                    aceitarLink.className = 'btn';
                    aceitarLink.textContent = 'Aceitar';
                    td4.appendChild(aceitarLink);
                    tr.appendChild(td4);

                    const td5 = document.createElement('td');
                    const recusarLink = document.createElement('a');
                    recusarLink.id = 'recusar';
                    recusarLink.href = '#';
                    recusarLink.className = 'btn';
                    recusarLink.textContent = 'Recusar';
                    td5.appendChild(recusarLink);
                    tr.appendChild(td5);

                    tabela.appendChild(tr);
                });
            } else {
                console.error('A propriedade "applications" não é uma matriz ou não existe nos dados recebidos.');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error.message);
        });
});
