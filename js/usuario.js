document.addEventListener('DOMContentLoaded', () => {
    const dashboardIcon = document.querySelector('.dashboard-link');
    
    if (dashboardIcon) {
        dashboardIcon.addEventListener('click', () => {
            const userType = localStorage.getItem('userType');
            console.log('Tipo de Usuário:', userType);

            if (userType === 'STUDENT') {
                window.location.href = '/dashaluno.html'; 
            } else if (userType === 'TEACHER') {
                window.location.href = '/dashprofessor.html'; 
            } else {
                alert('Erro: Tipo de usuário desconhecido.');
            }
        });
    } else {
        console.error('Elemento não encontrado.');
    }
});