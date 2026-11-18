# From Stardust

![JavaScript](https://img.shields.io/badge/linguagem-JavaScript-blue)

Experiência visual de rolagem sobre a história do Universo e da humanidade, desde as primeiras estrelas até reflexões sobre o futuro.

## Tecnologias

HTML, CSS e JavaScript, com GSAP e ScrollTrigger carregados por CDN. O vídeo e sua imagem de prévia estão no repositório.

## Executar

É necessário um navegador moderno. Para iniciar um servidor local com Git e Python 3:

```sh
git clone https://github.com/sauloz20/from-stardust.git
cd from-stardust
python -m http.server 8000
```

Acesse `http://localhost:8000/`. Uma conexão à internet é necessária para carregar as bibliotecas externas de animação.

## Estrutura

```text
index.html                      Conteúdo e estrutura
style.css                       Estilos
script.js                       Animações e interações
video/universo-cosmico.mp4      Vídeo de fundo
video/universo-cosmico-poster.jpg  Imagem de prévia
```

O projeto é uma experiência estática e não exige backend ou banco de dados.
