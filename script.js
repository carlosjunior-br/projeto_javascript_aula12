const carregarLivros = () => {
    fetch('livros.json')
        .then(response => response.json())
        .then(data => {
            exibirLivros(data)
        })
        .catch(error => console.error('Erro ao carregar os livros:', error))
}

const exibirLivros = (livros) => {
    const listaLivros = document.getElementById('lista-livros')
    listaLivros.innerHTML = ''
    livros.forEach((livro) => {
        listaLivros.innerHTML += `
            <div class="card mt-2">
                <div class="card-body">
                    <h5>${livro.titulo} - ${livro.autor}</h5>
                    <p>Gênero: ${livro.genero}</p>
                    <p>Ano: ${livro.ano}</p>
                    <p>Avaliação: ${livro.avaliacao || 'Não avaliado'}</p>
                    <input type="number" class="form-control mb-2" placeholder="Avaliação (1-5)" min="1" max="5" data-titulo="${livro.titulo}">
                    <button class="btn btn-success avaliar" data-titulo="${livro.titulo}">Avaliar</button>
                </div>
            </div>
        `
    })
}

const adicionarLivro = (livro) => {
    fetch('livros.json')
        .then(response => response.json())
        .then(data => {
            data.push(livro)
            salvarLivros(data)
        })
        .catch(error => console.error('Erro ao adicionar livro:', error))
}

const salvarLivros = (livros) => {
    const blob = new Blob([JSON.stringify(livros, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'livros.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

const buscarLivro = (termo) => {
    fetch('livros.json')
        .then(response => response.json())
        .then(data => {
            const resultados = data.filter(livro =>
                livro.titulo.toLowerCase().includes(termo.toLowerCase()) ||
                livro.autor.toLowerCase().includes(termo.toLowerCase()) ||
                livro.genero.toLowerCase().includes(termo.toLowerCase())
            )
            exibirLivros(resultados)
        })
        .catch(error => console.error('Erro ao buscar livro:', error))
}

const classificarLivros = (criterio) => {
    fetch('livros.json')
        .then(response => response.json())
        .then(data => {
            const livrosOrdenados = data.sort((a, b) => {
                if (a[criterio] < b[criterio]) return -1
                if (a[criterio] > b[criterio]) return 1
                return 0
            })
            exibirLivros(livrosOrdenados)
        })
        .catch(error => console.error('Erro ao classificar livros:', error))
}

const avaliarLivro = (titulo, avaliacao) => {
    fetch('livros.json')
        .then(response => response.json())
        .then(data => {
            const livro = data.find(l => l.titulo === titulo)
            if (livro) {
                livro.avaliacao = avaliacao
                salvarLivros(data)
            }
        })
        .catch(error => console.error('Erro ao avaliar livro:', error))
}

// Eventos
const formAdicionar = document.getElementById('form-adicionar')
formAdicionar.addEventListener('submit', (event) => {
    let tituloLivro = document.getElementById('titulo')
    let autorLivro = document.getElementById('autor')
    let generoLivro = document.getElementById('genero')
    let anoLivro = document.getElementById('ano')
    event.preventDefault()
    const novoLivro = {
        titulo: tituloLivro.value,
        autor: autorLivro.value,
        genero: generoLivro.value,
        ano: anoLivro.value
    }
    adicionarLivro(novoLivro)
    formAdicionar.reset()
    tituloLivro.focus()
})

const btnBuscar = document.getElementById('btn-buscar')
const termoBusca = document.getElementById('busca')
btnBuscar.addEventListener('click', () => {
    buscarLivro(termoBusca.value)
})

let btnClassificar = document.getElementById('btn-classificar')
const criterio = document.getElementById('classificacao')
btnClassificar.addEventListener('click', () => {
    classificarLivros(criterio.value)
})

const listaLivros = document.getElementById('lista-livros')
listaLivros.addEventListener('click', (event) => {
    if (event.target.classList.contains('avaliar')) {
        const titulo = event.target.getAttribute('data-titulo')
        const avaliacao = parseInt(event.target.previousElementSibling.value)
        if (avaliacao >= 1 && avaliacao <= 5) {
            avaliarLivro(titulo, avaliacao)
        }
    }
})

// Carregar livros ao iniciar
window.onload = carregarLivros()