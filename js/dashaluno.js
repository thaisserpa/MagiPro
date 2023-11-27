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

        // Limpar o conteúdo atual do contêiner de projetos
        projectsContainer.innerHTML = '';

        // Verificar se há projetos
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

    // Adicione outros elementos conforme necessário...

    detailsElement.appendChild(titleElement);
    detailsElement.appendChild(buttonElement);

    projectElement.appendChild(imageElement);
    projectElement.appendChild(detailsElement);

    return projectElement;
}
