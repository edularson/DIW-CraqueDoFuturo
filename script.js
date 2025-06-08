// Aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {

    // --- FUNCIONALIDADE DE TEMA ---
    const temaToggleCheckbox = document.getElementById('tema-toggle-checkbox');
    
    function aplicarTema(tema) {
        if (tema === 'escuro') {
            document.body.classList.add('dark-mode');
            temaToggleCheckbox.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            temaToggleCheckbox.checked = false;
        }
    }

    const temaSalvo = localStorage.getItem('tema');
    
    if (temaSalvo) {
        aplicarTema(temaSalvo);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        aplicarTema('escuro');
    }

    if (temaToggleCheckbox) {
        temaToggleCheckbox.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('tema', 'escuro');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('tema', 'claro');
            }
        });
    }

    // --- FUNCIONALIDADE DO MENU MOBILE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
    
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    });
    
    // --- FUNCIONALIDADE DAS ABAS DE TURMAS ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const turmaContents = document.querySelectorAll('.turma-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            turmaContents.forEach(content => content.classList.remove('active'));
            
            const turmaId = this.getAttribute('data-turma');
            document.getElementById(turmaId).classList.add('active');
        });
    });

    // --- FUNCIONALIDADE DO CARROSSEL DE DEPOIMENTOS ---
    const sliderContainer = document.querySelector('.depoimentos-slider');
    const btnPrev = document.querySelector('.carousel-btn.prev');
    const btnNext = document.querySelector('.carousel-btn.next');

    if (sliderContainer && btnPrev && btnNext) {
        btnNext.addEventListener('click', () => {
            // clientWidth inclui o padding, que é o ideal aqui
            const slideWidth = sliderContainer.querySelector('.depoimento').clientWidth;
            // Adicionamos a margem (10px * 2) para um cálculo mais preciso
            sliderContainer.scrollLeft += slideWidth + 20; 
        });

        btnPrev.addEventListener('click', () => {
            const slideWidth = sliderContainer.querySelector('.depoimento').clientWidth;
            sliderContainer.scrollLeft -= slideWidth + 20;
        });
    }
    
    // --- BOTÃO VOLTAR AO TOPO ---
    const btnVoltarTopo = document.getElementById('voltar-topo');
    
    if (btnVoltarTopo) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                btnVoltarTopo.classList.add('visible');
            } else {
                btnVoltarTopo.classList.remove('visible');
            }
        });
        
        btnVoltarTopo.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- VALIDAÇÃO DO FORMULÁRIO ---
    const form = document.getElementById('formulario-contato');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            const campos = ['nome-responsavel', 'nome-aluno', 'idade', 'telefone', 'email'];
            campos.forEach(id => {
                const input = document.getElementById(id);
                if (!validarCampo(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                alert('Pré-inscrição enviada com sucesso! Entraremos em contato em breve.');
                form.reset();
                campos.forEach(id => clearError(document.getElementById(id)));
            }
        });
    }

    function validarCampo(input) {
        let ehValido = true;
        let mensagemErro = '';

        if (!input.value.trim()) {
            ehValido = false;
            mensagemErro = 'Este campo é obrigatório.';
        } else {
            switch (input.id) {
                case 'idade':
                    if (input.value < 5 || input.value > 16) {
                        ehValido = false;
                        mensagemErro = 'Idade deve ser entre 5 e 16 anos.';
                    }
                    break;
                case 'telefone':
                    const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                    if (!telefoneRegex.test(input.value)) {
                        ehValido = false;
                        mensagemErro = 'Formato: (XX) XXXXX-XXXX';
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        ehValido = false;
                        mensagemErro = 'E-mail inválido.';
                    }
                    break;
            }
        }

        if (!ehValido) {
            showError(input, mensagemErro);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }
    
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.erro');
        errorElement.textContent = message;
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.erro');
        errorElement.textContent = '';
    }
    
    // --- MÁSCARA DE TELEFONE ---
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            if (value.length > (value.includes('9', 5) ? 10 : 9) ) { // Adapta para 8 ou 9 dígitos no corpo
                value = `${value.slice(0, -4)}-${value.slice(-4)}`;
            }
            e.target.value = value;
        });
    }
});